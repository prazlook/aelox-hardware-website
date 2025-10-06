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
        "group relative flex items-center h-12 p-3 rounded-lg text-theme-text-secondary transition-colors duration-200 ease-in-out",
        "hover:bg-theme-card hover:text-white",
        isActive && "bg-theme-accent/20 text-theme-accent"
      )
    }
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

export const Sidebar = () => {
  return (
    <aside className="w-20 flex-shrink-0 bg-theme-card p-2 flex flex-col relative z-20">
      <div className="flex items-center justify-center h-16 mb-4 flex-shrink-0">
        <Activity className="w-8 h-8 text-theme-cyan" />
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </aside>
  );
};