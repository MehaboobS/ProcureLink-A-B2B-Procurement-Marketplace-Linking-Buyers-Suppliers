import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Fetch supplier with all related data
    const supplier = await prisma.user.findUnique({
      where: { id },
      include: {
        supplierProfile: {
          include: {
            categories: {
              include: {
                category: true
              }
            },
            certifications: true,
            products: true
          }
        }
      }
    });

    if (!supplier || supplier.role !== "SUPPLIER") {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    if (!supplier.supplierProfile) {
      return NextResponse.json(
        { error: "Supplier profile incomplete" },
        { status: 404 }
      );
    }

    // Transform the data for public profile
    const profile = {
      // User info
      id: supplier.id,
      email: supplier.email,
      isVerified: supplier.isVerified,
      kycStatus: supplier.kycStatus,
      tier: supplier.tier,
      createdAt: supplier.createdAt,

      // Company info
      company: {
        name: supplier.supplierProfile.companyName,
        type: supplier.supplierProfile.supplierType,
        location: supplier.supplierProfile.location,
        yearEstablished: supplier.supplierProfile.yearEstablished,
        gst: supplier.supplierProfile.gst
      },

      // Categories
      categories: supplier.supplierProfile.categories.map((sc) => ({
        id: sc.category.id,
        name: sc.category.name,
        slug: sc.category.slug
      })),

      // Certifications
      certifications: supplier.supplierProfile.certifications.map((cert) => ({
        id: cert.id,
        name: cert.name,
        documentUrl: cert.documentUrl
      })),

      // Products
      products: supplier.supplierProfile.products.map((product) => ({
        id: product.id,
        name: product.name,
        specs: product.specs,
        moq: product.moq,
        leadTime: product.leadTime,
        supplyArea: product.supplyArea
      })),

      // TODO: Add ratings once Rating model is created
      // averageRating: 4.5,
      // totalReviews: 12
    };

    return NextResponse.json(profile);

  } catch (err) {
    console.error("GET /api/suppliers/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
