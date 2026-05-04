"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, DollarSign, Clock, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";

interface Requirement {
  id: string;
  title: string;
  description: string;
  category: { id: string; name: string };
  quantity: number;
  unit: string;
  deliveryLocation: string;
  closingDatetime: string;
  budgetMin: number | null;
  budgetMax: number | null;
  budgetHidden: boolean;
  biddingMode: string;
  visibility: string;
  buyer: { email: string; isVerified: boolean; kycStatus: string; tier: string };
}

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children?: CategoryNode[];
};

const BIDDING_MODE_COLORS: Record<string, string> = {
  SEALED: "bg-purple-100 text-purple-800",
  OPEN: "bg-blue-100 text-blue-800",
  DIRECT: "bg-amber-100 text-amber-800"
};

export function RequirementsListing() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [role, setRole] = useState<"BUYER" | "SUPPLIER" | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({
    categoryId: "",
    location: "",
    biddingMode: "",
    budgetMin: "",
    budgetMax: "",
    verifiedOnly: false,
    closingBefore: ""
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await apiFetch("/api/me");
        setRole(user.role);

        const data = await apiFetch("/api/categories");
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    loadData();
    loadRequirements();
  }, []);

  const loadRequirements = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;

      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      if (filters.categoryId) params.append("categoryId", filters.categoryId);
      if (filters.location) params.append("location", filters.location);
      if (filters.biddingMode) params.append("biddingMode", filters.biddingMode);
      if (filters.closingBefore) params.append("closingBefore", filters.closingBefore);

      const data = await apiFetch(`/api/requirements?${params.toString()}`);

      if (reset) {
        setRequirements(data.data);
      } else {
        setRequirements((prev) => [...prev, ...data.data]);
      }

      setHasMore(data.count === 10);
      if (reset) setPage(1);
    } catch (err) {
      console.error("Failed to load requirements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    loadRequirements(true);
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    loadRequirements();
  };

  const getClosingCountdown = (closingDate: string) => {
    const now = new Date();
    const closing = new Date(closingDate);
    const diff = closing.getTime() - now.getTime();

    if (diff < 0) return "Closed";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m left`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h left`;
    return `${Math.floor(diff / 86400000)}d left`;
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Procurement Feed</h1>
          <p className="mt-1 text-sm text-slate-600">
            {role === "SUPPLIER"
              ? "Browse requirements and manage your catalog"
              : "Browse live procurement opportunities"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {role === "BUYER" && (
            <Button asChild className="h-11 rounded-lg bg-[#2563EB] text-white">
              <Link href="/create-requirement" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Requirement
              </Link>
            </Button>
          )}

          {role === "SUPPLIER" && (
            <Button asChild className="h-11 rounded-lg bg-[#2563EB] text-white">
              <Link href="/create-catalog" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Catalog
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Filters</h2>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Category</label>
              <select
                value={filters.categoryId}
                onChange={(e) => handleFilterChange("categoryId", e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="">All Categories</option>
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

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Location</label>
              <Input
                placeholder="City or state"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="h-10 rounded-lg border-slate-200"
              />
            </div>

            {/* Bidding Mode Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Bidding Mode</label>
              <div className="space-y-2">
                {["SEALED", "OPEN", "DIRECT"].map((mode) => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.biddingMode === mode}
                      onChange={() => handleFilterChange("biddingMode", filters.biddingMode === mode ? "" : mode)}
                      className="rounded"
                    />
                    <span className="text-sm text-slate-700">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Verified Only */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => handleFilterChange("verifiedOnly", e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium text-slate-700">Verified Buyers Only</span>
              </label>
            </div>

            {/* Closing Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Closing Before</label>
              <Input
                type="date"
                value={filters.closingBefore}
                onChange={(e) => handleFilterChange("closingBefore", e.target.value)}
                className="h-10 rounded-lg border-slate-200"
              />
            </div>

            <Button onClick={handleApplyFilters} className="w-full h-10 rounded-lg bg-[#2563EB] text-white">
              Apply Filters
            </Button>
          </Card>
        </div>

        {/* Requirements Grid */}
        <div className="lg:col-span-3">
          {requirements.length === 0 && !loading ? (
            <Card className="p-12 text-center">
              <p className="text-slate-600 mb-4">No requirements found</p>
              <p className="text-sm text-slate-500">Try adjusting your filters or check back later</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {requirements.map((req) => (
                <a key={req.id} href={`/requirements/${req.id}`}>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{req.title}</h3>
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">{req.description}</p>
                        </div>
                        <Badge className="bg-[#2563EB] text-white">{req.category.name}</Badge>
                      </div>

                      <div className="flex items-center gap-6 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{req.quantity}</span>
                          <span>{req.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {req.deliveryLocation}
                        </div>
                        {!req.budgetHidden && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            ₹{req.budgetMin?.toLocaleString()} - ₹{req.budgetMax?.toLocaleString()}
                          </div>
                        )}
                        {req.budgetHidden && (
                          <div className="text-slate-500 italic">Budget: Undisclosed</div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <div className="flex items-center gap-2">
                          <Badge className={BIDDING_MODE_COLORS[req.biddingMode] || ""}>{req.biddingMode}</Badge>
                          {req.buyer.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
                          <Clock className="h-4 w-4" />
                          {getClosingCountdown(req.closingDatetime)}
                        </div>
                      </div>
                    </div>
                  </Card>
                </a>
              ))}

              {hasMore && (
                <div className="text-center pt-4">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    variant="outline"
                    className="h-11 rounded-lg"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
