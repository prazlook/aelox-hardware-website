import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart2, Wallet, Server, Settings, Activity, Code } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Tableau de Bord" },
  { to: "/statistics", icon: BarChart2, label: "Statistiques" },
  { to: "/wallet", icon: Wallet, label: "Portefeuille" },
  { to: "/asic-management", icon: Server, label: "Gestion des ASICs" },
  { to: "/configuration", icon: Settings, label: "Configuration" },
  { to: "/dev-options", icon: Code, label: "Options Dev" },
];

type NavItemProps = typeof navItems[0] & { isExpanded: boolean };

const NavItem = ({ to, icon: Icon, label, isExpanded }: NavItemProps) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      cn(
        "flex items-center w-full p-3 rounded-lg text-theme-text-secondary transition-all duration-200 ease-in-out whitespace-nowrap hover:bg-theme-card",
        isExpanded ? "justify-start" : "justify-center",
        isActive && "bg-theme-accent/20 text-theme-accent"
      )
    }
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    <span
      className={cn(
        "font-medium transition-all duration-200",
        isExpanded ? "ml-3 opacity-100" : "w-0 opacity-0"
      )}
    >
      {label}
    </span>
  </NavLink>
);

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      className={cn(
        "flex-shrink-0 bg-theme-card p-4 flex flex-col transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-20"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center mb-8">
        <Activity className="w-8 h-8 text-theme-cyan flex-shrink-0" />
        <h1
          className={cn(
            "text-xl font-bold ml-2 transition-all duration-200 whitespace-nowrap",
            isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
          )}
        >
          ASIC Monitor
        </h1>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} isExpanded={isExpanded} />
        ))}
      </nav>
    </aside>
  );
};