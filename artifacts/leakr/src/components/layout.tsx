import { Link, useLocation } from "wouter";
import { Shield, Home, Key, Users, Activity, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Intel Dashboard", href: "/dashboard", icon: Activity },
  { name: "Available Leaks", href: "/leaks", icon: FileText },
  { name: "Submit a Leak", href: "/leaks/submit", icon: Key },
  { name: "Journalists", href: "/journalists", icon: Users },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col md:flex border-r border-border bg-sidebar">
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <span className="text-lg font-bold tracking-widest text-sidebar-foreground uppercase font-mono">
            LEAKR<span className="text-primary">_</span>
          </span>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md font-mono",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="flex md:hidden h-16 items-center justify-between border-b border-border bg-background px-4">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <span className="text-lg font-bold tracking-widest text-foreground uppercase font-mono">
              LEAKR<span className="text-primary">_</span>
            </span>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
