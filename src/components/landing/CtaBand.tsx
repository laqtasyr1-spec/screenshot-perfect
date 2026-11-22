import { Link } from "@tanstack/react-router";
import { ArrowUpLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/Reveal";
import { Aurora } from "@/components/fx/Aurora";
import { SplitText } from "@/components/fx/SplitText";

export function CtaBand() {
  return (
    <section className="px-6">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-gold/25 bg-featured px-5 py-12 text-center sm:px-8 md:py-20">
        <Aurora />
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-gold/15 blur-3xl" />
        <div className="relative">
          <SplitText
            as="h2"
            onView
            text="ابدأ بمبلغ صغير، وافهم *قبل* أن تتوسّع."
            className="mx-auto max-w-2xl text-[1.7rem] font-semibold leading-[1.3] sm:text-3xl md:text-5xl"
          />
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground sm:mt-5 sm:text-base sm:leading-8">
            أنشئ حسابك خلال دقائق، واستكشف لوحة التحكم، ولا تقدّم أي طلب قبل قراءة الشروط كاملة.
          </p>
          <div className="mt-7 grid gap-2.5 sm:mt-9 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
            <Button variant="hero" size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/register">
                إنشاء حساب
                <ArrowUpLeft />
              </Link>
            </Button>
            <Button variant="glass" size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/about">اقرأ الشروط والمخاطر</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
