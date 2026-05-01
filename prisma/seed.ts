import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding categories...");

  const categories = [
    {
      name: "Electrical & Power",
      slug: "electrical-power",
      children: [
        "Wires & Cables",
        "Switchgear",
        "Conduits",
        "Transformers",
        "Lighting",
        "Earthing Materials",
        "Copper/Aluminium Lugs"
      ]
    },
    {
      name: "Civil & Construction",
      slug: "civil-construction",
      children: [
        "Cement",
        "TMT Steel",
        "Bricks",
        "Sand",
        "Aggregates",
        "Waterproofing",
        "Tiles",
        "Plumbing Pipes & Fittings"
      ]
    },
    {
      name: "Industrial Hardware",
      slug: "industrial-hardware",
      children: [
        "Fasteners & Bolts",
        "Bearings",
        "Belts & Pulleys",
        "Valves",
        "Pumps",
        "Welding Consumables"
      ]
    },
    {
      name: "FMCG & Packaging",
      slug: "fmcg-packaging",
      children: [
        "Primary Packaging",
        "Secondary Packaging",
        "Labels",
        "Contract Manufacturing"
      ]
    },
    {
      name: "IT & Electronics",
      slug: "it-electronics",
      children: [
        "Networking Equipment",
        "Servers",
        "Peripherals",
        "Electronic Components"
      ]
    },
    {
      name: "Safety & PPE",
      slug: "safety-ppe",
      children: [
        "Helmets",
        "Gloves",
        "Harnesses",
        "Signage",
        "Fire Safety Equipment"
      ]
    },
    {
      name: "Chemicals & Coatings",
      slug: "chemicals-coatings",
      children: [
        "Paints",
        "Solvents",
        "Adhesives",
        "Industrial Chemicals",
        "Lubricants"
      ]
    },
    {
      name: "Textiles & Uniforms",
      slug: "textiles-uniforms",
      children: [
        "Workwear",
        "Safety Uniforms",
        "Fabric",
        "Embroidery Services"
      ]
    },
    {
      name: "Agriculture & Food",
      slug: "agriculture-food",
      children: [
        "Agri-inputs",
        "Processed Food",
        "Cold Chain Logistics"
      ]
    },
    {
      name: "Others / Custom",
      slug: "others-custom",
      children: [
        "Custom Requirement"
      ]
    }
  ];

  for (const parent of categories) {
    const parentCategory = await prisma.category.upsert({
      where: { slug: parent.slug },
      update: {},
      create: {
        name: parent.name,
        slug: parent.slug,
      }
    });

    for (const child of parent.children) {
      const slug = child.toLowerCase().replace(/ /g, "-");

      await prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          name: child,
          slug,
          parent: {
            connect: {
              id: parentCategory.id
            }
          }
        }
      });
    }
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });