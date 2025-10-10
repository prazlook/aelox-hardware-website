import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-theme-dark text-theme-text-primary">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Header /> {/* Le Header est maintenant en bas */}
      </div>
    </div>
  );
};

export default Layout;