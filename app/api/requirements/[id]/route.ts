import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { requirementSchema } from "@/lib/validators/requirement";
import { getBuyerBadge } from "@/lib/utils/badge";

// =====================
// GET SINGLE
// =====================
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const requirement = await prisma.requirement.findUnique({
      where: { id },
      include: {
        buyer: true,
        category: true
      }
    });

    if (!requirement) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...requirement,
      buyerBadge: getBuyerBadge(
        requirement.buyer.kycStatus,
        requirement.buyer.tier
      )
    });

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// =====================
// UPDATE REQUIREMENT
// =====================
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const user = verifyToken(req);
    const body = await req.json();

    const existing = await prisma.requirement.findUnique({
      where: { id }
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.buyerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (existing.status !== "draft") {
      return NextResponse.json({ error: "Only draft editable" }, { status: 400 });
    }

    const parsed = requirementSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.requirement.update({
      where: { id },
      data: parsed.data
    });

    return NextResponse.json(updated);

  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}