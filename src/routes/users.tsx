import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

type Row = { id: string; user_id: string; email: string; name: string; roles: string[] };

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users — VLIP" }] }),
  component: () => (
    <ProtectedRoute roles={["admin"]}>
      <Users />
    </ProtectedRoute>
  ),
});

function Users() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [p, r] = await Promise.all([
      supabase.from("profiles").select("id, user_id, email, name"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const profiles = p.data ?? [];
    const roles = r.data ?? [];
    setRows(profiles.map((pr) => ({
      ...pr,
      roles: roles.filter((rr) => rr.user_id === pr.user_id).map((rr) => rr.role),
    })));
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggleRole = async (userId: string, role: "admin" | "manager" | "driver", has: boolean) => {
    if (has) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) return toast.error(error.message);
    }
    toast.success("Roles updated");
    load();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User management</h1>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Roles</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">No users.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {(["admin", "manager", "driver"] as const).map((role) => {
                      const has = r.roles.includes(role);
                      return (
                        <button key={role} onClick={() => toggleRole(r.user_id, role, has)}
                          className={`text-xs px-2 py-1 rounded-md font-medium border transition ${
                            has ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-accent"
                          }`}>
                          {has && <ShieldCheck className="h-3 w-3 inline mr-1" />}
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
