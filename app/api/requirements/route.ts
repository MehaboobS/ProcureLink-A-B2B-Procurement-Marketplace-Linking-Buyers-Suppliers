import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { requirementSchema } from "@/lib/validators/requirement";
import { getBuyerBadge } from "@/lib/utils/badge";

// =====================
// CREATE REQUIREMENT
// =====================
export async function POST(req: NextRequest) {
  try {
    const user = verifyToken(req);

    if (user.role !== "BUYER") {
      return NextResponse.json({ error: "Only buyers allowed" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = requirementSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Requirement validation failed:", parsed.error);
      return NextResponse.json({
        error: "Validation failed",
        details: parsed.error.flatten()
      }, { status: 400 });
    }

    const data = parsed.data;

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Invalid categoryId" },
        { status: 400 }
      );
    }

    const requirement = await prisma.requirement.create({
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        buyerId: user.id,
        quantity: Number(data.quantity),
        unit: data.unit,
        deliveryLocation: data.deliveryLocation,
        deliveryDeadline: new Date(data.deliveryDeadline),
        budgetMin: data.budgetMin ?? null,
        budgetMax: data.budgetMax ?? null,
        budgetHidden: data.budgetHidden ?? false,
        closingDatetime: new Date(data.closingDatetime),
        biddingMode: data.biddingMode,
        visibility: data.visibility,
        specDocumentUrl: data.specDocumentUrl ?? null,
        tags: data.tags ?? [],
      },
    });

    return NextResponse.json(requirement);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// =====================
// LIST REQUIREMENTS
// =====================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    // filters
    if (searchParams.get("categoryId")) {
      where.categoryId = searchParams.get("categoryId");
    }

    if (searchParams.get("location")) {
      where.deliveryLocation = {
        contains: searchParams.get("location"),
        mode: "insensitive"
      };
    }

    if (searchParams.get("biddingMode")) {
      where.biddingMode = searchParams.get("biddingMode");
    }

    if (searchParams.get("status")) {
      where.status = searchParams.get("status");
    }

    if (searchParams.get("closingBefore")) {
      where.closingDatetime = {
        lte: new Date(searchParams.get("closingBefore")!)
      };
    }

    if (searchParams.get("search")) {
      where.title = {
        contains: searchParams.get("search"),
        mode: "insensitive"
      };
    }

    const requirements = await prisma.requirement.findMany({
      where,
      skip,
      take: limit,
      include: {
        buyer: true,
        category: true
      },
      orderBy: { createdAt: "desc" }
    });

    const data = requirements.map((r) => ({
      ...r,
      buyerBadge: getBuyerBadge(r.buyer.kycStatus, r.buyer.tier)
    }));

    return NextResponse.json({
      page,
      count: data.length,
      data
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}