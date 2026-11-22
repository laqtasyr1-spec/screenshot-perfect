import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MoreHorizontal, UserCheck, UserX, Eye } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EmptyRow,
  FilterSelect,
  PageHeader,
  Panel,
  SearchInput,
  StatusBadge,
  tableCls,
} from "@/components/app/ui";
import { demoActions, useDemoStore } from "@/lib/demo-store";
import type { AdminUser, UserStatus } from "@/lib/demo-data";
import { formatDate, formatUSD } from "@/lib/format";
import { userStatus } from "@/lib/status";

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [{ title: "إدارة المستخدمين — ركيزة" }, { name: "robots", content: "noindex" }],
  }),
  component: UsersPage,
});

function UsersPage() {
  const users = useDemoStore((s) => s.users);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | UserStatus>("all");
  const [city, setCity] = useState("all");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const cities = Array.from(new Set(users.map((u) => u.city)));

  const rows = useMemo(
    () =>
      users.filter(
        (u) =>
          (status === "all" || u.status === status) &&
          (city === "all" || u.city === city) &&
          (q === "" ||
            u.name.includes(q) ||
            u.email.toLowerCase().includes(q.toLowerCase()) ||
            u.id.toLowerCase().includes(q.toLowerCase())),
      ),
    [users, q, status, city],
  );

  const setUser = (u: AdminUser, s: UserStatus) => {
    demoActions.setUserStatus(u.id, s);
    toast.success(`${u.name}: ${userStatus[s].label}`);
  };

  return (
    <>
      <PageHeader title="المستخدمون" description={`${users.length} مستخدم مسجل · بيانات تجريبية`} />
      <Panel>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row">
          <SearchInput value={q} onChange={setQ} placeholder="ابحث بالاسم أو البريد أو الرقم" />
          <FilterSelect
            label="الحالة"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "كل الحالات" },
              { value: "active", label: "نشط" },
              { value: "pending", label: "بانتظار التحقق" },
              { value: "suspended", label: "موقوف" },
            ]}
          />
          <FilterSelect
            label="المدينة"
            value={city}
            onChange={setCity}
            options={[
              { value: "all", label: "كل المدن" },
              ...cities.map((c) => ({ value: c, label: c })),
            ]}
          />
        </div>
        <div className={tableCls.wrap}>
          <table className={tableCls.table}>
            <thead>
              <tr>
                {["المستخدم", "المدينة", "تاريخ التسجيل", "إجمالي الاستثمار", "الحالة", ""].map(
                  (h) => (
                    <th key={h} className={tableCls.th}>
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <EmptyRow colSpan={6} />}
              {rows.map((u) => (
                <tr key={u.id} className={tableCls.tr}>
                  <td className={tableCls.td}>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-raised text-sm font-semibold">
                        {u.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground" dir="ltr">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={tableCls.td}>{u.city}</td>
                  <td className={tableCls.td}>{formatDate(u.joined)}</td>
                  <td className={tableCls.td}>
                    <span className="num font-semibold">{formatUSD(u.invested)}</span>
                  </td>
                  <td className={tableCls.td}>
                    <StatusBadge tone={userStatus[u.status].tone}>
                      {userStatus[u.status].label}
                    </StatusBadge>
                  </td>
                  <td className={tableCls.td}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`إجراءات ${u.name}`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setSelected(u)}>
                          <Eye className="me-2 h-4 w-4" />
                          عرض الملف
                        </DropdownMenuItem>
                        {u.status !== "active" && (
                          <DropdownMenuItem onSelect={() => setUser(u, "active")}>
                            <UserCheck className="me-2 h-4 w-4" />
                            تفعيل الحساب
                          </DropdownMenuItem>
                        )}
                        {u.status !== "suspended" && (
                          <DropdownMenuItem
                            onSelect={() => setUser(u, "suspended")}
                            className="text-destructive"
                          >
                            <UserX className="me-2 h-4 w-4" />
                            إيقاف الحساب
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="border-border-strong bg-popover sm:rounded-2xl">
          {selected && (
            <>
              <DialogHeader className="text-start sm:text-start">
                <DialogTitle className="font-display text-2xl">{selected.name}</DialogTitle>
                <DialogDescription dir="ltr" className="text-end">
                  {selected.email}
                </DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["رقم المستخدم", selected.id],
                  ["المدينة", selected.city],
                  ["تاريخ التسجيل", formatDate(selected.joined)],
                  ["إجمالي الاستثمار", formatUSD(selected.invested)],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-surface-raised p-3.5">
                    <dt className="text-xs text-muted-foreground">{k}</dt>
                    <dd className="mt-1 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
