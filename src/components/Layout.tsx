import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-theme-dark text-theme-text-primary">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 pb-16"> {/* Ajout de pb-16 pour compenser le header fixe */}
          <Outlet />
        </main>
      </div>
      <Header /> {/* Le Header est maintenant un sibling direct et est fixe */}
    </div>
  );
};

export default Layout;