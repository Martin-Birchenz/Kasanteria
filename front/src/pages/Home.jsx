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
        <svg
          className="hero-decor-illustration"
          viewBox="0 0 680 460"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <radialGradient id="skeinGrad" cx="35%" cy="30%" r="75%">
              <stop offset="0%" style={{ stopColor: "var(--primary-light)" }} />
              <stop offset="50%" style={{ stopColor: "var(--primary)" }} />
              <stop offset="100%" style={{ stopColor: "#764331" }} />
            </radialGradient>
            <radialGradient id="spoolGrad" cx="35%" cy="25%" r="80%">
              <stop offset="0%" style={{ stopColor: "#8fa07d" }} />
              <stop offset="60%" style={{ stopColor: "var(--secondary)" }} />
              <stop
                offset="100%"
                style={{ stopColor: "var(--secondary-dark)" }}
              />
            </radialGradient>
            <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#5a6b4c" }} />
              <stop
                offset="100%"
                style={{ stopColor: "var(--secondary-dark)" }}
              />
            </linearGradient>
          </defs>

          <g transform="rotate(-8 280 230)">
            <rect
              x="145"
              y="120"
              width="9"
              height="230"
              rx="4"
              fill="url(#needleGrad)"
              transform="rotate(20 150 120)"
            />
            <circle
              cx="150"
              cy="120"
              r="7"
              fill="var(--secondary-dark)"
              transform="rotate(20 150 120)"
            />
            <rect
              x="410"
              y="120"
              width="9"
              height="230"
              rx="4"
              fill="url(#needleGrad)"
              transform="rotate(-20 415 120)"
            />
            <circle
              cx="415"
              cy="120"
              r="7"
              fill="var(--secondary-dark)"
              transform="rotate(-20 415 120)"
            />
          </g>

          <g>
            <circle cx="280" cy="240" r="105" fill="url(#skeinGrad)" />
            <path
              d="M 195 200 A 105 105 0 0 1 350 175"
              fill="none"
              stroke="var(--primary-light)"
              strokeWidth="3.5"
              opacity="0.65"
            />
            <path
              d="M 185 250 A 105 105 0 0 1 285 137"
              fill="none"
              stroke="#7a4636"
              strokeWidth="3.5"
              opacity="0.55"
            />
            <path
              d="M 190 290 A 105 105 0 0 1 355 300"
              fill="none"
              stroke="var(--primary-light)"
              strokeWidth="3.5"
              opacity="0.6"
            />
            <path
              d="M 220 325 A 105 105 0 0 1 375 235"
              fill="none"
              stroke="#7a4636"
              strokeWidth="3.5"
              opacity="0.5"
            />
            <path
              d="M 235 145 A 105 105 0 0 1 365 265"
              fill="none"
              stroke="var(--primary-light)"
              strokeWidth="3"
              opacity="0.5"
            />
            <path
              d="M 270 135 A 105 105 0 0 1 210 340"
              fill="none"
              stroke="#7a4636"
              strokeWidth="3"
              opacity="0.45"
            />
          </g>

          <path
            d="M 340 260 C 400 270, 430 310, 470 320"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <g transform="translate(500,300)">
            <rect
              x="-16"
              y="-62"
              width="32"
              height="12"
              rx="3"
              fill="url(#spoolGrad)"
            />
            <rect
              x="-16"
              y="50"
              width="32"
              height="12"
              rx="3"
              fill="url(#spoolGrad)"
            />
            <rect
              x="-10"
              y="-50"
              width="20"
              height="100"
              fill="var(--secondary)"
            />
            <path
              d="M -10 -32 L 10 -24 L -10 -12 L 10 -2 L -10 10 L 10 22 L -10 34"
              fill="none"
              stroke="var(--secondary-dark)"
              strokeWidth="2.5"
              opacity="0.7"
            />
          </g>
        </svg>

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
