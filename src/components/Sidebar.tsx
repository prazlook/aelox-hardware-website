"use client";

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Settings, Power, BarChart2, Cpu, HardDrive, Network, Bell, Info, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStatus } from '@/context/AppStatusContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  delay: number;
}

const SidebarLink = ({ to, icon: Icon, label, isCollapsed, delay }: SidebarLinkProps) => {
  const { triggerStartupAnimation } = useAppStatus();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={to}
            className={cn(
              "flex items-center h-10 px-3 rounded-md text-theme-text-secondary hover:bg-theme-hover hover:text-theme-text-primary transition-colors duration-200",
              isCollapsed ? "justify-center" : "",
              triggerStartupAnimation ? "animate-startup-slide-in-left" : ""
            )}
            style={triggerStartupAnimation ? { animationDelay: `${delay}s` } : {}}
          >
            <Icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showStopButton, setShowStopButton] = useState(false);
  const { stopApplication, triggerStartupAnimation } = useAppStatus(); // Correction ici: stopApp -> stopApplication

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={cn(
        "bg-theme-card h-screen flex flex-col border-r border-theme-border py-4 transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-20 items-center" : "w-64 px-4"
      )}
    >
      <div className={cn("flex items-center mb-8", isCollapsed ? "justify-center" : "justify-between")}>
        {!isCollapsed && (
          <h2
            className={cn(
              "text-2xl font-bold text-theme-text-primary",
              triggerStartupAnimation ? "animate-startup-fade-in-scale" : ""
            )}
            style={triggerStartupAnimation ? { animationDelay: '0.1s' } : {}}
          >
            MineOS
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "text-theme-text-secondary hover:bg-theme-hover hover:text-theme-text-primary",
            isCollapsed ? "" : "ml-auto",
            triggerStartupAnimation ? "animate-startup-fade-in-scale" : ""
          )}
          style={triggerStartupAnimation ? { animationDelay: '0.2s' } : {}}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-2">
        <SidebarLink to="/" icon={Home} label="Accueil" isCollapsed={isCollapsed} delay={0.3} />
        <SidebarLink to="/dashboard" icon={BarChart2} label="Tableau de bord" isCollapsed={isCollapsed} delay={0.4} />
        <SidebarLink to="/asics" icon={Cpu} label="ASICs" isCollapsed={isCollapsed} delay={0.5} />
        <SidebarLink to="/storage" icon={HardDrive} label="Stockage" isCollapsed={isCollapsed} delay={0.6} />
        <SidebarLink to="/network" icon={Network} label="Réseau" isCollapsed={isCollapsed} delay={0.7} />
        <SidebarLink to="/notifications" icon={Bell} label="Notifications" isCollapsed={isCollapsed} delay={0.8} />
        <SidebarLink to="/settings" icon={Settings} label="Paramètres" isCollapsed={isCollapsed} delay={0.9} />
        <SidebarLink to="/dev-options" icon={Info} label="Options Dev" isCollapsed={isCollapsed} delay={1.0} />
      </nav>

      <div className={cn("mt-auto pt-4 border-t border-theme-border", isCollapsed ? "px-0" : "px-3")}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full flex items-center justify-center h-10 rounded-md text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-colors duration-200",
                  isCollapsed ? "px-0" : "px-3",
                  triggerStartupAnimation ? "animate-startup-fade-in-scale" : ""
                )}
                style={triggerStartupAnimation ? { animationDelay: '1.1s' } : {}}
                onClick={stopApplication}
                onMouseEnter={() => setShowStopButton(true)}
                onMouseLeave={() => setShowStopButton(false)}
              >
                <Power className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && <span className="whitespace-nowrap">Arrêter l'application</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">Arrêter l'application</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
};