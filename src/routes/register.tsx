import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthLayout } from "@/components/site/AuthLayout";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "إنشاء حساب — ركيزة" },
      {
        name: "description",
        content:
          "أنشئ حسابك في ركيزة خلال دقائق، واستكشف الخطط ولوحة التحكم قبل تقديم أي طلب استثمار.",
      },
      { property: "og:title", content: "إنشاء حساب في ركيزة" },
      { property: "og:description", content: "ابدأ رحلتك الاستثمارية من 10$ بخطط شهرية واضحة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

type Field = "name" | "email" | "phone" | "password" | "confirm";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Record<Field, string>>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field | "agree", string>>>({});

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (form.name.trim().length < 3) next.name = "أدخل الاسم الكامل.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "أدخل بريداً إلكترونياً صحيحاً.";
    if (!/^\+?[\d\s]{9,15}$/.test(form.phone))
      next.phone = "أدخل رقم هاتف صحيحاً، مثل ‎+963 9xx xxx xxx.";
    if (form.password.length < 8) next.password = "8 أحرف على الأقل.";
    if (form.confirm !== form.password) next.confirm = "كلمتا المرور غير متطابقتين.";
    if (!agree) next.agree = "يجب الموافقة على الشروط والإفصاح عن المخاطر.";
    setErrors(next);
    if (Object.keys(next).length) return;
    toast.success("تم إنشاء الحساب التجريبي بنجاح");
    navigate({ to: "/dashboard" });
  };

  const fields: { k: Field; label: string; type: string; ltr?: boolean; auto: string }[] = [
    { k: "name", label: "الاسم الكامل", type: "text", auto: "name" },
    { k: "email", label: "البريد الإلكتروني", type: "email", ltr: true, auto: "email" },
    { k: "phone", label: "رقم الهاتف", type: "tel", ltr: true, auto: "tel" },
    { k: "password", label: "كلمة المرور", type: "password", ltr: true, auto: "new-password" },
    { k: "confirm", label: "تأكيد كلمة المرور", type: "password", ltr: true, auto: "new-password" },
  ];

  return (
    <AuthLayout title="أنشئ حسابك" subtitle="التسجيل لا يلزمك بأي استثمار. استكشف المنصة أولاً.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        {fields.map((f) => (
          <div key={f.k} className="space-y-2">
            <Label htmlFor={f.k}>{f.label}</Label>
            <Input
              id={f.k}
              type={f.type}
              dir={f.ltr ? "ltr" : undefined}
              className={f.ltr ? "text-start" : undefined}
              value={form[f.k]}
              onChange={set(f.k)}
              autoComplete={f.auto}
              aria-invalid={!!errors[f.k]}
            />
            {errors[f.k] && <p className="text-xs text-destructive">{errors[f.k]}</p>}
          </div>
        ))}
        <div className="flex items-start gap-3 pt-2">
          <Checkbox
            id="agree"
            checked={agree}
            onCheckedChange={(v) => setAgree(v === true)}
            className="mt-1"
          />
          <Label htmlFor="agree" className="text-sm font-normal leading-6 text-muted-foreground">
            قرأت الشروط والإفصاح عن المخاطر، وأفهم أن العوائد مستهدفة وغير مضمونة.{" "}
            <Link to="/about" className="text-primary hover:underline">
              اقرأ التفاصيل
            </Link>
          </Label>
        </div>
        {errors.agree && <p className="text-xs text-destructive">{errors.agree}</p>}
        <Button type="submit" variant="hero" size="lg" className="w-full">
          إنشاء الحساب
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        لديك حساب؟{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </AuthLayout>
  );
}
