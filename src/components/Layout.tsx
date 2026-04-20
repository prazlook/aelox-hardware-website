import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-theme-dark text-theme-text-primary">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 pt-32 pb-16 pl-20"> {/* Augmenté pt-32 pour décaler tout le contenu vers le bas */}
          <Outlet />
        </main>
      </div>
      <Header />
    </div>
  );
};

export default Layout;