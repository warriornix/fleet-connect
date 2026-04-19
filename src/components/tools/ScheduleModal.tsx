import { Modal } from "@/components/Modal";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDate } from "@/lib/helpers";
import type { Database } from "@/integrations/supabase/types";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];
type S = Database["public"]["Tables"]["schedules"]["Row"];

export function ScheduleModal({ onClose }: { onClose: () => void }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [items, setItems] = useState<S[]>([]);
  const [form, setForm] = useState({ vehicle_id: "", title: "", description: "", scheduled_date: "", priority: "MEDIUM" as S["priority"] });

  const load = async () => {
    const [v, s] = await Promise.all([
      supabase.from("vehicles").select("*"),
      supabase.from("schedules").select("*").gte("scheduled_date", new Date().toISOString()).order("scheduled_date").limit(10),
    ]);
    setVehicles(v.data ?? []);
    setItems(s.data ?? []);
    if (v.data?.[0]) setForm((f) => ({ ...f, vehicle_id: v.data[0].id }));
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("schedules").insert({
      ...form, scheduled_date: new Date(form.scheduled_date).toISOString(),
    });
    if (error) return toast.error(error.message);
    toast.success("Scheduled");
    load();
  };

  const priorityColor = (p: string) =>
    p === "URGENT" ? "bg-destructive/10 text-destructive" :
    p === "HIGH" ? "bg-warning/10 text-warning" :
    p === "MEDIUM" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground";

  return (
    <Modal title="Preventive Scheduling" onClose={onClose} size="xl">
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 mb-6">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Vehicle</label>
          <select value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })} required className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">Select…</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Title</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Date</label>
          <input type="date" required value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Priority</label>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as S["priority"] })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {["LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="rounded-md bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold">Schedule task</button>
        </div>
      </form>
      <h3 className="font-semibold text-sm mb-2">Upcoming</h3>
      <div className="space-y-2">
        {items.length === 0 && <p className="text-sm text-muted-foreground">Nothing scheduled.</p>}
        {items.map((s) => (
          <div key={s.id} className="text-sm rounded-md border border-border p-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{s.title}</p>
              <p className="text-xs text-muted-foreground">{formatDate(s.scheduled_date)} · {s.description}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-md font-semibold ${priorityColor(s.priority)}`}>{s.priority}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
