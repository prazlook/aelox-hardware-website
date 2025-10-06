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
        "flex items-center w-full p-3 rounded-lg text-theme-text-secondary transition-all duration-300 ease-in-out whitespace-nowrap",
        "group-hover:w-[95%] group-hover:pl-2",
        "hover:!w-full hover:!pl-3 hover:bg-theme-card hover:text-white",
        isActive && "bg-theme-accent/20 text-theme-accent !w-full !pl-3"
      )
    }
  >
    <Icon className="w-5 h-5 mr-3" />
    <span className="font-medium">{label}</span>
  </NavLink>
);

export const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 bg-theme-card p-4 flex flex-col">
      <div className="flex items-center mb-8">
        <Activity className="w-8 h-8 text-theme-cyan" />
        <h1 className="text-xl font-bold ml-2">ASIC Monitor</h1>
      </div>
      <nav className="flex flex-col space-y-2 group">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
    </aside>
  );
};