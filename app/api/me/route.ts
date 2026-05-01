import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userData = verifyToken(req);
    console.log("Authenticated user data:", userData);

    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      include: {
        buyerProfile: true,
        supplierProfile: true
      }
    });
    console.log("User data from database:", user);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    const userData = verifyToken(req);
    const body = await req.json();

    console.log("User:", userData);
    console.log("Body:", body);

    // ======================
    // BUYER
    // ======================
    if (userData.role === 'BUYER') {
      const updated = await prisma.buyerProfile.upsert({
        where: { userId: userData.id },

        update: {
          companyName: body.companyName,
          location: body.location,
          aadhaar: body.aadhaar,
          pan: body.pan,
          gst: body.gst,
          cin: body.cin,
          moa: body.moa,
          workOrder: body.workOrder
        },

        create: {
          userId: userData.id,
          companyName: body.companyName,
          location: body.location,
          aadhaar: body.aadhaar,
          pan: body.pan,
          gst: body.gst,
          cin: body.cin,
          moa: body.moa,
          workOrder: body.workOrder
        }
      });

      return NextResponse.json(updated);
    }

    // ======================
    // SUPPLIER
    // ======================
    if (userData.role === 'SUPPLIER') {
      const updated = await prisma.supplierProfile.upsert({
        where: { userId: userData.id },

        update: {
          companyName: body.companyName,
          location: body.location,
          gst: body.gst,
          yearEstablished: body.yearEstablished,
          supplierType: body.supplierType
        },

        create: {
          userId: userData.id,
          companyName: body.companyName,
          location: body.location,
          gst: body.gst,
          yearEstablished: body.yearEstablished,
          supplierType: body.supplierType || 'MANUFACTURER'
        }
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  } catch (err: any) {
    console.error("PUT /api/me error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}