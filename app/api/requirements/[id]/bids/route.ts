import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { Role, KycStatus } from "@prisma/client";
import { createBidSchema } from "@/lib/validators/bid";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    let user;
    const { id } = await params;

try{

    user = verifyToken(req);

    if(user.role !== Role.SUPPLIER){

    return NextResponse.json(

        {
            message:"Only suppliers can submit bids."
        },

        {
            status:403
        }

    );

}
console.log("User:", user);
if(user.kycStatus !== KycStatus.APPROVED){

    return NextResponse.json(

        {
            message:"Complete KYC verification first."
        },

        {
            status:403
        }

    );

}

        const body = await req.json();

        const parsed = createBidSchema.safeParse(body);

if(!parsed.success){

    return NextResponse.json(

        {

            errors:parsed.error.flatten()

        },

        {

            status:400

        }

    );

}

        const requirement = await prisma.requirement.findUnique({
    where: {
        id
    }
});

         if (!requirement) {
    return NextResponse.json(
        {
            message: "Requirement not found."
        },
        {
            status: 404
        }
    );
}   


if (requirement.closingDatetime <= new Date()) {

    return NextResponse.json(
        {
            message: "Bidding has been closed for this requirement."
        },
        {
            status: 400
        }
    );

}

const existingBid = await prisma.bid.findFirst({
    where: {
        requirementId: id,
        supplierId: user.id
    }
});


if (existingBid) {

    return NextResponse.json(
        {
            message: "You have already submitted a bid for this requirement."
        },
        {
            status: 409
        }
    );

}


// const parsed = createBidSchema.safeParse(body);

const bid = await prisma.bid.create({

    data: {

        requirementId: id,

        supplierId: user.id,

        quotedPrice: parsed.data.quotedPrice,

        quantity: parsed.data.quantity,

        deliveryDays: parsed.data.deliveryDays,

        remarks: parsed.data.remarks

    }

});

return NextResponse.json(

    {

        message: "Bid submitted successfully.",

        bid

    },

    {

        status: 201

    }

);



}catch{

    return NextResponse.json(

        {
            message:"Unauthorized"
        },

        {
            status:401
        }

    );

}
}


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    // Get logged-in user
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

    // Only buyers can access
    if (user.role !== Role.BUYER) {
      return NextResponse.json(
        {
          message: "Only buyers can view bids.",
        },
        {
          status: 403,
        }
      );
    }

    const { id } = await params;

    // Verify requirement belongs to buyer
    const requirement = await prisma.requirement.findFirst({
      where: {
        id,
        buyerId: user.id,
      },
      select: {
        id: true,
        title: true,
        quantity: true,
        unit: true,
      },
    });

    if (!requirement) {
      return NextResponse.json(
        {
          message: "Requirement not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Fetch all bids
    const bids = await prisma.bid.findMany({
      where: {
        requirementId: id,
      },

      include: {
        supplier: {
          select: {
            id: true,
            email: true,
            phone: true,

            supplierProfile: {
              select: {
                companyName: true,
                supplierType: true,
                location: true,
                gst: true,
              },
            },
          },
        },
      },

      orderBy: {
        quotedPrice: "asc",
      },
    });

    return NextResponse.json(
      {
        requirement,
        bids,
      },
      {
        status: 200,
      }
    );

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