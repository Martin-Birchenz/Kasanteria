import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useCart } from "../context/CartContext.jsx";

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <h1>Punto y Trama</h1>
          <p>Mercería & Tejidos</p>
        </Link>

        <nav className="navbar-nav">
          <Link to="/" className="nav-link">
            Inicio
          </Link>
          <Link to="/productos" className="nav-link">
            Catálogo
          </Link>
        </nav>

        <div className="navbar-actions">
          <Link to="/carrito" className="cart-button">
            Carrito <span className="cart-badge"> {totalItems} </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
