import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ArrowUpLeft, Search } from "lucide-react";
import { openCommandPalette } from "@/components/app/CommandPalette";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export const NAV_LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/plans", label: "فرص الاستثمار" },
  { to: "/how-it-works", label: "كيف تعمل المنصة؟" },
  { to: "/about", label: "عن المنصة" },
  { to: "/faq", label: "الأسئلة الشائعة" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-40 px-3 pt-3 md:px-6"
    >
      <div
        className={cn(
          "relative isolate mx-auto flex max-w-7xl items-center justify-between rounded-full ps-4 pe-2 transition-all duration-500 md:px-6",
          scrolled
            ? "h-14 max-w-6xl border border-border-strong bg-background/80 shadow-panel backdrop-blur-xl"
            : "h-16 border border-transparent",
        )}
      >
        <Logo />

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="التنقل الرئيسي"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              onMouseEnter={() => setHovered(l.to)}
              className="relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
            >
              {({ isActive }) => (
                <>
                  {hovered === l.to && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 -z-10 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-l from-primary to-gold"
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </>
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={openCommandPalette}
            aria-label="بحث سريع (Ctrl+K)"
            title="Ctrl / ⌘ + K"
          >
            <Search />
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/login">تسجيل الدخول</Link>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/register">
              ابدأ الاستثمار
              <ArrowUpLeft />
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button variant="hero" size="sm" className="h-10 rounded-full px-4" asChild>
            <Link to="/register">ابدأ الآن</Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="glass" size="icon" className="h-11 w-11" aria-label="فتح القائمة">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[85vw] max-w-80 flex-col border-border bg-sidebar p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            >
              <SheetTitle className="sr-only">القائمة</SheetTitle>
              <Logo />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openCommandPalette();
                }}
                className="mt-6 flex min-h-12 items-center gap-3 rounded-xl border border-border bg-background/40 px-4 text-sm text-muted-foreground"
              >
                <Search className="h-4 w-4" />
                ابحث في المنصة
              </button>
              <nav className="mt-4 flex flex-col gap-1" aria-label="التنقل في الجوال">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    activeOptions={{ exact: true }}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center rounded-xl px-4 py-3 text-base text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-foreground"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2">
                <Button variant="outline" asChild size="lg">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    تسجيل الدخول
                  </Link>
                </Button>
                <Button variant="hero" asChild size="lg">
                  <Link to="/register" onClick={() => setOpen(false)}>
                    ابدأ الاستثمار
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
