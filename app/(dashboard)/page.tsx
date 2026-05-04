"use client";

import { BarChart3, TrendingUp, Users, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    label: "Requirements Posted",
    value: "0",
    icon: BarChart3,
    color: "bg-blue-50 text-blue-600"
  },
  {
    label: "Active Bids",
    value: "0",
    icon: TrendingUp,
    color: "bg-green-50 text-green-600"
  },
  {
    label: "Connections",
    value: "0",
    icon: Users,
    color: "bg-purple-50 text-purple-600"
  },
  {
    label: "Profile Views",
    value: "0",
    icon: Eye,
    color: "bg-amber-50 text-amber-600"
  }
];

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
      import { useEffect, useState } from "react";
      import { useRouter } from "next/navigation";
      import { BarChart3, TrendingUp, Users, Eye, Package, Loader2 } from "lucide-react";
      import { apiFetch } from "@/lib/api";

      const buyerStats = [
        {
          label: "Requirements Posted",
          value: "0",
          icon: BarChart3,
          color: "bg-blue-50 text-blue-600"
        },
        {
          label: "Active Bids",
          value: "0",
          icon: TrendingUp,
          color: "bg-green-50 text-green-600"
        },
        {
          label: "Connections",
          value: "0",
          icon: Users,
          color: "bg-purple-50 text-purple-600"
        },
        {
          label: "Profile Views",
          value: "0",
          icon: Eye,
          color: "bg-amber-50 text-amber-600"
        }
      ];

      const supplierStats = [
        {
          label: "Products Listed",
          value: "0",
          icon: Package,
          color: "bg-blue-50 text-blue-600"
        },
        {
          label: "Active Bids",
          value: "0",
          icon: TrendingUp,
          color: "bg-green-50 text-green-600"
        },
        {
          label: "Connections",
          value: "0",
          icon: Users,
          color: "bg-purple-50 text-purple-600"
        },
        {
          label: "Profile Views",
          value: "0",
          icon: Eye,
          color: "bg-amber-50 text-amber-600"
        }
      ];

      const router = useRouter();
      const [role, setRole] = useState<"BUYER" | "SUPPLIER" | null>(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const loadRole = async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              router.push("/signin");
              return;
            }
            const user = await apiFetch("/api/me");
            setRole(user.role);
          } catch (err) {
            console.error("Failed to load user role:", err);
          } finally {
            setLoading(false);
          }
        };

        loadRole();
      }, [router]);

      if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
          </div>
        );
      }

      const stats = role === "BUYER" ? buyerStats : supplierStats;
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
              <h1 className="text-3xl font-bold text-slate-900">
                {role === "BUYER" ? "Buyer Dashboard" : "Supplier Dashboard"}
              </h1>
              <p className="text-slate-600 mt-1">
                {role === "BUYER"
                  ? "Post requirements and manage supplier bids"
                  : "Manage your products and view buyer requirements"}
              </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
                  {role === "BUYER" && (
                    <a href="/create-requirement" className="block p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                      <p className="font-medium text-slate-900">Create Requirement</p>
                      <p className="text-sm text-slate-600">Post a new procurement request</p>
                    </a>
                  )}
                  {role === "SUPPLIER" && (
                    <a href="/create-catalog" className="block p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                      <p className="font-medium text-slate-900">Add Product to Catalog</p>
                      <p className="text-sm text-slate-600">List your products for sale</p>
                    </a>
                  )}
                  <a href="/requirements" className="block p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
                    <p className="font-medium text-slate-900">View {role === "BUYER" ? "Marketplace" : "Requirements"}</p>
                    <p className="text-sm text-slate-600">{role === "BUYER" ? "Find suppliers and products" : "Browse buyer requirements"}</p>
                  </a>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/create-requirement" className="block p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
              <p className="font-medium text-slate-900">Create Requirement</p>
              <p className="text-sm text-slate-600">Post a new procurement request</p>
            </a>
            <a href="/profile-setup" className="block p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition">
              <p className="font-medium text-slate-900">Complete Profile</p>
              <p className="text-sm text-slate-600">Add your company details and documents</p>
                <p className="text-sm text-slate-600">
                  No activity yet. {role === "BUYER" ? "Create your first requirement" : "Add your first product"} to get started!
                </p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
          <p className="text-sm text-slate-600">No activity yet. Create your first requirement to get started!</p>
        </Card>
      </div>
    </div>
  );
}
