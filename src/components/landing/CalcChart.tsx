import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RenewalPoint } from "@/lib/plans";
import { formatUSDFixed } from "@/lib/format";

/** 12-month estimate: renewing every cycle vs. a single cycle. Lazy-loaded. */
export default function CalcChart({ data, months }: { data: RenewalPoint[]; months: number }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 6, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="calcFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={(m: number) => (m === 0 ? "0" : `ش${m}`)}
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          domain={["dataMin", "auto"]}
        />
        <ReferenceLine x={months} stroke="var(--gold)" strokeDasharray="3 3" />
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border-strong)",
            borderRadius: 12,
            direction: "rtl",
          }}
          labelStyle={{ color: "var(--muted-foreground)" }}
          labelFormatter={(m) => `الشهر ${m}`}
          formatter={(v: number, name) => [
            formatUSDFixed(v),
            name === "withRenewal" ? "مع التجديد" : "دون تجديد",
          ]}
        />
        <Area
          type="monotone"
          dataKey="withoutRenewal"
          stroke="var(--chart-4)"
          strokeDasharray="4 4"
          fill="none"
          strokeWidth={1.5}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="withRenewal"
          stroke="var(--primary)"
          fill="url(#calcFill)"
          strokeWidth={2.5}
          animationDuration={700}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
