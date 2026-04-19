import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Truck } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — VLIP" }] }),
  component: Login,
});

function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
  };

  const fillDemo = (role: "admin" | "manager" | "driver") => {
    setEmail(`${role}@vlip.com`);
    setPassword(`${role}123`);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Truck className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground mt-1">Sign in to your VLIP account</p>
      </div>
      <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <button type="submit" disabled={busy}
          className="w-full rounded-md bg-gradient-primary text-primary-foreground py-2.5 font-semibold shadow-elegant hover:shadow-glow transition disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          No account? <Link to="/register" className="text-primary font-medium">Sign up</Link>
        </p>
      </form>
      <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-sm">
        <p className="font-medium mb-2">Quick demo logins:</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => fillDemo("admin")} className="px-3 py-1 rounded-md bg-accent text-xs">admin@vlip.com</button>
          <button onClick={() => fillDemo("manager")} className="px-3 py-1 rounded-md bg-accent text-xs">manager@vlip.com</button>
          <button onClick={() => fillDemo("driver")} className="px-3 py-1 rounded-md bg-accent text-xs">driver@vlip.com</button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Password format: <code>&lt;role&gt;123</code></p>
      </div>
    </div>
  );
}
