import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import "../styles/cart.css";

const Cart = () => {
  const {
    cart,
    addToCart,
    totalPrice,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleCheckWhatsapp = () => {
    const phone = "+5493435611122";
    let message = "Hola, quiero hacer el siguiente pedido:\n\n";

    cart.forEach((item) => {
      message +
        -`• ${item.name} - ${item.quantity} - $${(Number(item.price) * item.quantity).toFixed(2)}\n`;
    });

    message += "\n\nTotal: $" + totalPrice.toFixed(2);

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty container">
        <h2>Tu carrito está vacío</h2>
        <p>Agrega algunos productos al carrito</p>
        <Link to="/productos">Ver todos los productos</Link>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h2>Resumen detu carrito</h2>

      <div className="cart-layout">
        <div className="cart-items-list">
          {cart.map((item) => {
            const id = item.idproducts || item.id;
            const imageUrl = item.image_path
              ? `http://localhost:3000${item.image_path}`
              : "https://via.placeholder.com/300x300?text=Kasantereía";
            return (
              <div className="cart-item" key={id}>
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="cart-item__image"
                />
                <div className="cart-items-details">
                  <h3>{item.name}</h3>
                  <p className="cart-item__price">
                    {" "}
                    $ {Number(item.price).toFixed(2)} c/u{" "}
                  </p>
                </div>

                <div className="cart-items-controls">
                  <button onClick={() => decreaseQuantity(id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item)}>+</button>
                </div>

                <div className="cart-item__subtotal">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </div>

                <button
                  className="cart-item__remove"
                  onClick={() => removeFromCart(id)}
                >
                  Eliminar
                </button>
              </div>
            );
            <button className="clear-cart-button" onClick={() => clearCart()}>
              Vaciar carrito
            </button>;
          })}
        </div>
        <div className="cart-summary">
          <h3>Total de la compra</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>$ {totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>$ {totalPrice.toFixed(2)}</span>
          </div>
          <button className="whatsapp-button" onClick={handleCheckWhatsapp}>
            Finalizar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
