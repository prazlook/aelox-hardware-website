import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart2, Wallet, Server, Settings, Activity, Code, PowerOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAppStatus } from "@/context/AppStatusContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Tableau de Bord" },
  { to: "/statistics", icon: BarChart2, label: "Statistiques" },
  { to: "/wallet", icon: Wallet, label: "Portefeuille" },
  { to: "/asic-management", icon: Server, label: "Gestion ASICs" },
  { to: "/configuration", icon: Settings, label: "Configuration" },
  { to: "/dev-options", icon: Code, label: "Options Dev" },
];

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  delay: number;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, delay }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      cn(
        "group relative flex items-center h-12 p-3 rounded-lg text-theme-text-secondary transition-colors duration-200 ease-in-out",
        "hover:bg-theme-card hover:text-white",
        isActive && "bg-theme-accent/20 text-theme-accent",
        "animate-startup-slide-in-left"
      )
    }
    style={{ animationDelay: `${delay}s` }}
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

export const Sidebar: React.FC = () => {
  const [showStopButton, setShowStopButton] = useState(false);
  const { stopApp, triggerStartupAnimation } = useAppStatus();

  return (
    <aside className="w-20 flex-shrink-0 bg-theme-card p-2 flex flex-col relative z-20">
      <div
        className={cn(
          "relative flex items-center justify-center h-16 mb-4 flex-shrink-0",
          triggerStartupAnimation ? "animate-startup-fade-in-scale" : ""
        )}
        style={triggerStartupAnimation ? { animationDelay: '0.5s' } : {}}
        onMouseEnter={() => setShowStopButton(true)}
        onMouseLeave={() => setShowStopButton(false)}
      >
        <Activity className="w-8 h-8 text-theme-cyan" />
        {showStopButton && (
          <Button
            size="icon"
            variant="destructive"
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full opacity-0 animate-fade-in-slide-up"
            style={{ animationDelay: '0.1s' }}
            onClick={stopApp}
            aria-label="Arrêter l'application"
          >
            <PowerOff className="w-4 h-4" />
          </Button>
        )}
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item, index) => (
          <NavItem key={item.to} {...item} delay={0.8 + index * 0.1} />
        ))}
      </nav>
    </aside>
  );
};