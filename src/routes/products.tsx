import { createFileRoute } from "@tanstack/react-router";
import { Truck, FileCheck2, Fuel, Wrench, Calendar, AlertCircle, FileBarChart, BarChart3, Users } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — VLIP" },
      { name: "description", content: "Nine integrated tools for complete fleet lifecycle management." },
    ],
  }),
  component: Products,
});

const products = [
  { icon: Truck, title: "Vehicle Research", desc: "Search by make/model, fetch detailed specs and trim options." },
  { icon: Fuel, title: "Fuel Management", desc: "Log gallons and cost; auto-calculate MPG efficiency." },
  { icon: Wrench, title: "Maintenance Tracking", desc: "Record services, costs, providers, and history." },
  { icon: Calendar, title: "Preventive Scheduling", desc: "Schedule recurring maintenance with priority levels." },
  { icon: AlertCircle, title: "Recall Search", desc: "Query recall databases by VIN or model." },
  { icon: FileBarChart, title: "Reporting Tools", desc: "Export PDF, CSV, or Excel fleet reports." },
  { icon: FileCheck2, title: "Certificates", desc: "Blockchain-verified registration, insurance, emissions." },
  { icon: BarChart3, title: "Analytics", desc: "Visual dashboards for fuel, maintenance, utilization." },
  { icon: Users, title: "User Management", desc: "Role-based access for admins, managers, drivers." },
];

function Products() {
  return (
    <>
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold">Our products</h1>
          <p className="mt-4 text-lg opacity-90">Nine tools, one platform. Everything fleet ops need.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p.title} className="rounded-xl border border-border bg-gradient-card p-6 hover:shadow-elegant transition-shadow">
              <div className="h-11 w-11 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground shadow-elegant">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
