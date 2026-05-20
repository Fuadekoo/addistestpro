"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboardIcon, Music4Icon, RadioTowerIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    href: "/",
    label: "Home",
    icon: RadioTowerIcon,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    href: "/songs",
    label: "Songs",
    icon: Music4Icon,
  },
] as const;

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <RadioTowerIcon className="size-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold tracking-tight text-slate-950">
              Addis Music
            </p>
            <p className="text-xs text-slate-500">Dashboard and song library</p>
          </div>
        </Link>

        <nav
          aria-label="Primary"
          className="flex w-full items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50/90 p-1 lg:w-auto"
        >
          {navigationItems.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all lg:flex-none",
                  active
                    ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
                    : "text-slate-500 hover:bg-white hover:text-slate-950",
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
