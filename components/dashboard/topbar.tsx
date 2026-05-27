"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, LayoutDashboard, FileText, MessageSquare, User } from "lucide-react";

export function TopBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const parts = token.split(".");
        const payload = JSON.parse(atob(parts[1]));
        setUser(payload);
      }
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  const items =
    user?.role === "BUYER"
      ? [
          { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/requirements", label: "Requirements", icon: FileText },
          { href: "/create-requirement", label: "Create Requirement", icon: FileText },
          { href: "/bids", label: "Bids", icon: MessageSquare },
          { href: "/messages", label: "Messages", icon: MessageSquare },
          { href: "/profile", label: "Profile", icon: User },
        ]
      : [
          { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/requirements", label: "Browse Requirements", icon: FileText },
          { href: "/create-catalog", label: "Add Catalog", icon: FileText },
          { href: "/bids", label: "Bids", icon: MessageSquare },
          { href: "/messages", label: "Messages", icon: MessageSquare },
          { href: "/profile", label: "Profile", icon: User },
        ];

  return (
    <>
      <div className="hidden md:flex items-center justify-between h-16 border-b border-slate-200 bg-white px-6">
        <div />
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">{user?.email || "User"}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-[#2563EB] text-white text-xs">{user?.tier || "FREE"}</Badge>
              <Badge variant="secondary" className="text-xs">{user?.role || "USER"}</Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-between h-16 border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#1E3A5F] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold text-[#1E3A5F] truncate">ProcureLink</p>
            <p className="text-[11px] text-slate-500 truncate">{user?.email || "User"}</p>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[290px] sm:w-[320px]">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Navigation</p>
              <h2 className="mt-2 text-2xl font-bold text-[#1E3A5F]">ProcureLink</h2>
            </div>

            <div className="mb-6 rounded-2xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-900 truncate">{user?.email || "User"}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge className="bg-[#2563EB] text-white text-xs">{user?.tier || "FREE"}</Badge>
                <Badge variant="secondary" className="text-xs">{user?.role || "USER"}</Badge>
              </div>
            </div>

            <nav className="space-y-2">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start gap-3 rounded-xl h-11"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}

              <Link href="/suppliers/catalog">
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-11">
                  <FileText className="h-4 w-4" />
                  {user?.role === "SUPPLIER" ? "View My Catalog" : "View Catalogs"}
                </Button>
              </Link>

              <div className="pt-3 mt-3 border-t border-slate-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl h-11 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
