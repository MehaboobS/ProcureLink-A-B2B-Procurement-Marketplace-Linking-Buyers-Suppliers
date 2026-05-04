"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";

const UNITS = ["Pieces", "Sets", "Kg", "Liters", "Meters", "Boxes", "Cartons", "Tons"];
const BIDDING_MODES = [
  {
    value: "SEALED",
    label: "Sealed Bid",
    description: "Suppliers submit sealed bids, lowest wins"
  },
  {
    value: "OPEN",
    label: "Open Auction",
    description: "Dynamic bidding with visible prices"
  },
  {
    value: "DIRECT",
    label: "Direct Proposal",
    description: "Direct negotiation with shortlisted suppliers"
  }
];
const VISIBILITY_OPTIONS = [
  { value: "ALL", label: "All Suppliers" },
  { value: "VERIFIED", label: "Verified Only" },
  { value: "PREMIUM", label: "Growth+ Tier" }
];

interface CreateRequirementState {
  // Step 1
  title: string;
  categoryId: string;
  description: string;
  quantity: string;
  unit: string;

  // Step 2
  deliveryLocation: string;
  deliveryDeadline: string;
  budgetMin: string;
  budgetMax: string;
  budgetHidden: boolean;
  closingDatetime: string;

  // Step 3
  biddingMode: string;
  visibility: string;
  specDocumentUrl: string;
}

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children?: CategoryNode[];
};

