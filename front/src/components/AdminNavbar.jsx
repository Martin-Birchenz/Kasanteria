import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/adminNavbar.css";

export const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="admin-nav-wrapper">
      <div className="admin-nav-container">
        <div className="admin-brand">
          <span className="admin-brand-icon">🧶</span>
          <div>
            <h1 className="admin-brand-title">Kasantería Admin</h1>
            <span className="admin-user-tag">
              Hola, {user?.name || "Administrador"}
            </span>
          </div>
        </div>

        <nav className="admin-links">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            📦 Productos
          </NavLink>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            🏷️ Categorías
          </NavLink>

          <NavLink
            to="/admin/subcategories"
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            🧵 Subcategorías
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive ? "admin-link active" : "admin-link"
            }
          >
            📋 Pedidos
          </NavLink>
        </nav>

        <div className="admin-actions">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn-store-preview"
          >
            Ver Tienda ↗
          </a>
          <button onClick={handleLogout} className="btn-logout">
            Salir 🚪
          </button>
        </div>
      </div>
    </header>
  );
};
