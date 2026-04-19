import { Modal } from "@/components/Modal";
import { useState } from "react";
import { Search } from "lucide-react";

const MOCK_DB: Record<string, { trims: string[]; mpg: number; hp: number }> = {
  "toyota camry": { trims: ["LE", "SE", "XLE", "TRD"], mpg: 32, hp: 203 },
  "honda cr-v": { trims: ["LX", "EX", "EX-L", "Touring"], mpg: 30, hp: 190 },
  "ford f-150": { trims: ["XL", "XLT", "Lariat", "King Ranch"], mpg: 22, hp: 400 },
  "tesla model 3": { trims: ["Standard", "Long Range", "Performance"], mpg: 132, hp: 283 },
  "chevrolet silverado": { trims: ["WT", "LT", "RST", "LTZ"], mpg: 21, hp: 355 },
};

export function VehicleResearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [result, setResult] = useState<null | { key: string; data: typeof MOCK_DB[string] }>(null);

  const search = () => {
    const key = q.toLowerCase().trim();
    const hit = MOCK_DB[key];
    setResult(hit ? { key, data: hit } : null);
  };

  return (
    <Modal title="Vehicle Research" onClose={onClose} size="lg">
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Toyota Camry"
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" onKeyDown={(e) => e.key === "Enter" && search()} />
        <button onClick={search} className="inline-flex items-center gap-1 rounded-md bg-gradient-primary text-primary-foreground px-4 py-2 text-sm font-semibold">
          <Search className="h-4 w-4" /> Search
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Try: Toyota Camry, Honda CR-V, Ford F-150, Tesla Model 3, Chevrolet Silverado</p>
      {result ? (
        <div className="rounded-lg border border-border p-4">
          <h3 className="font-semibold capitalize">{result.key}</h3>
          <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
            <div><dt className="text-muted-foreground text-xs">MPG</dt><dd className="font-bold">{result.data.mpg}</dd></div>
            <div><dt className="text-muted-foreground text-xs">Horsepower</dt><dd className="font-bold">{result.data.hp}</dd></div>
            <div><dt className="text-muted-foreground text-xs">Trims</dt><dd className="font-bold">{result.data.trims.length}</dd></div>
          </dl>
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">Trim levels</p>
            <div className="flex flex-wrap gap-2">{result.data.trims.map((t) => <span key={t} className="text-xs bg-accent px-2 py-1 rounded-md">{t}</span>)}</div>
          </div>
        </div>
      ) : q && <p className="text-sm text-muted-foreground">No match found.</p>}
    </Modal>
  );
}
