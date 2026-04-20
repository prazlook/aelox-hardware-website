"use client";

import { NavLink } from "react-router-dom";
import { Home, BarChart2, Wallet, Server, Settings, Code, ShoppingBag, AppWindow } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStatus } from "@/context/AppStatusContext";
import ImagePlaceholder from "./ImagePlaceholder";

const navItems = [
  { to: "/", icon: Home, label: "Accueil" },
  { to: "/apex", icon: AppWindow, label: "Apex" },
  { to: "/shop", icon: ShoppingBag, label: "Magasin" },
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
          "group relative flex items-center justify-center p-2.5 rounded-xl text-theme-text-secondary transition-all duration-300 ease-in-out",
          "hover:bg-white/10 hover:text-white hover:scale-110 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]",
          isActive && "bg-theme-accent/30 text-theme-accent shadow-[0_0_20px_rgba(0,169,183,0.2)]",
          triggerStartupAnimation && "animate-startup-slide-in-left",
          triggerShutdownAnimation && "animate-staggered-fade-out"
        )
      }
      style={triggerStartupAnimation ? { animationDelay: `${delay}s` } : triggerShutdownAnimation ? { '--delay': `${delay + 0.5}s` } as React.CSSProperties : {}}
    >
      <Icon className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300" />
      <span
        className={cn(
          "absolute top-full mt-5 px-3 py-1.5 rounded-lg bg-theme-card/95 text-white pointer-events-none z-50",
          "font-medium text-xs whitespace-nowrap shadow-2xl border border-white/10 backdrop-blur-md",
          "opacity-0 transition-all scale-90 translate-y-[-10px] origin-top",
          "group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
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
      "fixed top-6 left-1/2 -translate-x-1/2 h-16 max-w-[98vw] w-max px-6 bg-theme-card/40 backdrop-blur-2xl border border-white/20 flex items-center gap-4 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] z-50 transition-all duration-500",
      "after:absolute after:inset-0 after:rounded-2xl after:bg-white/5 after:pointer-events-none after:z-[-1]",
      triggerShutdownAnimation && "opacity-0 translate-y-[-20px]"
    )}>
      <div
        className={cn(
          "relative flex items-center justify-center px-4 mr-2 border-r border-white/10",
          triggerStartupAnimation && "animate-startup-fade-in-scale",
          triggerShutdownAnimation && "animate-staggered-fade-out"
        )}
        style={triggerStartupAnimation ? { animationDelay: '0s' } : triggerShutdownAnimation ? { '--delay': '0.1s' } as React.CSSProperties : {}}
      >
        <ImagePlaceholder className="w-8 h-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
      </div>
      <nav className="flex items-center space-x-3 md:space-x-6">
        {navItems.map((item, index) => (
          <NavItem key={item.to} {...item} delay={0.2 + index * 0.1} />
        ))}
      </nav>
    </aside>
  );
};