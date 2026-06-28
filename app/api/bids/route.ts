import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const user = verifyToken(req);

    // Only buyers can access
    if (user.role !== Role.BUYER) {
      return NextResponse.json(
        {
          message: "Only buyers can access this resource.",
        },
        {
          status: 403,
        }
      );
    }

    // Fetch buyer's requirements that have at least one bid
    const requirements = await prisma.requirement.findMany({
      where: {
        buyerId: user.id,
        bids: {
          some: {},
        },
      },

      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },

        _count: {
          select: {
            bids: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const response = requirements.map((requirement) => ({
      id: requirement.id,
      title: requirement.title,
      category: requirement.category,
      quantity: requirement.quantity,
      unit: requirement.unit,
      closingDatetime: requirement.closingDatetime,
      status: requirement.status,
      totalBids: requirement._count.bids,
    }));

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}


