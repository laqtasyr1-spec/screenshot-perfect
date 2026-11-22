import { useState, type ReactNode } from "react";
import { Link, useNavigate, type LinkProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { Bell, ChevronDown, FlaskConical, LogOut, Menu, Search, UserRound } from "lucide-react";
import { openCommandPalette } from "./CommandPalette";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

export interface NavItem {
  to: NonNullable<LinkProps["to"]>;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

interface Props {
  area: "investor" | "admin";
  nav: NavItem[];
  userName: string;
  userRole: string;
  children: ReactNode;
}

function SideNav({
  nav,
  onNavigate,
  area,
}: {
  nav: NavItem[];
  onNavigate?: (() => void) | undefined;
  area: Props["area"];
}) {
  return (
    <nav
      className="flex flex-col gap-1"
      aria-label={area === "admin" ? "تنقل الإدارة" : "تنقل المستثمر"}
    >
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: item.exact ?? false }}
          onClick={onNavigate}
          className="group relative flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
        >
          {({ isActive }) => (
            <>
              <span
                className={cn(
                  "absolute inset-y-2 start-0 w-0.5 rounded-full bg-primary transition-opacity",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
              <item.icon
                className={cn(
                  "h-[18px] w-[18px]",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
                strokeWidth={1.7}
              />
              {item.label}
            </>
          )}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({ area, nav, userName, userRole, children }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const home = area === "admin" ? "/admin" : "/dashboard";

  const sidebar = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-2">
        <Logo to={home} />
        {area === "admin" && (
          <span className="rounded-md bg-gold-soft px-2 py-0.5 text-[10px] text-gold">إدارة</span>
        )}
      </div>
      <div className="mt-10 flex-1">
        <p className="mb-3 px-3.5 text-[11px] text-muted-foreground">
          {area === "admin" ? "إدارة المنصة" : "حسابي"}
        </p>
        <SideNav nav={nav} onNavigate={onNavigate} area={area} />
      </div>
      <div className="rounded-2xl border border-gold/20 bg-gold-soft p-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-gold">
          <FlaskConical className="h-3.5 w-3.5" />
          بيانات تجريبية
        </div>
        <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
          كل الأرقام هنا توضيحية. لا تتم أي إيداعات أو سحوبات حقيقية قبل ربط نظام خلفي آمن.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="no-print fixed inset-y-0 start-0 z-30 hidden w-72 border-e border-sidebar-border bg-sidebar p-5 lg:block">
        {sidebar()}
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-[85vw] max-w-80 overflow-y-auto border-sidebar-border bg-sidebar p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        >
          <SheetTitle className="sr-only">القائمة</SheetTitle>
          {sidebar(() => setOpen(false))}
        </SheetContent>
      </Sheet>

      <div className="lg:ps-72">
        <header className="no-print sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="فتح القائمة"
              >
                <Menu />
              </Button>
              <div className="lg:hidden">
                <Logo to={home} />
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                onClick={openCommandPalette}
                className="hidden h-10 gap-3 text-muted-foreground md:inline-flex"
                aria-label="بحث سريع"
              >
                <Search />
                <span className="text-xs">انتقال سريع</span>
                <kbd className="num rounded border border-border-strong px-1.5 text-[10px]">
                  Ctrl K
                </kbd>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 md:hidden"
                onClick={openCommandPalette}
                aria-label="بحث سريع"
              >
                <Search />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="الإشعارات"
                className="relative h-11 w-11"
                onClick={() =>
                  navigate({ to: area === "admin" ? "/admin/requests" : "/dashboard/transactions" })
                }
              >
                <Bell />
                <span className="absolute end-2.5 top-2.5 h-2 w-2 rounded-full bg-gold" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-colors hover:bg-accent">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-primary-foreground">
                      {userName.charAt(0)}
                    </span>
                    <span className="hidden text-start sm:block">
                      <span className="block text-sm font-medium leading-4">{userName}</span>
                      <span className="block text-[11px] text-muted-foreground">{userRole}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {area === "investor" ? (
                    <DropdownMenuItem onSelect={() => navigate({ to: "/dashboard/profile" })}>
                      <UserRound className="me-2 h-4 w-4" /> الملف الشخصي والأمان
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onSelect={() => navigate({ to: "/dashboard" })}>
                      <UserRound className="me-2 h-4 w-4" /> عرض لوحة المستثمر
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onSelect={() => navigate({ to: "/" })}>
                    <LogOut className="me-2 h-4 w-4" /> تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
