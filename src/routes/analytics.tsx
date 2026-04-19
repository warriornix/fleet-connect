import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, LineElement,
  PointElement, Tooltip, Legend, Filler,
} from "chart.js";
import { formatCurrency } from "@/lib/helpers";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, Filler);

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — VLIP" }] }),
  component: () => (
    <ProtectedRoute roles={["admin", "manager"]}>
      <Analytics />
    </ProtectedRoute>
  ),
});

function Analytics() {
  const [data, setData] = useState<{ fuel: any[]; maintenance: any[]; vehicles: any[] }>({ fuel: [], maintenance: [], vehicles: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [f, m, v] = await Promise.all([
        supabase.from("fuel_logs").select("date,gallons,cost").order("date"),
        supabase.from("maintenance").select("type,cost"),
        supabase.from("vehicles").select("status"),
      ]);
      setData({ fuel: f.data ?? [], maintenance: m.data ?? [], vehicles: v.data ?? [] });
      setLoading(false);
    })();
  }, []);

  const totalCost = data.fuel.reduce((s, r) => s + Number(r.cost), 0) + data.maintenance.reduce((s, r) => s + Number(r.cost), 0);
  const totalGallons = data.fuel.reduce((s, r) => s + Number(r.gallons), 0);

  const fuelByDay = (() => {
    const map = new Map<string, number>();
    data.fuel.forEach((r) => {
      const d = new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      map.set(d, (map.get(d) ?? 0) + Number(r.cost));
    });
    return { labels: [...map.keys()], values: [...map.values()] };
  })();

  const maintByType = (() => {
    const map = new Map<string, number>();
    data.maintenance.forEach((r) => map.set(r.type, (map.get(r.type) ?? 0) + 1));
    return { labels: [...map.keys()], values: [...map.values()] };
  })();

  const vehiclesByStatus = (() => {
    const map = new Map<string, number>();
    data.vehicles.forEach((r) => map.set(r.status, (map.get(r.status) ?? 0) + 1));
    return { labels: [...map.keys()], values: [...map.values()] };
  })();

  const primary = "rgb(96, 130, 240)";
  const success = "rgb(80, 180, 130)";
  const warning = "rgb(230, 175, 80)";
  const destructive = "rgb(220, 90, 80)";

  if (loading) return <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading analytics…</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total fuel cost", value: formatCurrency(data.fuel.reduce((s, r) => s + Number(r.cost), 0)) },
          { label: "Total maintenance", value: formatCurrency(data.maintenance.reduce((s, r) => s + Number(r.cost), 0)) },
          { label: "Total spend", value: formatCurrency(totalCost) },
          { label: "Total gallons", value: totalGallons.toFixed(1) },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Fuel cost over time</h3>
          {fuelByDay.labels.length ? (
            <Line data={{
              labels: fuelByDay.labels,
              datasets: [{ label: "Cost ($)", data: fuelByDay.values, borderColor: primary, backgroundColor: primary + "33", fill: true, tension: 0.3 }],
            }} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          ) : <Empty />}
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold mb-4">Maintenance by type</h3>
          {maintByType.labels.length ? (
            <Pie data={{
              labels: maintByType.labels,
              datasets: [{ data: maintByType.values, backgroundColor: [primary, success, warning, destructive, "#a5b4fc"] }],
            }} />
          ) : <Empty />}
        </div>
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">Vehicles by status</h3>
          {vehiclesByStatus.labels.length ? (
            <Bar data={{
              labels: vehiclesByStatus.labels,
              datasets: [{ label: "Vehicles", data: vehiclesByStatus.values, backgroundColor: [success, warning, destructive] }],
            }} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          ) : <Empty />}
        </div>
      </div>
    </div>
  );
}

function Empty() {
  return <p className="py-12 text-center text-sm text-muted-foreground">No data yet.</p>;
}
