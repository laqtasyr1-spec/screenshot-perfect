# Redesign brief (archived)

> Original visual-identity and motion redesign prompt, kept for reference. Project docs live in the root README.md.

Redesign the visual identity and motion of this Arabic RTL investment platform ("ركيزة") so a first-time investor feels two things in the first 10 seconds: awe at the craft, and trust in the business. Do everything below in ONE pass.

## Hard rules (project rules, do not break)
- Do NOT change business logic. All plan tiers, rates and return math stay only in src/lib/plans.ts; UI must call it, never re-derive numbers.
- Keep the demo-data / demo-store setup, routes, route tree (never edit routeTree.gen.ts), and the existing tests passing.
- No new dependencies. Use what is installed: framer-motion, recharts, cmdk, lucide-react, tailwind v4.
- Keep RTL-first: logical utilities (ps/pe/start/end), wrap figures in the `num` utility.
- Reuse and extend src/components/fx/ and the CSS utilities in src/styles.css. No one-off animations.
- Keep every risk/legal notice and the wording "تقديري وغير مضمون" / "بيانات تجريبية". Never imply guaranteed profit. No fabricated stats, fake testimonials, fake "live payouts" tickers or fake user counters. No rockets, confetti, or up-only hype visuals.

## 1) Color system (change tokens only in src/styles.css, then remove hardcoded colors)
Replace the palette tokens with a calmer, trust-oriented one (dark theme stays):
- --background: oklch(0.17 0.03 255); --surface: oklch(0.215 0.035 255); --surface-raised: oklch(0.255 0.038 255)
- --primary (sapphire, brand): oklch(0.72 0.115 232); --primary-glow: oklch(0.80 0.12 225); --primary-foreground: oklch(0.16 0.04 250)
- --gold (prestige accents only): oklch(0.80 0.09 85)
- NEW --success: oklch(0.74 0.15 158) exposed as --color-success. Use it ONLY for positive money values, gains, "active/approved" statuses and check marks.
- --info: oklch(0.78 0.08 195); keep destructive/warning; muted-foreground oklch(0.72 0.02 250) for better contrast.
- chart-1 primary, chart-2 gold, chart-3 success, chart-4 slate, chart-5 destructive.
- Update --gradient-hero/emerald/featured/panel and the glow shadows to the new primary. Rename the "emerald" utilities to "brand" and update all usages.
IMPORTANT: styles.css contains hardcoded emerald oklch(0.696 0.149 162.5) values (spotlight, beam, grid-floor, pulse-dot, ring, selection). Replace every one with color-mix(in oklab, var(--primary) X%, transparent) so the whole site follows the tokens. Then grep components for text-emerald/bg-emerald/hardcoded colors and fix them. Ensure WCAG AA contrast for text.

## 2) Motion philosophy: "calm, precise, institutional"
- Motion must communicate trust: smooth easing (existing ease-out-expo), no bounce, no flashing, durations 0.4–0.9s, transform/opacity only.
- Reduce clutter: keep only 3 signature moments (below). Remove Particles and grid-floor from inner pages, make Aurora "soft" and 2 blobs max, drop the always-on shine/shimmer loops except on the single primary CTA.
- Add <MotionConfig reducedMotion="user"> at the root; also gate SVG animateMotion and setInterval loops behind prefers-reduced-motion.
- Pause infinite animations when off-screen (IntersectionObserver) and disable heavy blur/noise/tilt on (pointer: coarse) and small screens.

## 3) Three signature moments
A. Hero: a "pillar" emblem (brand = ركيزة = pillar). Three isometric pillars rise one by one with a gold cap that lands last, tied to the headline reveal. Split headline by WORDS (never letters; Arabic letters must stay joined). Stat numbers count up once.
B. Scroll story for "How it works": replace the cards with a pinned scroll-driven timeline of one monthly cycle (deposit → review → activation → day 30 maturity → withdraw or renew). A line draws along the path as the user scrolls, each step lights up with a check drawing itself. Use useScroll/useTransform. On mobile fall back to a simple stacked reveal.
C. Calculator: slider with visible tier markers (<$100, $100–1000, >$1000) so the rate step is understood at a glance; rolling odometer digits for results; a pillar that grows with the amount; a 12-month view comparing "with renewal" vs "without". All numbers from plans.ts, with a clear "estimates, not guaranteed" label.

## 4) Trust-building micro-motion across the product
- "Transparency strip": key terms (minimum $10, 1-month cycle, 3 declared plans, risks disclosed) appear with draw-on check icons when scrolled into view.
- Risk notice: calm fade-in with a subtle gold hairline; always readable, never hidden.
- Investor dashboard: spring number transitions on stat cards; skeleton loaders; layout animations when lists change; a countdown ring to the next maturity date; a progress bar across the 30 days for each investment.
- Request lifecycle stepper (submitted → under review → active → matured, and for withdrawals: requested → approved → paid) with animated connecting line and the current step gently pulsing.
- Transactions: reference number per operation with a copy button (animated feedback) and a small expandable timeline; "export statement" button (print-friendly view is enough).
- Forms (login/register/invest/withdraw): inline validation with smooth error/success transitions, a draw-on check on success, and a clear confirmation screen before submitting money requests.
- Command palette (Ctrl/Cmd+K) using the installed cmdk to jump between pages.
- Buttons: press scale 0.98, visible focus ring in --ring, hover lift on cards via the existing spotlight.
- Toasts: sonner with an Undo action where it makes sense.

## 5) Quality bar
- Lazy-load recharts charts; avoid layout shift; keep animations at 60fps on a mid-range phone.
- Check at 375px and 1440px, RTL, keyboard navigation and reduced-motion.
- Run lint/tests/build and fix anything broken. When done, summarize the changes in 10 lines.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/263ee978-59e2-448c-9e79-c3f00979b7a0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
