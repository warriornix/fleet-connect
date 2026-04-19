import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { Truck } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — VLIP" }] }),
  component: Register,
});

function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setBusy(true);
    const { error } = await signUp(email, password, name);
    setBusy(false);
    if (error) return toast.error(error);
    toast.success("Account created — welcome!");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Truck className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-3xl font-bold">Create your account</h1>
        <p className="text-muted-foreground mt-1">Start managing your fleet today</p>
      </div>
      <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <p className="text-xs text-muted-foreground mt-1">At least 6 characters. New accounts default to driver role.</p>
        </div>
        <button type="submit" disabled={busy}
          className="w-full rounded-md bg-gradient-primary text-primary-foreground py-2.5 font-semibold shadow-elegant hover:shadow-glow transition disabled:opacity-60">
          {busy ? "Creating account…" : "Create account"}
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Already have one? <Link to="/login" className="text-primary font-medium">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
