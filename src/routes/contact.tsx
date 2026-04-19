import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — VLIP" },
      { name: "description", content: "Get in touch with the VLIP team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.includes("@")) return toast.error("Enter a valid email");
    if (form.message.trim().length < 10) return toast.error("Message must be at least 10 characters");
    toast.success("Thanks — we'll be in touch shortly.");
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <>
      <section className="bg-gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold">Contact us</h1>
          <p className="mt-4 text-lg opacity-90">Questions, demos, partnerships — we'd love to hear from you.</p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Mail, label: "Email", val: "hello@vlip.com" },
            { icon: Phone, label: "Phone", val: "+1 (555) 010-0001" },
            { icon: MapPin, label: "HQ", val: "Stockholm, Sweden" },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-border bg-card p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><c.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="font-medium">{c.val}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button type="submit" className="rounded-md bg-gradient-primary text-primary-foreground px-6 py-2.5 font-semibold shadow-elegant hover:shadow-glow transition">
            Send message
          </button>
        </form>
      </section>
    </>
  );
}
