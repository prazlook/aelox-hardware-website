import { NavLink } from "react-router-dom";
import { Home, LayoutDashboard, BarChart2, Wallet, Server, Settings, Code, PowerOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppStatus } from "@/context/AppStatusContext";
import { Logo } from "./Logo"; // Import the new Logo component

const navItems = [
  { to: "/", icon: Home, label: "Accueil" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Tableau de Bord" },
  { to: "/statistics", icon: BarChart2, label: "Statistiques" },
  { to: "/wallet", icon: Wallet, label: "Portefeuille" },
  { to: "/asic-management", icon: Server, label: "Gestion ASICs" },
  { to: "/configuration", icon: Settings, label: "Configuration" },
  { to: "/dev-options", icon: Code, label: "Options Dev" },
];

const NavItem = ({ to, icon: Icon, label, delay }: typeof navItems[0] & { delay: number }) => {
  const { triggerStartupAnimation, triggerShutdownAnimation } = useAppStatus();
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "group relative flex items-center h-12 p-3 rounded-lg text-theme-text-secondary transition-colors duration-200 ease-in-out",
          "hover:bg-theme-card hover:text-white",
          isActive && "bg-theme-accent/20 text-theme-accent",
          triggerStartupAnimation && "animate-startup-slide-in-left",
          triggerShutdownAnimation && "animate-staggered-fade-out"
        )
      }
      style={triggerStartupAnimation ? { animationDelay: `${delay}s` } : triggerShutdownAnimation ? { '--delay': `${delay + 0.5}s` } as React.CSSProperties : {}}
    >
      <Icon className="w-6 h-6 transition-transform duration-200 group-hover:scale-125" />
      <span
        className={cn(
          "absolute left-full ml-4 px-3 py-2 rounded-md bg-theme-card text-white pointer-events-none z-10",
          "font-medium whitespace-nowrap",
          "opacity-0 transition-opacity",
          "group-hover:opacity-100 group-hover:animate-typewriter group-hover:typewriter-cursor"
        )}
      >
        {label}
      </span>
    </NavLink>
  );
};

export const Sidebar = () => {
  const [showStopButton, setShowStopButton] = useState(false);
  const { stopApp, triggerStartupAnimation, triggerShutdownAnimation } = useAppStatus();

  return (
    <aside className="w-20 flex-shrink-0 bg-theme-card p-2 flex flex-col relative z-20">
      <div
        className={cn(
          "relative flex items-center justify-center h-16 mb-4 flex-shrink-0",
          triggerStartupAnimation && "animate-startup-fade-in-scale",
          triggerShutdownAnimation && "animate-staggered-fade-out"
        )}
        style={triggerStartupAnimation ? { animationDelay: '0s' } : triggerShutdownAnimation ? { '--delay': '0.1s' } as React.CSSProperties : {}}
        onMouseEnter={() => setShowStopButton(true)}
        onMouseLeave={() => setShowStopButton(false)}
      >
        <Logo className="h-10" /> {/* Use the Logo component here */}
        {showStopButton && (
          <Button
            size="icon"
            variant="destructive"
            className={cn(
              "absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full opacity-0 animate-fade-in-slide-up",
              triggerShutdownAnimation && "animate-staggered-fade-out"
            )}
            style={triggerStartupAnimation ? { animationDelay: '0.1s' } : triggerShutdownAnimation ? { '--delay': '0.3s' } as React.CSSProperties : {}}
            onClick={stopApp}
            aria-label="Arrêter l'application"
          >
            <PowerOff className="w-4 h-4" />
          </Button>
        )}
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item, index) => (
          <NavItem key={item.to} {...item} delay={0.2 + index * 0.1} />
        ))}
      </nav>
    </aside>
  );
};