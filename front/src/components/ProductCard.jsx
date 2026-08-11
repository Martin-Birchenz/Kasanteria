import "../styles/productCard.css";
import { useCart } from "../context/CartContext.jsx";

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const imageUrl = product.image_path
    ? `http://localhost:3000${product.image_path}`
    : "https://via.placeholder.com/300x300?text=Kasantereía";

  return (
    <article className="product-card">
      <div className="product-card__image-container">
        <img
          src={imageUrl}
          alt={product.name}
          className="product-card__image"
        />
        {product.is_featured === 1 && (
          <span className="product-card__badge">Destacado</span>
        )}
      </div>

      <div className="product-card__content">
        <h2 className="product-card__title">{product.name}</h2>
        <p className="product-card__description">{product.description}</p>

        <div className="product-card__footer">
          <span className="product-card__price">
            $
            {Number(product.price).toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}
          </span>
          <button
            className="product-card__button"
            onClick={() => addToCart(product)}
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
