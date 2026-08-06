import { Link } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <h1>Kasantería</h1>
          <p>Mercería y tejidos</p>
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
            Carrito <span className="cart-badge">0</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
