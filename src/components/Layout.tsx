import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-theme-dark text-theme-text-primary">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 pl-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;