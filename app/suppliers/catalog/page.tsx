"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Loader2 } from "lucide-react";

type Me = { id: string; role: string } | null;

type Product = {
  id: string;
  name: string;
  specs: string;
  moq: number;
  leadTime: number;
  supplyArea: string;
  supplier: {
    id: string;
    companyName: string;
    location: string;
    supplierType: string;
    isVerified: boolean;
  };
};

export default function CatalogPage() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [me, setMe] = useState<Me>(null);
  const [scope, setScope] = useState<"mine" | "all">("mine");

  const fetchProducts = async (p = 1, scopeParam?: "mine" | "all") => {
    setLoading(true);
    try {
      const s = scopeParam || scope;
      const supplierQuery = s === "all" ? "&supplierId=all" : "";
      const res = await apiFetch(`/api/suppliers/catalog?page=${p}${supplierQuery}`);
      setProducts(res.data || []);
      setTotal(res.total || 0);
      setPage(res.page || 1);
    } catch (err: any) {
      console.error("Failed to load catalog:", err.message || err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // load user role and products
    (async () => {
      try {
        const u = await apiFetch("/api/me");
        setMe(u || null);
        // default scope: suppliers see their own items; others see all
        if (u?.role === "SUPPLIER") {
          setScope("mine");
          await fetchProducts(1, "mine");
        } else {
          setScope("all");
          await fetchProducts(1, "all");
        }
      } catch (err) {
        // unauthenticated or error -> show all
        setMe(null);
        setScope("all");
        await fetchProducts(1, "all");
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Catalog</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
        </div>
      ) : (
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="text-center text-slate-600">No products found.</div>
          ) : (
            products.map((p) => (
              <div key={p.id} className="border rounded p-4 flex justify-between items-start">
                <div>
                  <Link href={`/suppliers/catalog/${p.id}`} className="text-lg font-medium hover:underline">
                    {p.name}
                  </Link>
                  <div className="text-sm text-slate-600 mt-1">{p.specs}</div>
                  <div className="mt-2 text-xs text-slate-500">MOQ: {p.moq} • Lead time: {p.leadTime} days</div>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <div>{p.supplier.companyName}</div>
                  <div className="text-xs">{p.supplier.location}</div>
                </div>
              </div>
            ))
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">Total: {total}</div>
            <div className="space-x-2 flex items-center">
              {me?.role === "SUPPLIER" && (
                <div className="mr-4">
                  <label className="text-sm mr-2">View:</label>
                  <select
                    value={scope}
                    onChange={(e) => {
                      const s = e.target.value as "mine" | "all";
                      setScope(s);
                      fetchProducts(1, s);
                    }}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="mine">My catalogs</option>
                    <option value="all">All suppliers</option>
                  </select>
                </div>
              )}
              <div className="space-x-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => fetchProducts(Math.max(1, page - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>
              <button
                className="px-3 py-1 border rounded"
                onClick={() => fetchProducts(page + 1)}
                disabled={products.length === 0}
              >
                Next
              </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
