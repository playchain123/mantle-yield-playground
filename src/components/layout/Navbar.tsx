import { Link, useLocation } from "react-router-dom";
import { Layers, BarChart3, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  
  const navLinks = [
    { label: "Playground", href: "/", icon: Layers },
    { label: "Swap", href: "/swap", icon: ArrowLeftRight },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Layers className="h-5 w-5 text-primary-foreground" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-0 blur-lg transition-opacity group-hover:opacity-50" />
          </div>
          <span className="font-semibold text-foreground hidden sm:block">
            Mantle RWA & Yield SDK
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === link.href
                  ? "bg-accent text-primary"
                  : "text-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <link.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
