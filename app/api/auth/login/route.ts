import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // ✅ Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // ✅ Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    // ✅ Check password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }
    console.log("User authenticated:", user.email);
    console.log("User verification status:", user.isVerified);
    // ✅ Check if verified
    if (!user.isVerified) {
      return NextResponse.json({ error: 'User not verified' }, { status: 403 });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        tier: user.tier,
        kycStatus: user.kycStatus
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

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
    console.error("Login error:", error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}