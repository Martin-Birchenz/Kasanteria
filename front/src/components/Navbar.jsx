import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";
import { useCart } from "../context/CartContext.jsx";
import { useState } from "react";

const Navbar = () => {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="main-header">
      <div className="header-inner">
        <button
          type="button"
          className={`hamburger-btn ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menú de navegación"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <Link to="/" className="brand-logo" onClick={() => setIsOpen(false)}>
          Punto &amp; Trama
          <span className="brand-sub">Mercería &amp; Telas</span>
        </Link>

        {/* Navegación Principal */}
        <nav className={`header-nav ${isOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setIsOpen(false)}
          >
            Inicio
          </NavLink>

          <NavLink
            to="/productos"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            onClick={() => setIsOpen(false)}
          >
            Catálogo
          </NavLink>

          <a
            href="https://wa.me/5493435611122"
            target="_blank"
            rel="noreferrer"
            className="nav-item nav-external"
            onClick={() => setIsOpen(false)}
          >
            Asesoramiento WhatsApp ↗
          </a>
        </nav>

        <div className="header-actions">
          <Link to="/carrito" className="nav-cart-btn">
            <span className="cart-icon">🛒</span>
            <span className="cart-label">Mi carrito de compras</span>
            <span className="cart-badge">{totalItems}</span>
          </Link>
        </div>
      </div>

      {isOpen && (
        <div className="mobile-backdrop" onClick={() => setIsOpen(false)} />
      )}
    </header>
  );
};

export default Navbar;
