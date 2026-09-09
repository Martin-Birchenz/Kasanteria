import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/api.js";
import { Loader } from "../components/Loader.jsx";
import { useCart } from "../context/CartContext.jsx";
import { API_URL } from "../config/imageApi.js";
import "../styles/productDetail.css";

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [error, setError] = useState(null);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/products/${id}`);
        if (!res.ok) throw new Error("Error al obtener el producto");
        const data = await res.json();
        setProduct(data);

        if (data.images && data.images.length > 0) {
          const primary =
            data.images.find((img) => img.is_primary === 1) || data.images[0];
          setSelectedImage(`http://localhost:3000${primary.image_path}`);
        } else if (data.image_path) {
          setSelectedImage(`http://localhost:3000${data.image_path}`);
        }
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // const currentItem = cart.find(
  //   (item) => String(item.idproducts || item.id) === String(id),
  // );

  // const quantityInCart = currentItem ? currentItem.quantity : 0;

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading)
    return (
      <div className="detail-loader-wrap">
        <Loader message="Cargando detalles del producto..." />
      </div>
    );

  if (!product) {
    return (
      <div className="detail-error-wrap">
        <h2>Producto no encontrado</h2>
        <Link to="/productos">Volver a la página de productos</Link>
      </div>
    );
  }

  const colorOptions = product.description?.toLowerCase().includes("colores:")
    ? product.description
        .split(/colores:/i)[1]
        ?.split(".")[0]
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];

  const handleQuantityChange = (delta) => {
    const nextVal = quantity + delta;
    if (nextVal >= 1 && nextVal <= product.stock) {
      setQuantity(nextVal);
    }
  };

  const handleAdd = () => {
    addToCart(product, quantity, selectedColor);
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2500);
  };

  const isLowStock = product.stock <= (product.min_stock || 5);

  const mainImageUrl = selectedImage
    ? `${API_URL}${selectedImage}`
    : "https://placehold.co/400x400/e2e8f0/475569?text=Kasanteria";

  const maxStock = Number(product.stock) || 99;

  return (
    <main className="product-detail-container">
      <nav className="breadcrumb-nav">
        <Link to="/">Inicio</Link> <span>/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="product-detail-grid">
        <section className="detail-gallery">
          <div className="main-image-frame">
            <img
              src={
                selectedImage ||
                "https://placehold.co/500x500/ede4d8/a0604a?text=Punto+%26+Trama"
              }
              alt={product.name}
            />
            {product.is_featured === 1 && (
              <span className="badge-featured-detail">Destacado ⭐</span>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="thumbnails-track">
              {product.images.map((img) => {
                const fullUrl = `${API_URL}${img.image_path}`;
                return (
                  <button
                    key={img.idproduct_image}
                    type="button"
                    className={`thumb-btn ${selectedImage === fullUrl ? "active" : ""}`}
                    onClick={() => setSelectedImage(fullUrl)}
                  >
                    <img src={fullUrl} alt="Vista adicional" />
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="detail-info-panel">
          <span className="detail-category-badge">
            {product.category_name} ➔ {product.subcategory_name}
          </span>

          <h1 className="detail-title">{product.name}</h1>

          <div className="detail-price-box">
            <span className="detail-price">
              ${Number(product.price).toLocaleString("es-AR")}
            </span>
            <span className="detail-unit">
              por {product.unit_type || "unidad"}
            </span>
          </div>

          <div className="detail-stock-status">
            {product.stock > 0 ? (
              <span
                className={`stock-pill ${isLowStock ? "low" : "available"}`}
              >
                {isLowStock
                  ? `¡Últimas ${product.stock} unidades en stock!`
                  : `Disponible: ${product.stock} ${product.unit_type || "unidades"}`}
              </span>
            ) : (
              <span className="stock-pill out">Sin stock por el momento</span>
            )}
          </div>

          {colorOptions.length > 0 && (
            <div className="detail-option-group">
              <label>Color disponible:</label>
              <div className="color-pills">
                {colorOptions.map((col, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`color-pill ${selectedColor === col ? "selected" : ""}`}
                    onClick={() => setSelectedColor(col)}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="detail-option-group">
            <label>Cantidad ({product.unit_type || "unidad"}):</label>
            <div className="quantity-counter">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || product.stock <= 0}
              >
                -
              </button>
              <span className="qty-number">{quantity}</span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock || product.stock <= 0}
              >
                +
              </button>
            </div>
          </div>

          <div className="detail-actions">
            <button
              className="btn-detail-add"
              onClick={handleAdd}
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Añadir al Carrito" : "Agotado"}
            </button>
            {addedMessage && (
              <span className="cart-feedback-pill">¡Agregado al carrito!</span>
            )}
          </div>

          {product.description && (
            <div className="detail-description">
              <h3>Descripción del producto</h3>
              <p>{product.description}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
