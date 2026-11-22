import { Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { Aurora } from "@/components/fx/Aurora";
import { SplitText } from "@/components/fx/SplitText";

export function CtaBand() {
  return (
    <section className="px-6">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-gold/25 bg-featured px-6 py-14 sm:px-8 text-center md:py-20">
        <Aurora />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative">
          <SplitText
            as="h2"
            onView
            text="ابدأ بمبلغ صغير، وافهم *قبل* أن تتوسّع."
            className="mx-auto max-w-2xl text-3xl font-semibold leading-tight md:text-5xl"
          />
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground leading-8">
            أنشئ حسابك خلال دقائق، واستكشف لوحة التحكم، ولا تقدّم أي طلب قبل قراءة الشروط كاملة.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="lg" asChild>
              <Link to="/register">
                إنشاء حساب
                <ArrowUpLeft />
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <Link to="/about">اقرأ الشروط والمخاطر</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
