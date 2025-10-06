import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart2, Wallet, Server, Settings, Activity, Code } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Tableau de Bord" },
  { to: "/statistics", icon: BarChart2, label: "Statistiques" },
  { to: "/wallet", icon: Wallet, label: "Portefeuille" },
  { to: "/asic-management", icon: Server, label: "Gestion ASICs" },
  { to: "/configuration", icon: Settings, label: "Configuration" },
  { to: "/dev-options", icon: Code, label: "Options Dev" },
];

const NavItem = ({ to, icon: Icon, label }: typeof navItems[0]) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      cn(
        "flex items-center h-12 p-3 rounded-lg text-theme-text-secondary transition-colors duration-200 ease-in-out whitespace-nowrap overflow-hidden",
        "hover:bg-theme-card hover:text-white",
        isActive && "bg-theme-accent/20 text-theme-accent"
      )
    }
  >
    <div className="flex-shrink-0 w-11 h-full flex items-center justify-center">
      <Icon className="w-6 h-6" />
    </div>
    <span
      className={cn(
        "font-medium w-0 overflow-hidden whitespace-nowrap border-r-2 border-r-transparent",
        "group-hover:w-full group-hover:animate-typewriter group-hover:pl-1"
      )}
    >
      {label}
    </span>
  </NavLink>
);

export const Sidebar = () => {
  return (
    <aside className="w-20 hover:w-64 flex-shrink-0 bg-theme-card p-2 flex flex-col transition-all duration-300 ease-in-out group">
      <div className="flex items-center h-16 mb-4 flex-shrink-0 overflow-hidden">
        <div className="w-14 h-full flex items-center justify-center flex-shrink-0">
          <Activity className="w-8 h-8 text-theme-cyan" />
        </div>
        <h1 className="text-xl font-bold w-0 whitespace-nowrap group-hover:w-full overflow-hidden group-hover:animate-typewriter">
          ASIC Monitor
        </h1>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </aside>
  );
};