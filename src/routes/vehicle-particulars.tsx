import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/vehicle-particulars")({
  head: () => ({ meta: [{ title: "Vehicle Particulars — VLIP" }] }),
  component: () => (
    <ProtectedRoute roles={["admin", "manager"]}>
      <VehicleParticulars />
    </ProtectedRoute>
  ),
});

function VehicleParticulars() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    make: "", model: "", year: new Date().getFullYear(), color: "",
    vin: "", license_plate: "", mileage: 0, status: "ACTIVE" as const,
    notes: "",
  });
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    const { error } = await supabase.from("vehicles").insert({
      make: data.make, model: data.model, year: data.year, color: data.color,
      vin: data.vin, license_plate: data.license_plate, mileage: data.mileage, status: data.status,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Vehicle created");
    navigate({ to: "/vehicles" });
  };

  const steps = ["Identity", "Registration", "Review"];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Vehicle Particulars</h1>
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div key={s} className="flex items-center flex-1">
              <div className={`h-9 w-9 rounded-full grid place-items-center text-sm font-semibold ${
                done ? "bg-success text-success-foreground" : active ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {done ? <Check className="h-4 w-4" /> : n}
              </div>
              <div className="ml-2 text-sm font-medium hidden sm:block">{s}</div>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-border mx-3" />}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Make" value={data.make} onChange={(v) => setData({ ...data, make: v })} />
            <Field label="Model" value={data.model} onChange={(v) => setData({ ...data, model: v })} />
            <Field label="Year" type="number" value={String(data.year)} onChange={(v) => setData({ ...data, year: Number(v) })} />
            <Field label="Color" value={data.color} onChange={(v) => setData({ ...data, color: v })} />
          </div>
        )}
        {step === 2 && (
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="VIN" value={data.vin} onChange={(v) => setData({ ...data, vin: v })} />
            <Field label="License plate" value={data.license_plate} onChange={(v) => setData({ ...data, license_plate: v })} />
            <Field label="Mileage" type="number" value={String(data.mileage)} onChange={(v) => setData({ ...data, mileage: Number(v) })} />
            <div>
              <label className="text-sm font-medium">Status</label>
              <select value={data.status} onChange={(e) => setData({ ...data, status: e.target.value as any })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>ACTIVE</option><option>MAINTENANCE</option><option>RETIRED</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea value={data.notes} onChange={(e) => setData({ ...data, notes: e.target.value })} rows={3}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Review your entry</h3>
            <dl className="grid sm:grid-cols-2 gap-3 text-sm">
              {Object.entries({
                Make: data.make, Model: data.model, Year: data.year, Color: data.color || "—",
                VIN: data.vin, "License plate": data.license_plate, Mileage: data.mileage, Status: data.status,
              }).map(([k, v]) => (
                <div key={k} className="rounded-md border border-border p-3">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{String(v)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <div className="flex justify-between mt-6 pt-6 border-t border-border">
          <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
            className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-2 text-sm hover:bg-accent disabled:opacity-50">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1 rounded-md bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold shadow-elegant">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={submit} disabled={busy}
              className="rounded-md bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold shadow-elegant disabled:opacity-60">
              {busy ? "Saving…" : "Create vehicle"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );
}
