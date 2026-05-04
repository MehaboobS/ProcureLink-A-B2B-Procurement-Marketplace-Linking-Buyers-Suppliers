"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";

export function TopBar() {
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

  return (
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
  );
}
