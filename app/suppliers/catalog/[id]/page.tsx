import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function ProductPage(props: Props) {
  const { id } = (await props.params) as { id: string };
  if (!id || typeof id !== "string") return notFound();

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      supplier: {
        include: {
          user: true
        }
      }
    }
  });

  if (!product) {
    // Defensive: gather a small sample for debugging to show why the product wasn't found
    let sample: { id: string; name: string }[] = [];
    try {
      sample = await prisma.product.findMany({ take: 5, select: { id: true, name: true } });
    } catch (e) {
      console.error("Failed to load sample products:", e);
    }

    console.error(`Product not found for id=${id}`);

    return (
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Product not found</h1>
        <p className="text-sm text-slate-600">Requested id: <strong>{id}</strong></p>
        <div className="mt-4 text-sm text-slate-500">
          <div>No product matched that id. Here are up to 5 sample products from the DB:</div>
          <ul className="list-disc ml-6 mt-2">
            {sample.length === 0 ? (
              <li className="text-sm text-slate-500">No products in database or failed to query.</li>
            ) : (
              sample.map((s) => (
                <li key={s.id} className="text-sm">
                  {s.name} — {s.id}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <Link href="/suppliers/catalog" className="text-sm text-slate-500 hover:underline">
          ← Back to catalog
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-slate-600">Specifications</h3>
          <p className="mt-1 text-slate-800 whitespace-pre-wrap">{product.specs}</p>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs text-slate-500">MOQ</div>
            <div className="text-lg font-medium">{product.moq}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Lead time (days)</div>
            <div className="text-lg font-medium">{product.leadTime}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Supply area</div>
            <div className="text-lg font-medium">{product.supplyArea}</div>
          </div>
        </div>
      </div>

      <section className="border-t pt-4">
        <h2 className="text-lg font-medium">Supplier</h2>
        <div className="mt-3 space-y-1">
          <div className="text-sm font-semibold">{product.supplier.companyName || "—"}</div>
          <div className="text-sm text-slate-600">{product.supplier.location || "—"}</div>
          <div className="text-sm text-slate-500">Type: {product.supplier.supplierType || "—"}</div>
          <div className="text-sm text-slate-500">Verified: {product.supplier.user?.isVerified ? "Yes" : "No"}</div>
        </div>
      </section>
    </div>
  );
}
