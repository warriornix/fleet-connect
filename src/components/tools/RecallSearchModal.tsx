import { Modal } from "@/components/Modal";
import { useState } from "react";
import { Search, AlertTriangle } from "lucide-react";

const MOCK_RECALLS: Record<string, { id: string; title: string; manufacturer: string; remedy: string }[]> = {
  "1HGBH41JXMN109186": [{ id: "NHTSA-23V-450", title: "Airbag inflator may rupture", manufacturer: "Honda", remedy: "Replace inflator at no cost" }],
  "5YJ3E1EA0PF000123": [{ id: "NHTSA-24V-210", title: "Seatbelt anchor weld inspection", manufacturer: "Tesla", remedy: "Inspect and reinforce" }],
};

export function RecallSearchModal({ onClose }: { onClose: () => void }) {
  const [vin, setVin] = useState("");
  const [results, setResults] = useState<typeof MOCK_RECALLS[string] | null>(null);

  const search = () => {
    setResults(MOCK_RECALLS[vin.toUpperCase()] ?? []);
  };

  return (
    <Modal title="Recall Search" onClose={onClose} size="lg">
      <p className="text-sm text-muted-foreground mb-3">Search the recall database by VIN. Try <code className="bg-accent px-1 rounded">1HGBH41JXMN109186</code> or <code className="bg-accent px-1 rounded">5YJ3E1EA0PF000123</code></p>
      <div className="flex gap-2 mb-4">
        <input value={vin} onChange={(e) => setVin(e.target.value)} placeholder="Enter VIN" className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-mono" onKeyDown={(e) => e.key === "Enter" && search()} />
        <button onClick={search} className="inline-flex items-center gap-1 rounded-md bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold"><Search className="h-4 w-4" /> Search</button>
      </div>
      {results === null ? null : results.length === 0 ? (
        <p className="text-sm text-success">✓ No active recalls for this VIN</p>
      ) : (
        <div className="space-y-3">
          {results.map((r) => (
            <div key={r.id} className="rounded-lg border border-warning/40 bg-warning/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{r.id} · {r.manufacturer}</p>
                  <p className="text-sm mt-2"><span className="font-medium">Remedy:</span> {r.remedy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
