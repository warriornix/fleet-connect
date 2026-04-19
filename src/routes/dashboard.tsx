import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/StatsCard";
import { Truck, Fuel, Wrench, FileCheck2, Search, Calendar, AlertCircle, FileBarChart, BarChart3 } from "lucide-react";
import { VehicleResearchModal } from "@/components/tools/VehicleResearchModal";
import { FuelManagementModal } from "@/components/tools/FuelManagementModal";
import { MaintenanceModal } from "@/components/tools/MaintenanceModal";
import { ScheduleModal } from "@/components/tools/ScheduleModal";
import { RecallSearchModal } from "@/components/tools/RecallSearchModal";
import { ReportGeneratorModal } from "@/components/tools/ReportGeneratorModal";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — VLIP" }] }),
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});

function Dashboard() {
  const { user, isAdmin, isManager, isDriver, roles } = useAuth();
  const [stats, setStats] = useState({ vehicles: 0, fuel: 0, maintenance: 0, certs: 0 });
  const [tool, setTool] = useState<null | "research" | "fuel" | "maintenance" | "schedule" | "recall" | "report">(null);

  useEffect(() => {
    (async () => {
      const [v, f, m, c] = await Promise.all([
        supabase.from("vehicles").select("id", { count: "exact", head: true }),
        supabase.from("fuel_logs").select("id", { count: "exact", head: true }),
        supabase.from("maintenance").select("id", { count: "exact", head: true }),
        supabase.from("certificates").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        vehicles: v.count ?? 0,
        fuel: f.count ?? 0,
        maintenance: m.count ?? 0,
        certs: c.count ?? 0,
      });
    })();
  }, []);

  const tools = [
    { key: "research", label: "Vehicle Research", icon: Search, role: ["admin", "manager"] },
    { key: "fuel", label: "Fuel Management", icon: Fuel, role: ["admin", "manager", "driver"] },
    { key: "maintenance", label: "Maintenance", icon: Wrench, role: ["admin", "manager"] },
    { key: "schedule", label: "Preventive Scheduling", icon: Calendar, role: ["admin", "manager"] },
    { key: "recall", label: "Recall Search", icon: AlertCircle, role: ["admin", "manager"] },
    { key: "report", label: "Reports", icon: FileBarChart, role: ["admin", "manager"] },
  ] as const;

  const visibleTools = tools.filter((t) => t.role.some((r) => roles.includes(r as never)));

  const roleLabel = isAdmin ? "Administrator" : isManager ? "Manager" : isDriver ? "Driver" : "User";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
        <div>
          <p className="text-sm text-muted-foreground">{roleLabel} dashboard</p>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.email?.split("@")[0]}</h1>
        </div>
        <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">{roleLabel}</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard title="Vehicles" value={stats.vehicles} icon={Truck} accent="primary" />
        <StatsCard title="Fuel Logs" value={stats.fuel} icon={Fuel} accent="success" />
        <StatsCard title="Maintenance" value={stats.maintenance} icon={Wrench} accent="warning" />
        <StatsCard title="Certificates" value={stats.certs} icon={FileCheck2} accent="primary" />
      </div>

      {visibleTools.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Fleet management tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {visibleTools.map((t) => (
              <button key={t.key} onClick={() => setTool(t.key)}
                className="rounded-xl border border-border bg-card p-4 hover:shadow-elegant hover:-translate-y-0.5 transition-all text-left">
                <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground"><t.icon className="h-4 w-4" /></div>
                <p className="mt-3 text-sm font-semibold">{t.label}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">Quick links</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickLink to="/vehicles" icon={Truck} title="Manage vehicles" desc="View, edit, and assign your fleet" />
          <QuickLink to="/certificates" icon={FileCheck2} title="Certificates" desc="Blockchain-verified records" />
          {(isAdmin || isManager) && <QuickLink to="/analytics" icon={BarChart3} title="Analytics" desc="Charts & insights" />}
        </div>
      </section>

      {tool === "research" && <VehicleResearchModal onClose={() => setTool(null)} />}
      {tool === "fuel" && <FuelManagementModal onClose={() => setTool(null)} />}
      {tool === "maintenance" && <MaintenanceModal onClose={() => setTool(null)} />}
      {tool === "schedule" && <ScheduleModal onClose={() => setTool(null)} />}
      {tool === "recall" && <RecallSearchModal onClose={() => setTool(null)} />}
      {tool === "report" && <ReportGeneratorModal onClose={() => setTool(null)} />}
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, desc }: { to: string; icon: any; title: string; desc: string }) {
  return (
    <Link to={to} className="rounded-xl border border-border bg-gradient-card p-5 hover:shadow-elegant transition-shadow flex items-start gap-3">
      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><Icon className="h-5 w-5" /></div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </Link>
  );
}
