import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(`otp:${email}`, otp, 'EX', 300);

    console.log('Resent OTP:', otp);

    return NextResponse.json({
      message: 'OTP resent successfully',
    });
  } catch (error) {
    console.error('Error resending OTP:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}