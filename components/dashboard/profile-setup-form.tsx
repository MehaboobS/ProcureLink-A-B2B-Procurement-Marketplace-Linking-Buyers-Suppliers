"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const SECTORS = [
  "Manufacturing", "Construction", "Retail", "Healthcare", "Technology",
  "Finance", "Logistics", "Agriculture", "Energy", "Education", "Other"
];

const CONTRACT_TYPES = [
  "Fixed Price", "Time & Materials", "Cost Plus", "Unit Price",
  "Retainer", "Blanket Purchase Agreement", "Other"
];

const SUPPLIER_TYPES = [
  { value: "MANUFACTURER", label: "Manufacturer" },
  { value: "TRADER", label: "Trader" },
  { value: "IMPORTER", label: "Importer" },
  { value: "DISTRIBUTOR", label: "Distributor" }
];

interface ProfileSetupState {
  // Step 1 (both)
  fullName: string;
  city: string;
  state: string;
  sectors: string[];

  // Step 2 - Buyer
  contractTypes: string[];
  gst: string;

  // Step 2 - Supplier
  supplierType: string;
  categories: string[];
  supplyReach: string[];

  // Step 3
  documents: {
    gstCert?: File | null;
    panCert?: File | null;
    companyReg?: File | null;
  };
}

export function ProfileSetupForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ProfileSetupState>({
    fullName: "",
    city: "",
    state: "",
    sectors: [],
    contractTypes: [],
    gst: "",
    supplierType: "",
    categories: [],
    supplyReach: [],
    documents: {}
  });

  const isBuyer = profile?.role === "BUYER";
  const isSupplier = profile?.role === "SUPPLIER";

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/signin");
          return;
        }

        const data = await apiFetch("/api/me");
        setProfile(data);

        // Load form with existing data
        if (data.role === "BUYER" && data.buyerProfile) {
          setForm((prev) => ({
            ...prev,
            city: data.buyerProfile.location?.split(",")[0] || "",
            gst: data.buyerProfile.gst || ""
          }));
        } else if (data.role === "SUPPLIER" && data.supplierProfile) {
          setForm((prev) => ({
            ...prev,
            city: data.supplierProfile.location || "",
            supplierType: data.supplierProfile.supplierType || "",
          }));
        }

        // Load categories
        const categoriesData = await apiFetch("/api/categories");
        setCategories(categoriesData);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleInputChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const toggleMultiSelect = (field: string, value: string) => {
    setForm((prev) => {
      const current = prev[field as keyof ProfileSetupState] as string[];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value]
      };
    });
  };

  const handleSave = async () => {
    if (step === 1) {
      if (!form.fullName || !form.city || !form.state || form.sectors.length === 0) {
        setError("Please fill all Step 1 fields");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (isBuyer && (!form.gst)) {
        setError("Please fill all Step 2 fields");
        return;
      }
      if (isSupplier && (!form.supplierType || form.categories.length === 0 || form.supplyReach.length === 0)) {
        setError("Please fill all Step 2 fields");
        return;
      }

      try {
        setSaving(true);
        const payload = isBuyer
          ? {
              companyName: form.fullName,
              location: form.city + ", " + form.state,
              gst: form.gst
            }
          : {
              companyName: form.fullName,
              location: form.city,
              supplierType: form.supplierType,
              gst: form.gst
            };

        await apiFetch("/api/me", {
          method: "PUT",
          body: JSON.stringify(payload)
        });

        setStep(3);
      } catch (err: any) {
        setError(err.message || "Failed to save profile");
      } finally {
        setSaving(false);
      }
    }
  };

  const handleComplete = () => {
    router.push("/dashboard");
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
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Complete Your Profile</h1>
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

      {/* Step 1 */}
      {step === 1 && (
        <Card className="p-8 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>

          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={form.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Your full name"
              className="h-11 rounded-lg border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="City"
                className="h-11 rounded-lg border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-11 justify-start text-left font-normal">
                    {form.state || "Select state"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start">
                  <Command>
                    <CommandEmpty>No state found.</CommandEmpty>
                    <CommandGroup>
                      {STATES.map((state) => (
                        <CommandItem
                          key={state}
                          value={state}
                          onSelect={() => handleInputChange("state", state)}
                        >
                          {state}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Sectors of Work</Label>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((sector) => (
                <Badge
                  key={sector}
                  variant={form.sectors.includes(sector) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleMultiSelect("sectors", sector)}
                >
                  {sector}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSave}
            className="w-full h-11 rounded-lg bg-[#2563EB] text-white gap-2"
          >
            Continue to Step 2
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Card>
      )}

      {/* Step 2 - Buyer */}
      {step === 2 && isBuyer && (
        <Card className="p-8 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Buyer Details</h2>

          <div className="space-y-3">
            <Label>Contract Types You Work On</Label>
            <div className="flex flex-wrap gap-2">
              {CONTRACT_TYPES.map((type) => (
                <Badge
                  key={type}
                  variant={form.contractTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleMultiSelect("contractTypes", type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>GST Number</Label>
            <Input
              value={form.gst}
              onChange={(e) => handleInputChange("gst", e.target.value)}
              placeholder="GST number"
              className="h-11 rounded-lg border-slate-200"
            />
          </div>

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
              onClick={handleSave}
              disabled={saving}
              className="flex-1 h-11 rounded-lg bg-[#2563EB] text-white gap-2"
            >
              {saving ? "Saving..." : "Continue to Step 3"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2 - Supplier */}
      {step === 2 && isSupplier && (
        <Card className="p-8 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Supplier Details</h2>

          <div className="space-y-2">
            <Label>Supplier Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {SUPPLIER_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={form.supplierType === type.value ? "default" : "outline"}
                  onClick={() => handleInputChange("supplierType", type.value)}
                  className="h-11 rounded-lg"
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Product Categories</Label>
            <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3 space-y-2">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.categories.includes(cat.id)}
                    onChange={() => toggleMultiSelect("categories", cat.id)}
                    className="rounded"
                  />
                  <span className="text-sm text-slate-700">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Geographic Supply Reach</Label>
            <div className="flex flex-wrap gap-2">
              {STATES.map((state) => (
                <Badge
                  key={state}
                  variant={form.supplyReach.includes(state) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleMultiSelect("supplyReach", state)}
                >
                  {state.substring(0, 3)}
                </Badge>
              ))}
            </div>
          </div>

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
              onClick={handleSave}
              disabled={saving}
              className="flex-1 h-11 rounded-lg bg-[#2563EB] text-white gap-2"
            >
              {saving ? "Saving..." : "Continue to Step 3"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3 - Document Upload */}
      {step === 3 && (
        <Card className="p-8 space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Document Upload</h2>
          <p className="text-sm text-slate-600">Upload your business documents (optional)</p>

          <div className="space-y-4">
            {[
              { name: "GST Certificate", id: "gstCert" },
              { name: "PAN Certificate", id: "panCert" },
              { name: "Company Registration", id: "companyReg" }
            ].map((doc) => (
              <div key={doc.id} className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">{doc.name}</p>
                <p className="text-xs text-slate-500 mt-1">Click to upload or drag and drop</p>
                <input type="file" className="hidden" />
              </div>
            ))}
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
              onClick={handleComplete}
              className="flex-1 h-11 rounded-lg bg-[#2563EB] text-white"
            >
              Complete Setup
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
