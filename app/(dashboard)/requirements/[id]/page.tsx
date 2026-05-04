"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Loader2, DollarSign, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";

interface RequirementDetail {
  id: string;
  title: string;
  description: string;
  category: { id: string; name: string };
  quantity: number;
  unit: string;
  deliveryLocation: string;
  deliveryDeadline: string;
  closingDatetime: string;
  budgetMin: number | null;
  budgetMax: number | null;
  budgetHidden: boolean;
  biddingMode: string;
  visibility: string;
  status: string;
  buyer: {
    id: string;
    email: string;
    isVerified: boolean;
    tier: string;
  };
  buyerBadge: string;
  createdAt: string;
}

export default function RequirementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [requirement, setRequirement] = useState<RequirementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRequirement = async () => {
      try {
        if (!id) return;
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/signin");
          return;
        }

        const data = await apiFetch(`/api/requirements/${id}`);
        setRequirement(data);
      } catch (err: any) {
        setError(err.message || "Failed to load requirement");
      } finally {
        setLoading(false);
      }
    };

    loadRequirement();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  if (error || !requirement) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button onClick={() => router.back()} variant="outline" className="mb-6 gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Card className="p-8 text-center">
          <p className="text-red-600 font-medium mb-4">{error || "Requirement not found"}</p>
          <Button onClick={() => router.push("/requirements")}>Go to Requirements</Button>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800",
      CLOSED: "bg-gray-100 text-gray-800",
      COMPLETED: "bg-blue-100 text-blue-800"
    };
    return colors[status] || "bg-slate-100 text-slate-800";
  };

  const getBiddingColor = (mode: string) => {
    const colors: Record<string, string> = {
      SEALED: "bg-purple-100 text-purple-800",
      OPEN: "bg-blue-100 text-blue-800",
      DIRECT: "bg-amber-100 text-amber-800"
    };
    return colors[mode] || "bg-slate-100 text-slate-800";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button onClick={() => router.back()} variant="outline" className="mb-6 gap-2">
        <ChevronLeft className="h-4 w-4" />
        Back
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{requirement.title}</h1>
            <div className="flex flex-wrap gap-3 mt-3">
              <Badge className={getStatusColor(requirement.status)}>
                {requirement.status}
              </Badge>
              <Badge className={getBiddingColor(requirement.biddingMode)}>
                {requirement.biddingMode}
              </Badge>
              {requirement.visibility && (
                <Badge variant="outline">{requirement.visibility}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Description</h2>
            <p className="text-slate-600 leading-relaxed">{requirement.description}</p>
          </Card>

          {/* Details */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600">Category</p>
                  <p className="text-base font-medium text-slate-900">{requirement.category.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Quantity Required</p>
                  <p className="text-base font-medium text-slate-900">
                    {requirement.quantity} {requirement.unit}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-2">Delivery Location</p>
                <div className="flex items-center gap-2 text-slate-900">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{requirement.deliveryLocation}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                <div>
                  <p className="text-sm text-slate-600">Delivery Deadline</p>
                  <p className="text-base font-medium text-slate-900">
                    {formatDate(requirement.deliveryDeadline)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Bid Closing</p>
                  <p className="text-base font-medium text-slate-900">
                    {formatDateTime(requirement.closingDatetime)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Budget Card */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-slate-400" />
              <h3 className="font-semibold text-slate-900">Budget</h3>
            </div>
            {requirement.budgetHidden ? (
              <p className="text-slate-600">Budget Undisclosed</p>
            ) : (
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-slate-600">Minimum</p>
                  <p className="text-lg font-semibold text-slate-900">
                    ₹{requirement.budgetMin?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Maximum</p>
                  <p className="text-lg font-semibold text-slate-900">
                    ₹{requirement.budgetMax?.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Buyer Info */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-slate-400" />
              <h3 className="font-semibold text-slate-900">Posted By</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-600">Email</p>
                <p className="text-sm font-medium text-slate-900">{requirement.buyer.email}</p>
              </div>
              <div className="flex gap-2">
                {requirement.buyer.isVerified && (
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                )}
                <Badge variant="outline">{requirement.buyer.tier}</Badge>
              </div>
              {requirement.buyerBadge && (
                <div className="pt-2 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-600 uppercase">Badge</p>
                  <p className="text-sm text-slate-900">{requirement.buyerBadge}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Posted Date */}
          <Card className="p-6 bg-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <p className="text-xs text-slate-600 uppercase font-medium">Posted</p>
            </div>
            <p className="text-sm text-slate-900">{formatDateTime(requirement.createdAt)}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
