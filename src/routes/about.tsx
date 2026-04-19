import { createFileRoute } from "@tanstack/react-router";
import { Target, Eye, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — VLIP" },
      { name: "description", content: "Learn about VLIP and our mission to modernize fleet management." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold">About VLIP</h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">
            We build software for fleet operators who treat their vehicles as critical infrastructure.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: "Mission", desc: "Replace clipboards and spreadsheets with a modern, verifiable system of record." },
            { icon: Eye, title: "Vision", desc: "Every vehicle on Earth has a verifiable digital lifecycle." },
            { icon: Heart, title: "Values", desc: "Reliability, transparency, and respect for the operators using our product." },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-border bg-card p-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground"><c.icon className="h-5 w-5" /></div>
              <h3 className="mt-4 font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-xl border border-border bg-card p-8">
          <h2 className="text-2xl font-bold">Our story</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            VLIP was born from frustration with the patchwork of tools fleet operators rely on every day.
            By integrating vehicle data, blockchain-grade certificate verification, and operational analytics,
            we give fleets a single source of truth — from acquisition to retirement.
          </p>
        </div>
      </section>
    </>
  );
}
