import type { ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({ title, children, onClose, size = "md" }: { title: string; children: ReactNode; onClose: () => void; size?: "md" | "lg" | "xl" }) {
  const w = size === "xl" ? "max-w-3xl" : size === "lg" ? "max-w-2xl" : "max-w-lg";
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur p-4">
      <div className={`w-full ${w} rounded-xl border border-border bg-card shadow-elegant max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-auto p-5">{children}</div>
      </div>
    </div>
  );
}
