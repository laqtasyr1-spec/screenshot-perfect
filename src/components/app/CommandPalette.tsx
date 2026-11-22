import { useEffect, useState } from "react";
import { useNavigate, type LinkProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownToLine,
  BarChart3,
  FileText,
  HelpCircle,
  Home,
  Info,
  Layers,
  LayoutDashboard,
  LogIn,
  PlusCircle,
  Receipt,
  ShieldCheck,
  UserPlus,
  UserRound,
  Users,
  Workflow,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type Item = { to: NonNullable<LinkProps["to"]>; label: string; icon: LucideIcon };

const GROUPS: { heading: string; items: Item[] }[] = [
  {
    heading: "الموقع",
    items: [
      { to: "/", label: "الرئيسية", icon: Home },
      { to: "/plans", label: "فرص الاستثمار والحاسبة", icon: Layers },
      { to: "/how-it-works", label: "كيف تعمل المنصة؟", icon: Workflow },
      { to: "/about", label: "عن المنصة والشفافية", icon: Info },
      { to: "/faq", label: "الأسئلة الشائعة", icon: HelpCircle },
      { to: "/login", label: "تسجيل الدخول", icon: LogIn },
      { to: "/register", label: "إنشاء حساب", icon: UserPlus },
    ],
  },
  {
    heading: "لوحة المستثمر",
    items: [
      { to: "/dashboard", label: "نظرة عامة", icon: LayoutDashboard },
      { to: "/dashboard/invest", label: "طلب استثمار جديد", icon: PlusCircle },
      { to: "/dashboard/investments", label: "استثماراتي", icon: Layers },
      { to: "/dashboard/transactions", label: "سجل العمليات", icon: Receipt },
      { to: "/dashboard/withdrawals", label: "السحوبات", icon: ArrowDownToLine },
      { to: "/dashboard/profile", label: "الملف الشخصي", icon: UserRound },
    ],
  },
  {
    heading: "الإدارة",
    items: [
      { to: "/admin", label: "لوحة الإدارة", icon: ShieldCheck },
      { to: "/admin/users", label: "المستخدمون", icon: Users },
      { to: "/admin/requests", label: "الطلبات", icon: FileText },
      { to: "/admin/reports", label: "التقارير", icon: BarChart3 },
    ],
  },
];

export const OPEN_PALETTE_EVENT = "rakiza:open-palette";
export const openCommandPalette = () => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));

/** Ctrl/⌘ + K to jump anywhere. */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="إلى أين تريد الذهاب؟" />
      <CommandList>
        <CommandEmpty>لا توجد صفحة مطابقة.</CommandEmpty>
        {GROUPS.map((g) => (
          <CommandGroup key={g.heading} heading={g.heading}>
            {g.items.map((it) => (
              <CommandItem
                key={it.to}
                value={`${it.label} ${it.to}`}
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: it.to });
                }}
                className="min-h-11 gap-3"
              >
                <it.icon className="h-4 w-4 text-muted-foreground" />
                {it.label}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
