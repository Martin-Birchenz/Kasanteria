import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";
import { shopConfig } from "../config/shopConfig.js";
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

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  const handleCheckWhatsapp = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      console.log("🚀 [Cart] Enviando orden al backend...");
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            name: customerName,
            phone: customerPhone,
            address: customerAddress,
            notes: customerNotes,
          },
          items: cart,
          total_price: totalPrice,
          payment_method: "whatsapp",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error("Error al crear la orden");
      }

      console.log("✅ [Cart] Orden creada con éxito en DB:", data);
      const orderNumber = data.orderId ? `#${data.orderId}` : "";
      const itemsList = cart.map(
        (i) =>
          `• ${i.name} x${i.quantity} ($${(i.price * i.quantity).toLocaleString("es-AR")})`,
      );
      const message = `👋 ¡Hola Kasantería! Quiero coordinar mi pedido ${orderNumber}:%0A%0A${itemsList}%0A%0A💰 *Total: $${totalPrice.toLocaleString("es-AR")}*`;
      window.open(
        `https://wa.me/${shopConfig.whatsappNumber}?text=${message}`,
        "_blank",
      );
      clearCart();
    } catch (error) {
      console.error(error);
    }
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
      <h2>Resumen de compra</h2>

      <div className="cart-grid">
        <section className="cart-items-section">
          <div className="cart-items-header">
            <span>Productos ({cart.length})</span>
            <button className="btn-clear-cart" onClick={() => clearCart()}>
              Vaciar carrito
            </button>
          </div>
          <div className="cart-items-list">
            {cart.map((item) => {
              const id = item.idproducts || item.id;
              const imageUrl = item.image_path
                ? `http://localhost:3000${item.image_path}`
                : "https://placehold.co/80x80/e2e8f0/475569?text=K";
              return (
                <article className="cart-item-card" key={id}>
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/80x80/e2e8f0/475569?text=K";
                    }}
                  />
                  <div className="cart-items-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item__price">
                      {" "}
                      $ {Number(item.price).toLocaleString("es-AR")} c/u
                    </p>
                  </div>

                  <div className="cart-items-quantity">
                    <button onClick={() => decreaseQuantity(id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                  <div className="cart-item-subtotal">
                    ${" "}
                    {(Number(item.price) * item.quantity).toLocaleString(
                      "es-AR",
                    )}
                  </div>
                  <button
                    className="btn-remove-item"
                    onClick={() => removeFromCart(id)}
                  >
                    Eliminar
                  </button>
                </article>
              );
            })}
          </div>
        </section>
        <section className="cart-checkout-section">
          <h3>Datos de entrega y contacto</h3>
          <form className="checkout-form" onSubmit={handleCheckWhatsapp}>
            <div className="form-group">
              <label>Nombre y apellido</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nombre y apellido"
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Teléfono"
                required
              />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Dirección"
                required
              />
            </div>
            <div className="form-group">
              <label>Notas adicionales</label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Notas adicionales"
              />
            </div>
            <div className="checkout-summary">
              <div className="summary-row total">
                <span>Total</span>
                <span>$ {Number(totalPrice).toLocaleString("es-AR")}</span>
              </div>
            </div>
            <button className="btn-whatsapp-checkout" type="submit">
              Finalizar pedido por WhatsApp
            </button>
            <div className="divider-or">
              <span>O paga online</span>
            </div>
            <button className="btn-mp-placeholder" type="button">
              Pagar con Mercado Pago
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Cart;
