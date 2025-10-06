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

const NavItem = ({ to, icon: Icon, label }: typeof navItems[0]) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      cn(
        "flex items-center p-3 rounded-lg text-theme-text-secondary transition-colors duration-200 ease-in-out whitespace-nowrap group", // Ajout de 'group' pour le survol de l'icône
        "hover:bg-theme-card",
        isActive && "bg-theme-accent/20 text-theme-accent"
      )
    }
  >
    <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:text-theme-cyan" />
    <span className="font-medium ml-4 opacity-0 w-0 group-hover:opacity-100 group-hover:w-auto transition-all duration-300 delay-100">
      {label}
    </span>
  </NavLink>
);

export const Sidebar = () => {
  return (
    <aside className="w-20 hover:w-64 flex-shrink-0 bg-theme-card p-4 flex flex-col transition-all duration-300 ease-in-out group">
      <div className="flex items-center mb-8">
        <Activity className="w-8 h-8 text-theme-cyan flex-shrink-0" />
        <h1 className="text-xl font-bold ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 whitespace-nowrap">
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