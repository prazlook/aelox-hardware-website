import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAppStatus } from "@/context/AppStatusContext";
import { cn } from "@/lib/utils";

const Layout = () => {
  const { isAppRunning } = useAppStatus();

  return (
    <div className="flex min-h-screen bg-theme-dark text-theme-text-primary">
      {isAppRunning && <Sidebar />}
      <div className="flex flex-col flex-1">
        <main className={cn(
          "flex-1 p-6 pb-16",
          isAppRunning && "pl-20"
        )}>
          <Outlet />
        </main>
      </div>
      {isAppRunning && <Header />}
    </div>
  );
};

export default Layout;