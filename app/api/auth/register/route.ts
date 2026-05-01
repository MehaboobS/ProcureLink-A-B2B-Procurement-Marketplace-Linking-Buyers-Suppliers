import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redis } from '@/lib/redis';
import { registerSchema } from '@/lib/validators';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { email, password, role, entityType } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashed,
        role,
        entityType
      }
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redis.set(`otp:${email}`, otp, 'EX', 300);

    console.log("OTP:", otp);

    return NextResponse.json({
      message: 'User registered. OTP sent.',
      userId: user.id
    });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}