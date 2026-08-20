import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/api.js";
import { Loader } from "../components/Loader.jsx";
import { useCart } from "../context/CartContext.jsx";
import "../styles/productDetail.css";

export const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, decreaseQuantity, cart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  const currentItem = cart.find(
    (item) => String(item.idproducts || item.id) === String(id),
  );

  const quantityInCart = currentItem ? currentItem.quantity : 0;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        const primary =
          data.images?.find((i) => i.is_primary === 1) || data.images[0];
        setSelectedImage(primary ? primary.image_path : "");
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loader message="Cargando producto..." />;
  if (error || !product) {
    return (
      <div className="product-error-container">
        <h2>Producto no encontrado</h2>
        <Link to="/productos">Volver a la página de productos</Link>
      </div>
    );
  }

  const mainImageUrl = selectedImage
    ? `http://localhost:3000${selectedImage}`
    : "https://placehold.co/400x400/e2e8f0/475569?text=Kasanteria";

  const maxStock = Number(product.stock) || 99;

  return (
    <div className="product-detail-container">
      <nav className="breadcrumbs">
        <Link to="/productos">Volver a la página de productos</Link>
      </nav>

      <div className="product-detail-grid">
        <div className="gallery-section">
          <div className="main-image-wrap">
            <img src={mainImageUrl} alt={product.name} className="main-image" />
          </div>
          {product.images?.length > 1 && (
            <div className="thumbnails-row">
              {product.images.map((img) => (
                <button
                  key={img.idproduct_image}
                  className={`thumb-btn ${selectedImage === img.image_path ? "active" : ""}`}
                  onClick={() => setSelectedImage(img.image_path)}
                >
                  <img
                    src={`http://localhost:3000${img.image_path}`}
                    alt={product.name}
                    className="thumb-image"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-actions-section">
          <h2>{product.name}</h2>
          <div className="price-tag">
            ${Number(product.price).toLocaleString("es-AR")}
          </div>
          <div className="stock-info">
            {product.stock > 0 ? (
              <span className="in-stock">
                Stock disponible: <strong>{product.stock}</strong>
              </span>
            ) : (
              <span className="out-of-stock">
                <strong>Sin stock por el momento</strong>
              </span>
            )}
          </div>
          <div className="description-box">
            <h4>Descripción</h4>
            <p>{product.description || "No hay descripción disponible"}</p>
          </div>
          {product.stock > 0 && (
            <div className="purchase-controls">
              <div className="quantity-selector">
                <button
                  onClick={() =>
                    decreaseQuantity(product.idproducts || product.id)
                  }
                  disabled={quantityInCart <= 0}
                >
                  -
                </button>
                <span>{quantityInCart}</span>
                <button
                  onClick={() => addToCart(product, 1)}
                  disabled={quantityInCart >= (Number(product.stock) || 99)}
                >
                  +
                </button>
              </div>
              <button
                className="btn-add-detail"
                onClick={() => addToCart(product, 1)}
                disabled={quantityInCart >= (Number(product.stock) || 99)}
              >
                {quantityInCart > 0
                  ? `En el carrito (${quantityInCart}) 🛒`
                  : "Agregar al carrito 🛒"}{" "}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
