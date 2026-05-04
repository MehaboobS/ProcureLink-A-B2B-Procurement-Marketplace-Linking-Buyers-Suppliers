import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Try to read auth info; unauthenticated users (and buyers) can still view catalogs
    let userData: any = null;
    try {
      userData = verifyToken(req);
    } catch (e) {
      // no-op: allow public access
    }

    // If a supplier is authenticated and no explicit supplierId filter is passed,
    // default to returning only that supplier's catalogs (their own products).
    if (userData?.role === "SUPPLIER" && !searchParams.get("supplierId")) {
      const supplierProfile = await prisma.supplierProfile.findUnique({
        where: { userId: userData.id }
      });
      if (supplierProfile) {
        where.supplierId = supplierProfile.id;
      }
    }

    // If supplierId query param is provided, respect it (lists catalogs by that supplier)
    // Special case: supplierId=all -> do not filter by supplier (return all suppliers)
    const supplierIdParam = searchParams.get("supplierId");
    if (supplierIdParam) {
      if (supplierIdParam === "all") {
        // explicit request to return catalogs from all suppliers; ensure no supplierId filter
        delete where.supplierId;
      } else {
        // supplier ids are UUID strings in our schema
        where.supplierId = supplierIdParam;
      }
    }

    // Filter by product name (search)
    if (searchParams.get("search")) {
      where.name = {
        contains: searchParams.get("search"),
        mode: "insensitive"
      };
    }

    // Filter by supply area (geographic reach)
    if (searchParams.get("supplyArea")) {
      where.supplyArea = {
        contains: searchParams.get("supplyArea"),
        mode: "insensitive"
      };
    }

    // Filter by MOQ range
    if (searchParams.get("moqMin")) {
      where.moq = {
        gte: Number(searchParams.get("moqMin"))
      };
    }

    if (searchParams.get("moqMax")) {
      where.moq = {
        ...where.moq,
        lte: Number(searchParams.get("moqMax"))
      };
    }

    // Filter by lead time range (in days)
    if (searchParams.get("leadTimeMax")) {
      where.leadTime = {
        lte: Number(searchParams.get("leadTimeMax"))
      };
    }

    // Fetch products with supplier info
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        supplier: {
          include: {
            user: true
          }
        }
      },
      orderBy: { id: "desc" }
    });

    const total = await prisma.product.count({ where });

    // Transform the data for catalog view
    const catalog = products.map((product) => ({
      id: product.id,
      name: product.name,
      specs: product.specs,
      moq: product.moq,
      leadTime: product.leadTime,
      supplyArea: product.supplyArea,
      supplier: {
        id: product.supplier.id,
        userId: product.supplier.userId,
        companyName: product.supplier.companyName,
        location: product.supplier.location,
        supplierType: product.supplier.supplierType,
        isVerified: product.supplier.user.isVerified,
        kycStatus: product.supplier.user.kycStatus,
        tier: product.supplier.user.tier
      }
    }));

    return NextResponse.json({
      page,
      limit,
      total,
      count: catalog.length,
      data: catalog
    });

  } catch (err) {
    console.error("GET /api/suppliers/catalog error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userData = verifyToken(req);

    // Only suppliers can create products
    if (userData.role !== "SUPPLIER") {
      return NextResponse.json(
        { error: "Only suppliers can add products" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate required fields
    const { name, specs, moq, leadTime, supplyArea } = body;

    if (!name || !specs || moq === undefined || leadTime === undefined || !supplyArea) {
      return NextResponse.json(
        { error: "Missing required fields: name, specs, moq, leadTime, supplyArea" },
        { status: 400 }
      );
    }

    // Get supplier profile
    const supplierProfile = await prisma.supplierProfile.findUnique({
      where: { userId: userData.id }
    });

    if (!supplierProfile) {
      return NextResponse.json(
        { error: "Supplier profile not found" },
        { status: 404 }
      );
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: String(name),
        specs: String(specs),
        moq: Number(moq),
        leadTime: Number(leadTime),
        supplyArea: String(supplyArea),
        supplierId: supplierProfile.id
      },
      include: {
        supplier: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json({
      id: product.id,
      name: product.name,
      specs: product.specs,
      moq: product.moq,
      leadTime: product.leadTime,
      supplyArea: product.supplyArea,
      supplierId: product.supplierId,
      message: "Product created successfully"
    }, { status: 201 });

  } catch (err: any) {
    console.error("POST /api/suppliers/catalog error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
