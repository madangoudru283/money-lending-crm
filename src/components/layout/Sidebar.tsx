"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Landmark,
  CreditCard,
  AlertTriangle,
  Menu,
  X,
  IndianRupee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: UserPlus },
  { href: "/borrowers", label: "Borrowers", icon: Users },
  { href: "/loans", label: "Loans", icon: Landmark },
  { href: "/repayments", label: "Repayments", icon: CreditCard },
  { href: "/overdue", label: "Overdue", icon: AlertTriangle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
          <IndianRupee className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white">LendCRM</p>
          <p className="text-xs text-indigo-200">Money Lending</p>
        </div>
      </div>
      <nav className="space-y-1 px-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-indigo-700 text-white"
                  : "text-indigo-100 hover:bg-indigo-700/50 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-indigo-600 p-2 text-white lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-indigo-900">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      <aside className="fixed left-0 top-0 hidden h-full w-64 bg-indigo-900 lg:block">
        <NavContent />
      </aside>
    </>
  );
}
