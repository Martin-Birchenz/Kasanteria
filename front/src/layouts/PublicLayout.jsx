import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";

const PublicLayout = () => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="main-content container">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