export function CreateRequirementForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CreateRequirementState>({
    title: "",
    categoryId: "",
    description: "",
    quantity: "",
    unit: "Pieces",
    deliveryLocation: "",
    deliveryDeadline: "",
    budgetMin: "",
    budgetMax: "",
    budgetHidden: false,
    closingDatetime: "",
    biddingMode: "OPEN",
    visibility: "ALL",
    specDocumentUrl: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/signin");
          return;
        }

        const categoriesData = await apiFetch("/api/categories");
        setCategories(categoriesData);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleInputChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.title || !form.categoryId || !form.description || !form.quantity || !form.unit) {
        setError("Please fill all Step 1 fields");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!form.deliveryLocation || !form.deliveryDeadline || !form.closingDatetime) {
        setError("Please fill all Step 2 required fields");
        return;
      }
      if (!form.budgetHidden && (!form.budgetMin || !form.budgetMax)) {
        setError("Please fill budget or enable Undisclosed");
        return;
      }
      setStep(3);
    }
  };

  const handlePublish = async () => {
    try {
      setSaving(true);

      const payload: any = {
        title: form.title,
        categoryId: form.categoryId,
        description: form.description,
        quantity: Number(form.quantity),
        unit: form.unit,
        deliveryLocation: form.deliveryLocation,
        deliveryDeadline: form.deliveryDeadline,
        closingDatetime: form.closingDatetime,
        biddingMode: form.biddingMode,
        visibility: form.visibility,
        budgetHidden: form.budgetHidden,
      };

      // Only add budget fields if not hidden
      if (!form.budgetHidden) {
        payload.budgetMin = Number(form.budgetMin);
        payload.budgetMax = Number(form.budgetMax);
      }

      // Only add optional fields if they have values
      if (form.specDocumentUrl) {
        payload.specDocumentUrl = form.specDocumentUrl;
      }

      const result = await apiFetch("/api/requirements", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      router.push(`/requirements/${result.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create requirement");
    } finally {
      setSaving(false);
    }
  };

  const progressPercent = (step / 3) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Post Requirement</h1>
          <span className="text-sm font-medium text-slate-600">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-[#2563EB] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {error && (
        <Card className="p-4 mb-6 border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      )}

      {/* Step 1 - Basic Info */}
      {step === 1 && (
        <Card className="p-8 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Basic Information</h2>

          <div className="space-y-2">
            <Label>Requirement Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Office Chairs for New Branch"
              className="h-11 rounded-lg border-slate-200"
            />
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <select
              value={form.categoryId}
              onChange={(e) => handleInputChange("categoryId", e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="">Select a category</option>
              {categories.map((parentCategory) => (
                <optgroup key={parentCategory.id} label={parentCategory.name}>
                  {parentCategory.children && parentCategory.children.length > 0 ? (
                    parentCategory.children.map((childCategory) => (
                      <option key={childCategory.id} value={childCategory.id}>
                        {childCategory.name}
                      </option>
                    ))
                  ) : (
                    <option value={parentCategory.id}>{parentCategory.name}</option>
                  )}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <textarea
              value={form.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your requirement in detail..."
              className="w-full p-3 rounded-lg border border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB] resize-none"
              rows={5}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input
                type="number"
                value={form.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="Enter quantity"
                className="h-11 rounded-lg border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label>Unit *</Label>
              <select
                value={form.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={handleNext}
            className="w-full h-11 rounded-lg bg-[#2563EB] text-white gap-2"
          >
            Continue to Step 2
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Card>
      )}

      {/* Step 2 - Delivery & Budget */}
      {step === 2 && (
        <Card className="p-8 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Delivery & Budget</h2>

          <div className="space-y-2">
            <Label>Delivery Location *</Label>
            <Input
              value={form.deliveryLocation}
              onChange={(e) => handleInputChange("deliveryLocation", e.target.value)}
              placeholder="City, State"
              className="h-11 rounded-lg border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Delivery Deadline *</Label>
              <Input
                type="date"
                value={form.deliveryDeadline}
                onChange={(e) => handleInputChange("deliveryDeadline", e.target.value)}
                className="h-11 rounded-lg border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label>Bid Closing Date *</Label>
              <Input
                type="datetime-local"
                value={form.closingDatetime}
                onChange={(e) => handleInputChange("closingDatetime", e.target.value)}
                className="h-11 rounded-lg border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.budgetHidden}
                onChange={(e) => handleInputChange("budgetHidden", e.target.checked)}
                className="rounded"
              />
              Keep Budget Undisclosed
            </Label>
          </div>

          {!form.budgetHidden && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Budget Min *</Label>
                <Input
                  type="number"
                  value={form.budgetMin}
                  onChange={(e) => handleInputChange("budgetMin", e.target.value)}
                  placeholder="0"
                  className="h-11 rounded-lg border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>Budget Max *</Label>
                <Input
                  type="number"
                  value={form.budgetMax}
                  onChange={(e) => handleInputChange("budgetMax", e.target.value)}
                  placeholder="0"
                  className="h-11 rounded-lg border-slate-200"
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1 h-11 gap-2 rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 h-11 rounded-lg bg-[#2563EB] text-white gap-2"
            >
              Continue to Step 3
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3 - Bidding & Visibility */}
      {step === 3 && (
        <Card className="p-8 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Bidding Mode & Visibility</h2>

          <div className="space-y-3">
            <Label>Select Bidding Mode *</Label>
            <div className="grid gap-3">
              {BIDDING_MODES.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => handleInputChange("biddingMode", mode.value)}
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    form.biddingMode === mode.value
                      ? "border-[#2563EB] bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className="font-semibold text-slate-900">{mode.label}</p>
                  <p className="text-sm text-slate-600">{mode.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Visibility *</Label>
            <select
              value={form.visibility}
              onChange={(e) => handleInputChange("visibility", e.target.value)}
              className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              {VISIBILITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            <p className="text-sm font-medium text-slate-700">Specification Document (Optional)</p>
            <p className="text-xs text-slate-500 mt-1">Click to upload or drag and drop</p>
            <input type="file" className="hidden" />
          </div>

          <div className="bg-slate-50 p-6 rounded-lg space-y-3">
            <h3 className="font-semibold text-slate-900">Preview</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-600">Title:</span> <span className="font-medium">{form.title}</span></p>
              <p><span className="text-slate-600">Category:</span> <span className="font-medium">
                {(() => {
                  for (let parent of categories) {
                    if (parent.id === form.categoryId) return parent.name;
                    for (let child of (parent.children || [])) {
                      if (child.id === form.categoryId) return child.name;
                    }
                  }
                  return "Not selected";
                })()}
              </span></p>
              <p><span className="text-slate-600">Quantity:</span> <span className="font-medium">{form.quantity} {form.unit}</span></p>
              <p><span className="text-slate-600">Bidding Mode:</span> <Badge>{form.biddingMode}</Badge></p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="flex-1 h-11 gap-2 rounded-lg"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handlePublish}
              disabled={saving}
              className="flex-1 h-11 rounded-lg bg-[#2563EB] text-white"
            >
              {saving ? "Publishing..." : "Publish Requirement"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
