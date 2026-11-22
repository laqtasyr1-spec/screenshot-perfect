import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/site/AuthLayout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — ركيزة" },
      {
        name: "description",
        content: "سجّل الدخول إلى حسابك في ركيزة لمتابعة استثماراتك وعملياتك وطلبات السحب.",
      },
      { property: "og:title", content: "تسجيل الدخول إلى ركيزة" },
      { property: "og:description", content: "الدخول إلى لوحة تحكم المستثمر في ركيزة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"investor" | "admin">("investor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("أدخل بريداً إلكترونياً صحيحاً.");
    if (password.length < 8) return setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل.");
    setError(null);
    toast.success("تم الدخول إلى الحساب التجريبي");
    navigate({ to: role === "admin" ? "/admin" : "/dashboard" });
  };

  return (
    <AuthLayout title="مرحباً بعودتك" subtitle="سجّل الدخول لمتابعة استثماراتك وعملياتك.">
      <div
        className="mb-8 grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-surface p-1.5"
        role="radiogroup"
        aria-label="نوع الحساب"
      >
        {(
          [
            { id: "investor", label: "مستثمر", icon: UserRound },
            { id: "admin", label: "إدارة", icon: ShieldCheck },
          ] as const
        ).map((r) => (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={role === r.id}
            onClick={() => setRole(r.id)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition-colors",
              role === r.id
                ? "bg-surface-raised text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <r.icon className="h-4 w-4" />
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            dir="ltr"
            className="text-start"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">كلمة المرور</Label>
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => toast.info("ستتوفر استعادة كلمة المرور بعد ربط نظام الحسابات.")}
            >
              نسيت كلمة المرور؟
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              dir="ltr"
              className="pe-11 text-start"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" variant="hero" size="lg" className="w-full">
          {role === "admin" ? "الدخول إلى لوحة الإدارة" : "تسجيل الدخول"}
        </Button>
        <p className="text-center text-xs leading-6 text-muted-foreground">
          للتجربة: أدخل أي بريد صحيح وكلمة مرور من 8 أحرف.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          إنشاء حساب جديد
        </Link>
      </p>
    </AuthLayout>
  );
}
