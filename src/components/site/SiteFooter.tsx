import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="relative mt-16 border-t border-border bg-sidebar md:mt-24">
      <div className="hairline-gold absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-12 md:gap-12 md:py-16">
        <div className="md:col-span-5">
          <Logo variant="mono" />
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
            منصة استثمار رقمية تقدم خططاً شهرية بالدولار الأمريكي، بشروط واضحة وتقارير منتظمة،
            للمستثمرين في سوريا.
          </p>
        </div>
        <div className="md:col-span-3">
          <h3 className="mb-4 font-sans text-sm font-semibold text-foreground">المنصة</h3>
          <ul className="grid grid-cols-2 gap-3 text-sm text-muted-foreground md:block md:space-y-3">
            <li>
              <Link to="/plans" className="hover:text-primary">
                فرص الاستثمار
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-primary">
                كيف تعمل المنصة؟
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                عن المنصة والشفافية
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-primary">
                الأسئلة الشائعة
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <h3 className="mb-4 font-sans text-sm font-semibold text-foreground">تنبيه المخاطر</h3>
          <p className="text-sm leading-7 text-muted-foreground">
            جميع العوائد المعروضة مستهدفة وتقديرية وغير مضمونة. الاستثمار ينطوي على مخاطر قد تشمل
            خسارة رأس المال. تُنشر المعلومات القانونية والترخيصية في صفحة «عن المنصة» عند توفرها.
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row">
          <span>© 2026 ركيزة. جميع الحقوق محفوظة.</span>
          <span>هذا نموذج أولي للواجهة — لا تتم أي عمليات مالية حقيقية.</span>
        </div>
      </div>
    </footer>
  );
}
