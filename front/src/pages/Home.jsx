import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeatured } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { Loader } from "../components/Loader.jsx";
import "../styles/home.css";

export const Home = () => {
  const [featured, setFeatured] = useState([]);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoading(true);
        const data = await getFeatured();
        setFeatured(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener los productos destacados", error);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Hilados y mercería creativa</span>
          <h1>Dale vida a tus proyectos</h1>
          <p>
            Insumos, lanas de primera calidad y accesorios seleccionados con
            dedicación
          </p>
          <div className="hero-actions">
            <Link to="/productos" className="btn-hero-primary">
              Ver catálogo completo
            </Link>
            <a
              href="https://wa.me/5493435611122"
              rel="noreferrer"
              target="_blank"
              className="btn-hero-secondary"
            >
              Consultar por Whatsapp
            </a>
          </div>
        </div>
      </section>

      <section className="features-bar">
        <div className="feature-item">
          <span className="feature-icon">✨</span>
          <div>
            <h4>Calidad Garantizada</h4>
            <p>Hilados seleccionados y probados</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🚚</span>
          <div>
            <h4>Envíos Seguros</h4>
            <p>Coordinamos la entrega a tu medida</p>
          </div>
        </div>
        <div className="feature-item">
          <span className="feature-icon">💬</span>
          <div>
            <h4>Atención Directa</h4>
            <p>Asesoramiento personalizado por WhatsApp</p>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2>Productos Destacados</h2>
          <Link to="/productos" className="link-all">
            Ver todos los productos
          </Link>
        </div>

        {loading ? (
          <Loader message="Cargando productos destacados..." />
        ) : featured.length === 0 ? (
          <p className="no-featured">
            No hay productos destacados por el momento.
          </p>
        ) : (
          <div className="featured-grid">
            {featured.map((product) => {
              const id = product.idproducts || product.id;
              const img = product.image_path
                ? `http://localhost:3000${product.image_path}`
                : "https://placehold.co/300x300/e2e8f0/475569?text=Kasanteria";

              return (
                <article key={id} className="featured-card">
                  <Link to={`/productos/${id}`} className="featured-img-link">
                    <img src={img} alt={product.name} loading="lazy" />
                  </Link>

                  <div className="featured-info">
                    <Link to={`/productos/${id}`}>
                      <h3>{product.name}</h3>
                    </Link>
                    <p className="featured-desc">{product.description}</p>
                    <div className="featured-bottom">
                      <span className="featured-price">
                        ${Number(product.price).toLocaleString("es-AR")}
                      </span>
                      <button
                        className="btn-add-featured"
                        onClick={() => addToCart(product, 1)}
                        disabled={product.stock <= 0}
                      >
                        {product.stock > 0 ? "Agregar 🛒" : "Agotado"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
