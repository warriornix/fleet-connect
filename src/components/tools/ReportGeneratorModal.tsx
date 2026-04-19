import { Modal } from "@/components/Modal";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileBarChart, FileText, FileSpreadsheet } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Papa from "papaparse";

export function ReportGeneratorModal({ onClose }: { onClose: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);

  const fetchAll = async () => {
    const { data } = await supabase.from("vehicles").select("year, make, model, license_plate, vin, mileage, status");
    return data ?? [];
  };

  const exportPdf = async () => {
    setBusy("pdf");
    const rows = await fetchAll();
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("VLIP Fleet Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated ${new Date().toLocaleString()}`, 14, 25);
    autoTable(doc, {
      startY: 32,
      head: [["Year", "Make", "Model", "Plate", "VIN", "Mileage", "Status"]],
      body: rows.map((r) => [r.year, r.make, r.model, r.license_plate, r.vin, r.mileage, r.status]),
      headStyles: { fillColor: [52, 76, 165] },
    });
    doc.save("vlip-fleet-report.pdf");
    setBusy(null);
    toast.success("PDF downloaded");
  };

  const exportCsv = async () => {
    setBusy("csv");
    const rows = await fetchAll();
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    triggerDownload(blob, "vlip-fleet-report.csv");
    setBusy(null);
    toast.success("CSV downloaded");
  };

  const exportXlsx = async () => {
    setBusy("xlsx");
    const rows = await fetchAll();
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fleet");
    XLSX.writeFile(wb, "vlip-fleet-report.xlsx");
    setBusy(null);
    toast.success("Excel downloaded");
  };

  return (
    <Modal title="Reporting Tools" onClose={onClose} size="lg">
      <p className="text-sm text-muted-foreground mb-4">Export your full fleet inventory in your preferred format.</p>
      <div className="grid sm:grid-cols-3 gap-3">
        <Btn icon={FileText} label="PDF" busy={busy === "pdf"} on={exportPdf} />
        <Btn icon={FileBarChart} label="CSV" busy={busy === "csv"} on={exportCsv} />
        <Btn icon={FileSpreadsheet} label="Excel" busy={busy === "xlsx"} on={exportXlsx} />
      </div>
    </Modal>
  );
}

function Btn({ icon: Icon, label, busy, on }: { icon: any; label: string; busy: boolean; on: () => void }) {
  return (
    <button onClick={on} disabled={busy} className="rounded-xl border border-border bg-gradient-card p-5 hover:shadow-elegant transition disabled:opacity-60 text-left">
      <Icon className="h-7 w-7 text-primary" />
      <p className="mt-3 font-semibold">{label}</p>
      <p className="text-xs text-muted-foreground">{busy ? "Generating…" : "Download report"}</p>
    </button>
  );
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
