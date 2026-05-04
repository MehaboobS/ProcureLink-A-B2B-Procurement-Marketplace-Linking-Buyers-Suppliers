"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, FileText, MessageSquare, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

const buyerNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/requirements", label: "Requirements", icon: FileText },
  { href: "/create-requirement", label: "Create Requirement", icon: FileText },
  { href: "/bids", label: "Bids", icon: MessageSquare },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User }
];

const supplierNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/requirements", label: "Browse Requirements", icon: FileText },
  { href: "/create-catalog", label: "Add Catalog", icon: FileText },
  { href: "/bids", label: "Bids", icon: MessageSquare },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: User }
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"BUYER" | "SUPPLIER" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const user = await apiFetch("/api/me");
        setRole(user.role);
      } catch (err) {
        console.error("Failed to load role:", err);
      } finally {
        setLoading(false);
      }
    };
    loadRole();
  }, []);

  const items = role === "BUYER" ? buyerNavItems : supplierNavItems;

  const NavContent = () => (
    <nav className="space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className="w-full justify-start gap-2 rounded-lg"
              onClick={() => setOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}

      {/* Role-aware catalog view */}
      <Link href="/suppliers/catalog">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 rounded-lg"
          onClick={() => setOpen(false)}
        >
          <FileText className="h-4 w-4" />
          {role === "SUPPLIER" ? "View My Catalog" : "View Catalogs"}
        </Button>
      </Link>

      <div className="pt-4 border-t border-slate-200 mt-4">
        <div className="px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
          {role === "BUYER" ? "Buyer" : "Supplier"}
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2 rounded-lg text-red-600 hover:text-red-700"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/signin";
        }}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white px-4 py-6">
        <div className="mb-8">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-[#2563EB]">ProcureLink</h1>
          </Link>
        </div>
        <NavContent />
      </aside>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center px-4 py-3 border-b border-slate-200 bg-white">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#2563EB]">ProcureLink</h1>
            </div>
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
