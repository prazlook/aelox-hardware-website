"use client";

import { NavLink } from "react-router-dom";
import { Home, BarChart2, Wallet, Server, Settings, Code, ShoppingBag, AppWindow } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStatus } from "@/context/AppStatusContext";
import ImagePlaceholder from "./ImagePlaceholder";

const navItems = [
  { to: "/", icon: Home, label: "Accueil" },
  { to: "/apex", icon: AppWindow, label: "Apex" },
  { to: "/dashboard", icon: ShoppingBag, label: "Magasin" },
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
          "group relative flex items-center justify-center p-2 rounded-xl text-theme-text-secondary transition-all duration-200 ease-in-out",
          "hover:bg-theme-card/50 hover:text-white hover:scale-110",
          isActive && "bg-theme-accent/20 text-theme-accent shadow-sm",
          triggerStartupAnimation && "animate-startup-slide-in-left",
          triggerShutdownAnimation && "animate-staggered-fade-out"
        )
      }
      style={triggerStartupAnimation ? { animationDelay: `${delay}s` } : triggerShutdownAnimation ? { '--delay': `${delay + 0.5}s` } as React.CSSProperties : {}}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200" />
      <span
        className={cn(
          "absolute top-full mt-4 px-3 py-1.5 rounded-lg bg-theme-card text-white pointer-events-none z-50",
          "font-medium text-xs whitespace-nowrap shadow-xl border border-white/10",
          "opacity-0 transition-all scale-95 origin-top",
          "group-hover:opacity-100 group-hover:scale-100"
        )}
      >
        {label}
      </span>
    </NavLink>
  );
};

export const Sidebar = () => {
  const { triggerStartupAnimation, triggerShutdownAnimation } = useAppStatus();

  return (
    <aside className={cn(
      "fixed top-6 left-1/2 -translate-x-1/2 h-16 max-w-[95vw] w-max px-4 bg-theme-card/80 backdrop-blur-xl border border-white/10 flex items-center gap-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 transition-all duration-300",
      triggerShutdownAnimation && "opacity-0 translate-y-[-20px]"
    )}>
      <div
        className={cn(
          "relative flex items-center justify-center px-2 mr-2 border-r border-white/10",
          triggerStartupAnimation && "animate-startup-fade-in-scale",
          triggerShutdownAnimation && "animate-staggered-fade-out"
        )}
        style={triggerStartupAnimation ? { animationDelay: '0s' } : triggerShutdownAnimation ? { '--delay': '0.1s' } as React.CSSProperties : {}}
      >
        <ImagePlaceholder className="w-8 h-8" />
      </div>
      <nav className="flex items-center space-x-1 md:space-x-3">
        {navItems.map((item, index) => (
          <NavItem key={item.to} {...item} delay={0.2 + index * 0.1} />
        ))}
      </nav>
    </aside>
  );
};