import { Navigate } from "@tanstack/react-router";
import { useAuth, type AppRole } from "@/lib/auth-context";
import type { ReactNode } from "react";

export function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: AppRole[];
}) {
  const { user, loading, hasAnyRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (roles && !hasAnyRole(roles)) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Access denied</h1>
        <p className="text-muted-foreground mt-2">You don't have permission to view this page.</p>
      </div>
    );
  }
  return <>{children}</>;
}
