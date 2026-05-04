import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const where: any = {
      role: "SUPPLIER"
    };

    // Optional filters
    if (searchParams.get("location")) {
      where.supplierProfile = {
        location: {
          contains: searchParams.get("location"),
          mode: "insensitive"
        }
      };
    }

    if (searchParams.get("supplierType")) {
      where.supplierProfile = {
        ...where.supplierProfile,
        supplierType: searchParams.get("supplierType")
      };
    }

    if (searchParams.get("search")) {
      where.supplierProfile = {
        ...where.supplierProfile,
        companyName: {
          contains: searchParams.get("search"),
          mode: "insensitive"
        }
      };
    }

    const suppliers = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      include: {
        supplierProfile: true
      },
      orderBy: { createdAt: "desc" }
    });

    const total = await prisma.user.count({ where });

    return NextResponse.json({
      page,
      limit,
      total,
      count: suppliers.length,
      data: suppliers
    });

  } catch (err) {
    console.error("GET /api/suppliers error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
