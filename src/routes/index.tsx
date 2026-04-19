import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, ShieldCheck, BarChart3, Fuel, Wrench, FileCheck2, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VLIP — Modern Fleet Management Platform" },
      { name: "description", content: "Track vehicles, certificates, fuel and maintenance with blockchain-verified records." },
      { property: "og:title", content: "VLIP — Modern Fleet Management" },
      { property: "og:description", content: "End-to-end vehicle lifecycle integration." },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Truck, title: "Fleet Operations", desc: "CRUD vehicles, assign drivers, track real-time status." },
  { icon: FileCheck2, title: "Blockchain Certificates", desc: "SHA-256 hashed records with verification & QR codes." },
  { icon: Fuel, title: "Fuel Intelligence", desc: "Track gallons, cost, MPG efficiency across the fleet." },
  { icon: Wrench, title: "Maintenance", desc: "Service history, providers, costs and next-due dates." },
  { icon: BarChart3, title: "Analytics", desc: "Live charts for fuel, maintenance and utilization." },
  { icon: ShieldCheck, title: "Role-based Access", desc: "Admin, manager, and driver permissions enforced by RLS." },
];

function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3 w-3" /> Vehicle Lifecycle Integration Platform
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Run your fleet on a <span className="bg-gradient-to-r from-primary-glow to-white bg-clip-text text-transparent">single intelligent platform.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl opacity-90 max-w-2xl">
              VLIP unifies vehicles, certificates, fuel, maintenance, and analytics — with blockchain-grade record verification and role-based access.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-md bg-white text-primary px-6 py-3 text-base font-semibold hover:bg-white/90 transition shadow-glow">
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/products" className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 backdrop-blur px-6 py-3 text-base font-semibold hover:bg-white/20 transition">
                Explore products
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Everything fleet, in one place</h2>
          <p className="mt-3 text-muted-foreground">Built for fleet operators who refuse spreadsheets.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-gradient-card p-6 hover:shadow-elegant transition-shadow">
              <div className="h-11 w-11 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground shadow-elegant">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to take control?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Sign up in seconds. Sample data is preloaded so you can explore right away.</p>
          <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-md bg-gradient-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-elegant hover:shadow-glow">
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
