"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";

type CatalogFormState = {
  name: string;
  specs: string;
  moq: string;
  leadTime: string;
  supplyArea: string;
};

export function CreateCatalogForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CatalogFormState>({
    name: "",
    specs: "",
    moq: "",
    leadTime: "",
    supplyArea: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }
    setLoading(false);
  }, [router]);

  const handleChange = (field: keyof CatalogFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.name || !form.specs || !form.moq || !form.leadTime || !form.supplyArea) {
      setError("Please fill all fields");
      return;
    }

    try {
      setSaving(true);
      const result = await apiFetch("/api/suppliers/catalog", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          specs: form.specs,
          moq: Number(form.moq),
          leadTime: Number(form.leadTime),
          supplyArea: form.supplyArea
        })
      });

      router.push(`/suppliers/catalog/${result.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create catalog item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Add Catalog Item</h1>
        <p className="mt-1 text-sm text-slate-600">Publish a product for buyers to discover.</p>
      </div>

      {error ? (
        <Card className="mb-6 border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      ) : null}

      <Card className="space-y-6 p-8">
        <div className="space-y-2">
          <Label>Product Name</Label>
          <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Copper Wire 2.5mm" />
        </div>

        <div className="space-y-2">
          <Label>Specs</Label>
          <textarea
            value={form.specs}
            onChange={(e) => handleChange("specs", e.target.value)}
            className="min-h-32 w-full rounded-lg border border-slate-200 p-3"
            placeholder="Material, dimensions, grade, finish..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>MOQ</Label>
            <Input type="number" value={form.moq} onChange={(e) => handleChange("moq", e.target.value)} placeholder="100" />
          </div>
          <div className="space-y-2">
            <Label>Lead Time (days)</Label>
            <Input type="number" value={form.leadTime} onChange={(e) => handleChange("leadTime", e.target.value)} placeholder="7" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Geographic Supply Reach</Label>
          <Input value={form.supplyArea} onChange={(e) => handleChange("supplyArea", e.target.value)} placeholder="Pan India / South India / Bangalore" />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={saving} className="h-11 rounded-lg bg-[#2563EB] text-white">
            {saving ? "Saving..." : "Create Catalog Item"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}