import { Modal } from "@/components/Modal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { formatCurrency, formatDate } from "@/lib/helpers";
import type { Database } from "@/integrations/supabase/types";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
type M = Database["public"]["Tables"]["maintenance"]["Row"];

export function MaintenanceModal({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [items, setItems] = useState<M[]>([]);
  const [form, setForm] = useState({ vehicle_id: "", type: "Oil change", description: "", cost: 0, provider: "", status: "SCHEDULED" as M["status"], next_due_date: "" });

  const load = async () => {
    const [v, m] = await Promise.all([
      supabase.from("vehicles").select("*"),
      supabase.from("maintenance").select("*").order("date", { ascending: false }).limit(10),
    ]);
    setVehicles(v.data ?? []);
    setItems(m.data ?? []);
    if (v.data?.[0]) setForm((f) => ({ ...f, vehicle_id: v.data[0].id }));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("maintenance").insert({
      ...form, user_id: user.id, next_due_date: form.next_due_date || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Maintenance recorded");
    load();
  };

  return (
    <Modal title="Maintenance Tracking" onClose={onClose} size="xl">
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 mb-6">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Vehicle</label>
          <select value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })} required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">Select…</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
          </select>
        </div>
        <Field label="Type" v={form.type} on={(s) => setForm({ ...form, type: s })} />
        <Field label="Provider" v={form.provider} on={(s) => setForm({ ...form, provider: s })} />
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Cost ($)</label>
          <input type="number" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: Number(e.target.value) })} required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as M["status"] })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Next due</label>
          <input type="date" value={form.next_due_date} onChange={(e) => setForm({ ...form, next_due_date: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="rounded-md bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold">Record service</button>
        </div>
      </form>
      <h3 className="font-semibold text-sm mb-2">Recent records</h3>
      <div className="space-y-2">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No maintenance records.</p>}
        {items.map((m) => (
          <div key={m.id} className="text-sm rounded-md border border-border p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{m.type} · {formatCurrency(Number(m.cost))}</p>
              <p className="text-xs text-muted-foreground">{formatDate(m.date)} {m.provider && `· ${m.provider}`}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-md bg-accent">{m.status}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function Field({ label, v, on }: { label: string; v: string; on: (s: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input value={v} onChange={(e) => on(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
    </div>
  );
}
