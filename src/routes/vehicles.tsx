import { createFileRoute, Link } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VehicleCard } from "@/components/VehicleCard";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];

export const Route = createFileRoute("/vehicles")({
  head: () => ({ meta: [{ title: "Vehicles — VLIP" }] }),
  component: () => (
    <ProtectedRoute>
      <Vehicles />
    </ProtectedRoute>
  ),
});

function Vehicles() {
  const { isAdmin, isManager } = useAuth();
  const canManage = isAdmin || isManager;
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("vehicles").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setVehicles(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = vehicles.filter((v) =>
    `${v.make} ${v.model} ${v.year} ${v.license_plate} ${v.vin}`.toLowerCase().includes(q.toLowerCase())
  );

  const handleDelete = async (v: Vehicle) => {
    if (!confirm(`Delete ${v.year} ${v.make} ${v.model}?`)) return;
    const { error } = await supabase.from("vehicles").delete().eq("id", v.id);
    if (error) return toast.error(error.message);
    toast.success("Vehicle deleted");
    load();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground text-sm mt-1">{filtered.length} of {vehicles.length} in your fleet</p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <Link to="/vehicle-particulars" className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent">
              3-step wizard
            </Link>
            <button onClick={() => { setEditing(null); setShowForm(true); }}
              className="inline-flex items-center gap-2 rounded-md bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold shadow-elegant hover:shadow-glow transition">
              <Plus className="h-4 w-4" /> Add vehicle
            </button>
          </div>
        )}
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by make, model, plate, VIN…"
          className="w-full pl-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground">No vehicles found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((v) => (
            <VehicleCard key={v.id} vehicle={v} canManage={canManage}
              onEdit={(v) => { setEditing(v); setShowForm(true); }}
              onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showForm && <VehicleForm vehicle={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
    </div>
  );
}

function VehicleForm({ vehicle, onClose, onSaved }: { vehicle: Vehicle | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    make: vehicle?.make ?? "",
    model: vehicle?.model ?? "",
    year: vehicle?.year ?? new Date().getFullYear(),
    vin: vehicle?.vin ?? "",
    license_plate: vehicle?.license_plate ?? "",
    color: vehicle?.color ?? "",
    mileage: vehicle?.mileage ?? 0,
    status: vehicle?.status ?? ("ACTIVE" as Vehicle["status"]),
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (vehicle) {
      const { error } = await supabase.from("vehicles").update(form).eq("id", vehicle.id);
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Vehicle updated");
    } else {
      const { error } = await supabase.from("vehicles").insert(form);
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Vehicle added");
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur p-4">
      <form onSubmit={submit} className="w-full max-w-xl rounded-xl border border-border bg-card p-6 shadow-elegant space-y-4 max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold">{vehicle ? "Edit vehicle" : "Add vehicle"}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Make" value={form.make} onChange={(v) => setForm({ ...form, make: v })} required />
          <Field label="Model" value={form.model} onChange={(v) => setForm({ ...form, model: v })} required />
          <Field label="Year" type="number" value={form.year.toString()} onChange={(v) => setForm({ ...form, year: Number(v) })} required />
          <Field label="Color" value={form.color} onChange={(v) => setForm({ ...form, color: v })} />
          <Field label="VIN" value={form.vin} onChange={(v) => setForm({ ...form, vin: v })} required />
          <Field label="License plate" value={form.license_plate} onChange={(v) => setForm({ ...form, license_plate: v })} required />
          <Field label="Mileage" type="number" value={form.mileage.toString()} onChange={(v) => setForm({ ...form, mileage: Number(v) })} />
          <div>
            <label className="text-sm font-medium">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Vehicle["status"] })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option>ACTIVE</option><option>MAINTENANCE</option><option>RETIRED</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Cancel</button>
          <button type="submit" disabled={busy} className="rounded-md bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold shadow-elegant disabled:opacity-60">{busy ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
