import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    console.log("Received OTP verification request for email:", email);

    // Validate input
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    }

    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp || storedOtp !== otp) {
      if (!storedOtp) {
        return NextResponse.json({ error: 'OTP expired or not found. Please register again.' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // OTP verified → delete it
    await redis.del(`otp:${email}`);

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.user.update({
      where: { email },
      data: { isVerified: true }
    });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      tier: user.tier,
      kycStatus: user.kycStatus
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tier: user.tier,
        kycStatus: user.kycStatus
      }
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function signToken(payload: { id: string; email: string; role: string; tier: string; kycStatus: string }) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
}
