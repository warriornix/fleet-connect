import { Modal } from "@/components/Modal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { calcMpg, formatCurrency } from "@/lib/helpers";
import type { Database } from "@/integrations/supabase/types";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
type Log = Database["public"]["Tables"]["fuel_logs"]["Row"];

export function FuelManagementModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [form, setForm] = useState({ vehicle_id: "", gallons: 0, cost: 0, mileage: 0, odometer: 0, fuel_type: "REGULAR" as Log["fuel_type"], notes: "" });

  const load = async () => {
    const [v, l] = await Promise.all([
      supabase.from("vehicles").select("*"),
      supabase.from("fuel_logs").select("*").order("date", { ascending: false }).limit(10),
    ]);
    setVehicles(v.data ?? []);
    setLogs(l.data ?? []);
    if (v.data?.[0]) setForm((f) => ({ ...f, vehicle_id: v.data[0].id }));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicle_id || !user) return;
    const { error } = await supabase.from("fuel_logs").insert({ ...form, user_id: user.id });
    if (error) return toast.error(error.message);
    toast.success(`Fuel log added · ${calcMpg(form.mileage, form.gallons)} MPG`);
    load();
  };

  return (
    <Modal title="Fuel Management" onClose={onClose} size="xl">
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 mb-6">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Vehicle</label>
          <select value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })} required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">Select…</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
          </select>
        </div>
        <Num label="Gallons" v={form.gallons} on={(n) => setForm({ ...form, gallons: n })} step="0.01" />
        <Num label="Cost ($)" v={form.cost} on={(n) => setForm({ ...form, cost: n })} step="0.01" />
        <Num label="Miles since last fill" v={form.mileage} on={(n) => setForm({ ...form, mileage: n })} />
        <Num label="Odometer" v={form.odometer} on={(n) => setForm({ ...form, odometer: n })} />
        <div>
          <label className="text-sm font-medium">Fuel type</label>
          <select value={form.fuel_type} onChange={(e) => setForm({ ...form, fuel_type: e.target.value as Log["fuel_type"] })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {["REGULAR", "MIDGRADE", "PREMIUM", "DIESEL", "ELECTRIC"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="rounded-md bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold w-full sm:w-auto">Add fuel log</button>
        </div>
      </form>
      <h3 className="font-semibold text-sm mb-2">Recent logs</h3>
      <div className="space-y-2">
        {logs.length === 0 && <p className="text-sm text-muted-foreground">No logs yet.</p>}
        {logs.map((l) => (
          <div key={l.id} className="flex items-center justify-between text-sm rounded-md border border-border p-3">
            <div>
              <p className="font-medium">{Number(l.gallons).toFixed(2)} gal · {formatCurrency(Number(l.cost))}</p>
              <p className="text-xs text-muted-foreground">{new Date(l.date).toLocaleDateString()} · {calcMpg(l.mileage, Number(l.gallons))} MPG</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-md bg-accent">{l.fuel_type}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function Num({ label, v, on, step }: { label: string; v: number; on: (n: number) => void; step?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input type="number" required step={step ?? "1"} value={v} onChange={(e) => on(Number(e.target.value))} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
    </div>
  );
}
