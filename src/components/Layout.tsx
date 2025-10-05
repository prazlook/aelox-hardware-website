import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Wallet, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Layout = () => {
  return (
    <div className="flex min-h-screen w-full bg-gray-900 text-white">
      <aside className="flex h-screen w-16 flex-col items-center border-r border-gray-700 bg-gray-900/50 py-8">
        <nav className="flex flex-col items-center gap-y-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "p-2 rounded-lg",
                isActive
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:bg-gray-700/50"
              )
            }
          >
            <LayoutDashboard className="h-6 w-6" />
          </NavLink>
          <NavLink
            to="/wallet"
            className={({ isActive }) =>
              cn(
                "p-2 rounded-lg",
                isActive
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:bg-gray-700/50"
              )
            }
          >
            <Wallet className="h-6 w-6" />
          </NavLink>
          <NavLink
            to="/configuration"
            className={({ isActive }) =>
              cn(
                "p-2 rounded-lg",
                isActive
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:bg-gray-700/50"
              )
            }
          >
            <Settings className="h-6 w-6" />
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;