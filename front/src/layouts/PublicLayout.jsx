import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const PublicLayout = () => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="main-content container">
        <Outlet />
      </main>
      <footer
        className="footer"
        style={{
          backgroundColor: "var(--bg-soft)",
          padding: "1rem 0",
          marginTop: "2rem",
          textAlign: "center",
        }}
      >
        <p> © 2026 Kasantería. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default PublicLayout;
