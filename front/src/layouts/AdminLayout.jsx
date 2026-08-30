import { Outlet } from "react-router-dom";
import { AdminNavbar } from "../components/AdminNavbar.jsx";

const AdminLayout = () => {
  return (
    <div className="layout-wrapper">
      <AdminNavbar />
      <main className="main-content container">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
