import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all categories
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    // Build tree
    const map = new Map();

    // Step 1: map all nodes
    categories.forEach((cat: typeof categories[0]) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    // Step 2: build hierarchy
    const tree: any[] = [];

    categories.forEach((cat: typeof categories[0]) => {
      if (cat.parentId) {
        const parent = map.get(cat.parentId);
        parent.children.push(map.get(cat.id));
      } else {
        tree.push(map.get(cat.id));
      }
    });

    return NextResponse.json(tree);

  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}