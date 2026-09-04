import { Link } from "react-router-dom";
import "../../styles/shopFlow.css";

export const ProductGrid = ({ products, onAddToCart }) => {
  if (products.length === 0) {
    return (
      <div className="empty-products-view">
        <h2>No hay productos disponibles</h2>
        <p>Pronto sumaremos más opciones a esta sección</p>
      </div>
    );
  }

  return (
    <div className="shop-products-grid">
      {products.map((p) => {
        const id = p.idproducts || p.id;
        const img = p.image_path
          ? `http://localhost:3000${p.image_path}`
          : "https://placehold.co/300x300/e2e8f0/475569?text=Punto+%26+Trama";

        return (
          <article key={id} className="artisan-product-card">
            <div className="card-media">
              <Link to={`/productos/${id}`}>
                <img src={img} alt={p.name} loading="lazy" />
              </Link>
              {p.is_featured === 1 && (
                <span className="badge-pill featured">Destacado ⭐</span>
              )}
              {p.stock <= 0 && (
                <span className="badge-pill out-of-stock">Agotado</span>
              )}
            </div>

            <div className="card-body">
              <div className="card-subcat-hint">
                {p.subcategory_name || "Mercería"}
              </div>
              <Link to={`/productos/${id}`}>
                <h3 className="card-title">{p.name}</h3>
              </Link>

              {p.description && (
                <p className="card-desc-snippet">{p.description}</p>
              )}

              <div className="card-pricing-row">
                <div className="price-tag">
                  ${Number(p.price).toLocaleString("es-AR")}
                  <span className="price-unit">/{p.unit_type || "un"}</span>
                </div>

                <button
                  className="btn-add-cart"
                  onClick={() => onAddToCart(p)}
                  disabled={p.stock <= 0}
                >
                  {p.stock > 0 ? "Añadir 🛒" : "Agotado"}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
