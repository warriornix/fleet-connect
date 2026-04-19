import { createFileRoute } from "@tanstack/react-router";
import {
  Truck, Bus, Car, Building2, ShoppingBag, GraduationCap, Hospital, Wrench,
  Wheat, Pickaxe, Plane, Package, Trash2, ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/who-we-serve")({
  head: () => ({
    meta: [
      { title: "Who We Serve — VLIP" },
      { name: "description", content: "VLIP serves 14 industries across logistics, transit, services and more." },
    ],
  }),
  component: WhoWeServe,
});

const categories = [
  { icon: Truck, title: "Trucking & Logistics", desc: "Long-haul and regional carriers" },
  { icon: Bus, title: "Public Transit", desc: "City buses and shuttle services" },
  { icon: Car, title: "Rideshare & Taxi", desc: "Fleets serving urban mobility" },
  { icon: Building2, title: "Corporate Fleets", desc: "Enterprise pool and exec fleets" },
  { icon: ShoppingBag, title: "Retail & Delivery", desc: "Last-mile delivery operations" },
  { icon: GraduationCap, title: "Education", desc: "School buses and campus fleets" },
  { icon: Hospital, title: "Healthcare", desc: "Ambulance and medical transport" },
  { icon: Wrench, title: "Field Services", desc: "HVAC, plumbing, utilities" },
  { icon: Wheat, title: "Agriculture", desc: "Farm vehicles and equipment" },
  { icon: Pickaxe, title: "Construction", desc: "Heavy equipment fleets" },
  { icon: Plane, title: "Airport Ground", desc: "Tugs, fuelers, support vehicles" },
  { icon: Package, title: "Courier", desc: "Same-day and parcel networks" },
  { icon: Trash2, title: "Waste Management", desc: "Refuse and recycling fleets" },
  { icon: ShieldCheck, title: "Government", desc: "Municipal and federal vehicles" },
];

function WhoWeServe() {
  return (
    <>
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold">Who we serve</h1>
          <p className="mt-4 text-lg opacity-90">14 industries trust VLIP to manage their wheels.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((c) => (
            <div key={c.title} className="rounded-xl border border-border bg-gradient-card p-5 hover:shadow-elegant hover:-translate-y-1 transition-all">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground">
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
