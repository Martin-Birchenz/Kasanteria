import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { getCategories, getSubcategories, getProducts } from "../services/api";
import { Loader } from "../components/Loader.jsx";
import "../styles/shopFlow.css";

export const Home = () => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [selectedCatId, setSelectedCatId] = useState("all");
  const [selectedSubId, setSelectedSubId] = useState("all");

  const subcatSectionRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [cats, subs, prods] = await Promise.all([
          getCategories(),
          getSubcategories(),
          getProducts(),
        ]);
        setCategories(cats);
        setSubcategories(subs);
        setProducts(prods.filter((p) => p.is_active === 1));
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
          <span className="hero-tagline">Mercería & Taller Textil</span>
          <h1 className="hero-title">
            Materia noble para <em>creaciones</em> que perduran.
          </h1>
          <p className="hero-description">
            Hilados seleccionados, corte de telas por metro y cintería
            artesanal. Enviamos a todo el país desde nuestro taller.
          </p>
        </div>

        <div className="hero-media-frame">
          <img
            src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=900&auto=format&fit=crop"
            alt="Detalle de hilados en taller"
          />
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

        {/* Subcategorías como etiquetas vinculadas al ref */}
        {activeSubcategories.length > 0 && (
          <div
            ref={subcatSectionRef}
            style={{
              display: "flex",
              gap: "0.8rem",
              marginTop: "2rem",
              paddingTop: "1rem",
              flexWrap: "wrap",
              scrollMarginTop: "2.5rem",
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
          const img = p.image_path
            ? `http://localhost:3000${p.image_path}`
            : "https://placehold.co/400x400/ede4d8/a0604a?text=Punto+%26+Trama";

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
