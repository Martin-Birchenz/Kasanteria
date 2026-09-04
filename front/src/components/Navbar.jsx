import { Link, NavLink } from "react-router-dom";
import "../styles/navbar.css";
import { useCart } from "../context/CartContext.jsx";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { totalItems } = useCart();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
  }, []);

  return (
    <header className="main-header">
      <div className="header-top">
        <Link to="/" className="brand-logo">
          <span className="brand-symbol">🧶</span> Punto &amp; Trama
        </Link>
        <div className="header-actions">
          <Link to="/carrito" className="nav-cart-btn">
            🛒 Carrito <span className="cart-badge"> {totalItems} </span>
          </Link>
        </div>
      </div>

      <nav className="header-nav">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Inicio
        </NavLink>
        <NavLink
          to="/productos"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Todos los Productos
        </NavLink>
        {categories.map((cat) => (
          <NavLink
            key={cat.idcategories || cat.id}
            to={`/productos?categoria=${cat.idcategories || cat.id}`}
            className="nav-item nav-category-item"
          >
            {cat.name}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
