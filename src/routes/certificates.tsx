import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { sha256Hex, mockBlockchainTx, formatDate } from "@/lib/helpers";
import { toast } from "sonner";
import { Plus, ShieldCheck, ShieldAlert, FileCheck2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { Database } from "@/integrations/supabase/types";

type Cert = Database["public"]["Tables"]["certificates"]["Row"];
type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];

export const Route = createFileRoute("/certificates")({
  head: () => ({ meta: [{ title: "Certificates — VLIP" }] }),
  component: () => (
    <ProtectedRoute>
      <Certificates />
    </ProtectedRoute>
  ),
});

function Certificates() {
  const { user, isAdmin, isManager } = useAuth();
  const canManage = isAdmin || isManager;
  const [certs, setCerts] = useState<Cert[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [c, v] = await Promise.all([
      supabase.from("certificates").select("*").order("created_at", { ascending: false }),
      supabase.from("vehicles").select("*"),
    ]);
    setCerts(c.data ?? []);
    setVehicles(v.data ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const verify = async (cert: Cert) => {
    const payload = JSON.stringify({ vehicle_id: cert.vehicle_id, type: cert.type, issue_date: cert.issue_date });
    const recomputed = await sha256Hex(payload);
    if (recomputed === cert.hash) {
      await supabase.from("certificates").update({ verified: true }).eq("id", cert.id);
      toast.success("Certificate verified ✓");
      load();
    } else {
      toast.error("Hash mismatch — certificate may be tampered");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-end justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Certificates</h1>
          <p className="text-muted-foreground text-sm mt-1">Blockchain-hashed records · {certs.length} total</p>
        </div>
        {canManage && (
          <button onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-md bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold shadow-elegant">
            <Plus className="h-4 w-4" /> New certificate
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 rounded-xl border border-border bg-card animate-pulse" />)}
        </div>
      ) : certs.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-border">
          <FileCheck2 className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No certificates yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certs.map((c) => {
            const v = vehicles.find((x) => x.id === c.vehicle_id);
            return (
              <div key={c.id} className="rounded-xl border border-border bg-gradient-card p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-semibold">{c.type}</span>
                    <h3 className="mt-2 font-semibold">{v ? `${v.year} ${v.make} ${v.model}` : "Unknown vehicle"}</h3>
                    <p className="text-xs text-muted-foreground">Issued {formatDate(c.issue_date)}</p>
                  </div>
                  {c.verified ? (
                    <span className="inline-flex items-center gap-1 text-xs text-success font-semibold"><ShieldCheck className="h-4 w-4" /> Verified</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-warning font-semibold"><ShieldAlert className="h-4 w-4" /> Unverified</span>
                  )}
                </div>
                <div className="mt-3 rounded-md bg-muted/50 p-2 text-[10px] font-mono break-all leading-tight">{c.hash}</div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="rounded-md bg-white p-1">
                    <QRCodeSVG value={`vlip://cert/${c.id}#${c.hash.slice(0, 16)}`} size={64} />
                  </div>
                  <div className="text-xs text-muted-foreground flex-1">
                    <p className="truncate">tx: <span className="font-mono">{c.blockchain_tx?.slice(0, 24)}…</span></p>
                    {c.expiry_date && <p>Expires {formatDate(c.expiry_date)}</p>}
                  </div>
                </div>
                <button onClick={() => verify(c)}
                  className="mt-3 w-full rounded-md border border-border py-1.5 text-sm font-medium hover:bg-accent">
                  {c.verified ? "Re-verify" : "Verify hash"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <CertForm vehicles={vehicles} userId={user!.id} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
    </div>
  );
}

function CertForm({ vehicles, userId, onClose, onSaved }: { vehicles: Vehicle[]; userId: string; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    vehicle_id: vehicles[0]?.id ?? "",
    type: "REGISTRATION" as const,
    expiry_date: "",
    document_url: "",
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vehicle_id) return toast.error("Pick a vehicle");
    setBusy(true);
    const issue_date = new Date().toISOString();
    const payload = JSON.stringify({ vehicle_id: form.vehicle_id, type: form.type, issue_date });
    const hash = await sha256Hex(payload);
    const { error } = await supabase.from("certificates").insert({
      vehicle_id: form.vehicle_id,
      user_id: userId,
      type: form.type,
      hash,
      issue_date,
      expiry_date: form.expiry_date || null,
      document_url: form.document_url || null,
      blockchain_tx: mockBlockchainTx(hash),
      verified: true,
      metadata: { issued_by: "VLIP" },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Certificate created with hash");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-elegant space-y-4">
        <h2 className="text-xl font-bold">New certificate</h2>
        <div>
          <label className="text-sm font-medium">Vehicle</label>
          <select required value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">Select…</option>
            {vehicles.map((v) => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} — {v.license_plate}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            {["REGISTRATION", "INSURANCE", "EMISSION", "INSPECTION", "MAINTENANCE", "OWNERSHIP"].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Expiry date (optional)</label>
          <input type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium">Document URL (optional)</label>
          <input type="url" value={form.document_url} onChange={(e) => setForm({ ...form, document_url: e.target.value })}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Cancel</button>
          <button type="submit" disabled={busy} className="rounded-md bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-60">
            {busy ? "Hashing…" : "Generate & save"}
          </button>
        </div>
      </form>
    </div>
  );
}
