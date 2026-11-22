import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Mail, Phone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel } from "@/components/app/ui";
import { demoActions, useDemoStore } from "@/lib/demo-store";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({
    meta: [{ title: "الملف الشخصي والأمان — ركيزة" }, { name: "robots", content: "noindex" }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const investor = useDemoStore((s) => s.investor);
  const [info, setInfo] = useState({
    name: investor.name,
    email: investor.email,
    phone: investor.phone,
    city: investor.city,
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    twoFactor: false,
    emailNotif: true,
    smsNotif: false,
    monthlyReport: true,
  });

  const saveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (info.name.trim().length < 3 || !/^\S+@\S+\.\S+$/.test(info.email)) {
      toast.error("تحقق من الاسم والبريد الإلكتروني.");
      return;
    }
    demoActions.updateProfile(info);
    toast.success("تم حفظ المعلومات الشخصية");
  };

  const changePw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.current) return setPwError("أدخل كلمة المرور الحالية.");
    if (pw.next.length < 8) return setPwError("كلمة المرور الجديدة 8 أحرف على الأقل.");
    if (pw.next !== pw.confirm) return setPwError("كلمتا المرور غير متطابقتين.");
    setPwError(null);
    setPw({ current: "", next: "", confirm: "" });
    toast.success("تم تحديث كلمة المرور (تجريبي)");
  };

  return (
    <>
      <PageHeader
        title="الملف الشخصي والأمان"
        description="إدارة معلوماتك الشخصية وإعدادات الحساب وكلمة المرور."
      />
      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <Panel className="h-fit p-6 text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-gradient font-display text-3xl font-semibold text-primary-foreground">
            {investor.name.charAt(0)}
          </span>
          <p className="mt-4 text-lg font-semibold">{investor.name}</p>
          <p className="text-sm text-muted-foreground">
            عضو منذ {formatDate(investor.memberSince)}
          </p>
          <div className="mt-6 space-y-3 text-start text-sm">
            <p className="flex items-center gap-2.5 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span dir="ltr">{investor.email}</span>
            </p>
            <p className="flex items-center gap-2.5 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span dir="ltr">{investor.phone}</span>
            </p>
            <p className="flex items-center gap-2.5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> حالة التحقق:{" "}
              <span className="text-primary">موثّق (تجريبي)</span>
            </p>
          </div>
        </Panel>

        <Tabs defaultValue="info">
          <TabsList className="h-11">
            <TabsTrigger value="info" className="px-4">
              المعلومات الشخصية
            </TabsTrigger>
            <TabsTrigger value="security" className="px-4">
              الأمان
            </TabsTrigger>
            <TabsTrigger value="settings" className="px-4">
              إعدادات الحساب
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <Panel className="p-6">
              <form onSubmit={saveInfo} className="grid gap-5 md:grid-cols-2">
                {(
                  [
                    ["name", "الاسم الكامل", false],
                    ["city", "المدينة", false],
                    ["email", "البريد الإلكتروني", true],
                    ["phone", "رقم الهاتف", true],
                  ] as const
                ).map(([k, label, ltr]) => (
                  <div key={k} className="space-y-2">
                    <Label htmlFor={`p-${k}`}>{label}</Label>
                    <Input
                      id={`p-${k}`}
                      dir={ltr ? "ltr" : undefined}
                      className={ltr ? "text-start" : undefined}
                      value={info[k]}
                      onChange={(e) => setInfo((s) => ({ ...s, [k]: e.target.value }))}
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <Button type="submit" variant="hero">
                    حفظ التغييرات
                  </Button>
                </div>
              </form>
            </Panel>
          </TabsContent>

          <TabsContent value="security" className="mt-4">
            <Panel className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <KeyRound className="h-5 w-5 text-gold" />
                <h2 className="font-sans text-base font-semibold">تغيير كلمة المرور</h2>
              </div>
              <form onSubmit={changePw} className="grid max-w-lg gap-4">
                {(
                  [
                    ["current", "كلمة المرور الحالية"],
                    ["next", "كلمة المرور الجديدة"],
                    ["confirm", "تأكيد كلمة المرور الجديدة"],
                  ] as const
                ).map(([k, label]) => (
                  <div key={k} className="space-y-2">
                    <Label htmlFor={`pw-${k}`}>{label}</Label>
                    <Input
                      id={`pw-${k}`}
                      type="password"
                      dir="ltr"
                      className="text-start"
                      value={pw[k]}
                      onChange={(e) => setPw((s) => ({ ...s, [k]: e.target.value }))}
                    />
                  </div>
                ))}
                {pwError && (
                  <p className="text-sm text-destructive" role="alert">
                    {pwError}
                  </p>
                )}
                <Button type="submit" variant="hero" className="w-fit">
                  تحديث كلمة المرور
                </Button>
              </form>
            </Panel>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <Panel>
              {(
                [
                  ["twoFactor", "التحقق بخطوتين", "رمز إضافي عند تسجيل الدخول وطلبات السحب."],
                  ["emailNotif", "إشعارات البريد الإلكتروني", "تنبيهات الاستحقاق وحالة الطلبات."],
                  ["smsNotif", "رسائل SMS", "تنبيه فوري عند أي طلب سحب من حسابك."],
                  ["monthlyReport", "التقرير الشهري", "ملخص شهري للدورات والعمليات."],
                ] as const
              ).map(([k, title, desc]) => (
                <div
                  key={k}
                  className="flex items-center justify-between gap-6 border-t border-border px-6 py-5 first:border-t-0"
                >
                  <div>
                    <p className="font-medium">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={settings[k]}
                    onCheckedChange={(v) => {
                      setSettings((s) => ({ ...s, [k]: v }));
                      toast.success(v ? `تم تفعيل: ${title}` : `تم إيقاف: ${title}`);
                    }}
                    aria-label={title}
                  />
                </div>
              ))}
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
