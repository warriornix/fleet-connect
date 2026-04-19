import { Car, Pencil, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];

export function VehicleCard({
  vehicle, onEdit, onDelete, canManage,
}: {
  vehicle: Vehicle;
  onEdit?: (v: Vehicle) => void;
  onDelete?: (v: Vehicle) => void;
  canManage?: boolean;
}) {
  const statusColor =
    vehicle.status === "ACTIVE" ? "bg-success/10 text-success" :
    vehicle.status === "MAINTENANCE" ? "bg-warning/10 text-warning" :
    "bg-muted text-muted-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-elegant transition-shadow flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold leading-tight">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
            <p className="text-xs text-muted-foreground">{vehicle.license_plate}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-md font-medium ${statusColor}`}>{vehicle.status}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs">VIN</p>
          <p className="font-mono text-xs truncate">{vehicle.vin}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs">Mileage</p>
          <p className="font-medium">{vehicle.mileage.toLocaleString()} mi</p>
        </div>
      </div>
      {canManage && (
        <div className="flex gap-2 pt-2 border-t border-border">
          <button onClick={() => onEdit?.(vehicle)} className="flex-1 inline-flex items-center justify-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent">
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button onClick={() => onDelete?.(vehicle)} className="inline-flex items-center justify-center gap-1 rounded-md border border-destructive/30 text-destructive px-3 py-1.5 text-sm hover:bg-destructive/10">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
