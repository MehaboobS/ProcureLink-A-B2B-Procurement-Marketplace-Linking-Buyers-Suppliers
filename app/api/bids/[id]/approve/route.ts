import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { BidStatus, Role } from "@prisma/client";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    let user;

    try {

      user = verifyToken(req);

    } catch {

      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }

    if (user.role !== Role.BUYER) {

      return NextResponse.json(
        {
          message: "Only buyers can accept bids.",
        },
        {
          status: 403,
        }
      );

    }

    const { id } = await params;

    // Find the selected bid
    const bid = await prisma.bid.findUnique({

      where: {
        id,
      },

      include: {

        supplier: {

          include: {

            supplierProfile: true,

          },

        },

        requirement: true,

      },

    });

    if (!bid) {

      return NextResponse.json(
        {
          message: "Bid not found.",
        },
        {
          status: 404,
        }
      );

    }

    // Verify buyer owns the requirement

    if (bid.requirement.buyerId !== user.id) {

      return NextResponse.json(
        {
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );

    }

    const acceptedBid = await prisma.bid.findFirst({
  where: {
    requirementId: bid.requirementId,
    status: BidStatus.ACCEPTED,
  },
});

if (acceptedBid) {
  return NextResponse.json(
    {
      message: "A bid has already been accepted for this requirement.",
    },
    {
      status: 409,
    }
  );
}

    // Transaction

    await prisma.$transaction(async (tx) => {

      // Reject all other bids

      await tx.bid.updateMany({

        where: {

          requirementId: bid.requirementId,

          id: {

            not: bid.id,

          },

        },

        data: {

          status: BidStatus.REJECTED,

        },

      });

      // Accept selected bid

      await tx.bid.update({

        where: {

          id: bid.id,

        },

        data: {

          status: BidStatus.ACCEPTED,

        },

      });

      // Later we will create Connection here

    });

    return NextResponse.json({

      message: "Bid accepted successfully.",

      supplier: {

        email: bid.supplier.email,

        phone: bid.supplier.phone,

        companyName: bid.supplier.supplierProfile?.companyName,

        location: bid.supplier.supplierProfile?.location,

        gst: bid.supplier.supplierProfile?.gst,

      },

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