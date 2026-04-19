import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import {
  Truck, LayoutDashboard, FileCheck2, BarChart3, Users, LogOut, Menu, X, Home, Info, Package, Building2, Phone,
} from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";

export function Layout() {
  const { user, signOut, isAdmin, isManager, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const publicNav = [
    { to: "/", label: "Home", icon: Home },
    { to: "/products", label: "Products", icon: Package },
    { to: "/who-we-serve", label: "Who We Serve", icon: Building2 },
    { to: "/about", label: "About", icon: Info },
    { to: "/contact", label: "Contact", icon: Phone },
  ];

  const privateNav = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, show: true },
    { to: "/vehicles", label: "Vehicles", icon: Truck, show: true },
    { to: "/certificates", label: "Certificates", icon: FileCheck2, show: true },
    { to: "/analytics", label: "Analytics", icon: BarChart3, show: isAdmin || isManager },
    { to: "/users", label: "Users", icon: Users, show: isAdmin },
  ].filter((i) => i.show);

  const nav = user ? privateNav : publicNav;

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary grid place-items-center shadow-elegant group-hover:shadow-glow transition-shadow">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">VLIP</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((i) => {
              const active = location.pathname === i.to;
              return (
                <Link
                  key={i.to}
                  to={i.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {i.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {loading ? null : user ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent transition"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-sm font-medium hover:text-primary transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:shadow-glow transition-shadow"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              {nav.map((i) => (
                <Link
                  key={i.to}
                  to={i.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  <i.icon className="h-4 w-4" />
                  {i.label}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              {user ? (
                <button onClick={handleSignOut} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent text-left">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent">Login</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-semibold bg-gradient-primary text-primary-foreground">Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-primary" />
            <span className="font-semibold text-foreground">VLIP</span>
            <span>· Vehicle Lifecycle Integration Platform</span>
          </div>
          <div>© {new Date().getFullYear()} VLIP. All rights reserved.</div>
        </div>
      </footer>

      <Toaster richColors position="top-right" />
    </div>
  );
}
