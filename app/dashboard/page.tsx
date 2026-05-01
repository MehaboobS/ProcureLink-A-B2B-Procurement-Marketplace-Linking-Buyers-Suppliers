"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    // Decode JWT to get user info
    try {
      const parts = token.split(".");
      const payload = JSON.parse(atob(parts[1]));
      setUser(payload);
    } catch (err) {
      console.error("Failed to decode token:", err);
      localStorage.removeItem("token");
      router.push("/signin");
    }

    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#2563EB] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#1E3A5F" }}>
              ProcureLink
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => router.push("/profile")}
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => router.push("/settings")}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              size="sm"
              className="gap-2 text-white"
              style={{ backgroundColor: "#2563EB" }}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 shadow-lg border-0 overflow-hidden">
            <div className="p-8 bg-gradient-to-r from-[#1E3A5F] to-[#2563EB] text-white">
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {user?.email?.split("@")[0]}! 👋
              </h2>
              <p className="text-blue-100">
                You're signed in as {user?.role === "BUYER" ? "a Buyer" : "a Supplier"}
              </p>
            </div>
            <div className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                    Account Status
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {user?.kycStatus === "APPROVED" ? "✓ Verified" : "Pending Verification"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                    Account Tier
                  </p>
                  <p className="text-lg font-bold text-slate-900">{user?.tier || "FREE"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-lg border-0">
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-xs text-slate-600 uppercase font-semibold mb-1">
                  Email
                </p>
                <p className="text-sm font-medium text-slate-900 break-all">{user?.email}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-xs text-slate-600 uppercase font-semibold mb-1">
                  User ID
                </p>
                <p className="text-xs font-mono text-slate-700 break-all">{user?.id?.slice(0, 12)}...</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {user?.role === "BUYER" && (
            <>
              <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Create Requirement</h3>
                  <p className="text-xs text-slate-600">Post your procurement needs</p>
                </div>
              </Card>
              <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">View Bids</h3>
                  <p className="text-xs text-slate-600">Compare supplier quotes</p>
                </div>
              </Card>
            </>
          )}

          {user?.role === "SUPPLIER" && (
            <>
              <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Find Opportunities</h3>
                  <p className="text-xs text-slate-600">Browse available requirements</p>
                </div>
              </Card>
              <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="p-6 text-center">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📤</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Submit Bid</h3>
                  <p className="text-xs text-slate-600">Quote for opportunities</p>
                </div>
              </Card>
            </>
          )}

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Messages</h3>
              <p className="text-xs text-slate-600">Communicate with peers</p>
            </div>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Ratings</h3>
              <p className="text-xs text-slate-600">Build your reputation</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
