import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import {
  getCategories,
  getSubcategories,
  getProducts,
  getFeatured,
} from "../services/api";
import { Loader } from "../components/Loader.jsx";
import "../styles/shopFlow.css";
import { API_URL } from "../services/api.js";

const resolveImageUrl = (path) => {
  if (!path)
    return "https://placehold.co/400x400/ede4d8/a0604a?text=Punto+%26+Trama";
  return path.startsWith("http") ? path : `${API_URL}${path}`;
};

export const Home = () => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [featured, setFeatured] = useState([]);

  const [selectedCatId, setSelectedCatId] = useState("all");
  const [selectedSubId, setSelectedSubId] = useState("all");

  const subcatSectionRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [cats, subs, prods, featured] = await Promise.all([
          getCategories(),
          getSubcategories(),
          getProducts(),
          getFeatured(),
        ]);
        setCategories(cats);
        setSubcategories(subs);
        setProducts(prods.filter((p) => p.is_active === 1));
        setFeatured(featured.filter((p) => p.is_active === 1));
      } catch (error) {
        console.error("Error al obtener los datos iniciales", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleSelectCategory = (catId) => {
    setSelectedCatId(catId);
    setSelectedSubId("all");

    if (catId !== "all") {
      setTimeout(() => {
        subcatSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    }
  };

  const activeSubcategories =
    selectedCatId === "all"
      ? []
      : subcategories.filter(
          (s) => String(s.category_id) === String(selectedCatId),
        );

  const filteredProducts = products.filter((prod) => {
    if (selectedCatId === "all") return true;
    if (selectedSubId === "all") {
      const allowedSubs = activeSubcategories.map((s) =>
        String(s.idsubcategories || s.id),
      );
      return allowedSubs.includes(String(prod.subcategory_id));
    }
    return String(prod.subcategory_id) === String(selectedSubId);
  });

  if (loading) {
    return (
      <div className="home-loader-wrap">
        <Loader message="Abriendo el taller de Punto & Trama..." />
      </div>
    );
  }

  return (
    <main className="shop-main-container">
      <section className="atelier-hero">
        <div className="hero-manifesto">
          <span className="hero-tagline">Mercería & telas</span>
          <h1 className="hero-title">
            Materia noble para <em>creaciones</em> que perduran.
          </h1>
          <p className="hero-description">
            Hilados, corte de telas por medida, y todo en mercería. Enviamos a
            todo el país desde nuestro negocio.
          </p>
        </div>

        <div className="hero-media-frame">
          <svg
            className="hero-thread-weave"
            viewBox="0 0 240 400"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Ilustración de hilos entrelazados"
          >
            <path
              className="thread thread-1"
              d="M 40 0 C 120 60, 20 140, 100 200 C 180 260, 60 320, 140 400"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              className="thread thread-2"
              d="M 90 0 C 30 80, 160 120, 90 200 C 20 280, 150 300, 90 400"
              fill="none"
              stroke="var(--primary-light)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              className="thread thread-3"
              d="M 160 0 C 200 90, 100 150, 170 220 C 240 290, 130 330, 180 400"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              className="thread-spool"
              cx="120"
              cy="200"
              r="14"
              fill="var(--secondary-dark)"
            />
          </svg>
        </div>

        <aside className="hero-workshop-card">
          <span className="workshop-label">Atención de Taller</span>
          <p>
            ¿Buscás un metraje especial o asesoramiento de grosores? Cortamos
            telas y pesamos lanas a medida.
          </p>
          <a
            href="https://wa.me/5493435611122"
            target="_blank"
            rel="noreferrer"
            className="btn-editorial-add"
            style={{ textAlign: "center", textDecoration: "none" }}
          >
            Consultar por WhatsApp
          </a>
        </aside>
      </section>

      {featured.length > 0 && (
        <section className="featured-section" style={{ margin: "2rem 0" }}>
          <div className="section-editorial-header">
            <h2>Piezas Destacadas</h2>
            <span>Selección especial del negocio</span>
          </div>
          <div className="shop-products-grid">
            {featured.map((p) => {
              const id = p.idproducts || p.id;
              const img = resolveImageUrl(p.image_path);

              return (
                <article key={`feat-${id}`} className="artisan-product-card">
                  <div className="card-media">
                    <Link to={`/productos/${id}`}>
                      <img src={img} alt={p.name} loading="lazy" />
                    </Link>
                  </div>
                  <div className="card-body">
                    <Link to={`/productos/${id}`} className="card-title">
                      {p.name}
                    </Link>
                    <div className="card-pricing-block">
                      <span className="price-main">
                        ${Number(p.price).toLocaleString("es-AR")}
                      </span>
                      <button
                        type="button"
                        className="btn-editorial-add"
                        onClick={() => addToCart(p, 1)}
                        disabled={p.stock <= 0}
                      >
                        Añadir +
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="swatch-nav-section">
        <div className="section-editorial-header">
          <h2>Catálogo de Rubros</h2>
          <span>{filteredProducts.length} productos listados</span>
        </div>

        <div className="swatches-grid">
          <button
            type="button"
            className={`swatch-card-btn ${selectedCatId === "all" ? "active" : ""}`}
            onClick={() => handleSelectCategory("all")}
          >
            <span className="swatch-index">00</span>
            <strong className="swatch-name">Todo el Atelier</strong>
            <span className="swatch-count">Ver colección completa</span>
          </button>

          {categories.map((cat, idx) => {
            const id = cat.idcategories || cat.id;
            const count = products.filter((p) => {
              const sub = subcategories.find(
                (s) => (s.idsubcategories || s.id) === p.subcategory_id,
              );
              return sub && String(sub.category_id) === String(id);
            }).length;

            return (
              <button
                key={id}
                type="button"
                className={`swatch-card-btn ${String(selectedCatId) === String(id) ? "active" : ""}`}
                onClick={() => handleSelectCategory(id)}
              >
                <span className="swatch-index">0{idx + 1}</span>
                <strong className="swatch-name">{cat.name}</strong>
                <span className="swatch-count">{count} artículos</span>
              </button>
            );
          })}
        </div>

        {activeSubcategories.length > 0 && (
          <div
            ref={subcatSectionRef}
            style={{
              display: "flex",
              gap: "0.8rem",
              marginTop: "4rem",
              paddingTop: "4rem",
              flexWrap: "wrap",
              scrollMarginTop: "4rem",
            }}
          >
            <button
              type="button"
              className={`btn-editorial-add ${selectedSubId === "all" ? "active" : ""}`}
              onClick={() => setSelectedSubId("all")}
            >
              Ver todo el rubro
            </button>
            {activeSubcategories.map((sub) => {
              const subId = sub.idsubcategories || sub.id;
              return (
                <button
                  key={subId}
                  type="button"
                  className={`btn-editorial-add ${String(selectedSubId) === String(subId) ? "active" : ""}`}
                  style={{
                    backgroundColor:
                      String(selectedSubId) === String(subId)
                        ? "var(--secondary)"
                        : "transparent",
                    color:
                      String(selectedSubId) === String(subId)
                        ? "#ffffff"
                        : "var(--secondary-dark)",
                  }}
                  onClick={() => setSelectedSubId(subId)}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="shop-products-grid">
        {filteredProducts.map((p) => {
          const id = p.idproducts || p.id;
          const img = resolveImageUrl(p.image_path);

          return (
            <article key={id} className="artisan-product-card">
              <div className="card-media">
                <Link to={`/productos/${id}`}>
                  <img src={img} alt={p.name} loading="lazy" />
                </Link>
              </div>

              <div className="card-body">
                <div className="card-meta-line">
                  <span>{p.subcategory_name || "Taller"}</span>
                  {p.stock <= (p.min_stock || 5) && p.stock > 0 && (
                    <span style={{ color: "var(--primary)" }}>
                      Últimas piezas
                    </span>
                  )}
                </div>

                <Link to={`/productos/${id}`} className="card-title">
                  {p.name}
                </Link>

                <div className="card-pricing-block">
                  <div>
                    <span className="price-main">
                      ${Number(p.price).toLocaleString("es-AR")}
                    </span>
                    <span className="price-unit-tag">
                      /{p.unit_type || "un"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-editorial-add"
                    onClick={() => addToCart(p, 1)}
                    disabled={p.stock <= 0}
                  >
                    {p.stock > 0 ? "Añadir +" : "Agotado"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
};

export default Home;
