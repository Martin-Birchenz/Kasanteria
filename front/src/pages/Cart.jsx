import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";
import { shopConfig } from "../config/shopConfig.js";
import "../styles/cart.css";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice } =
    useCart();

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("retiro");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);

  if (cart.length === 0) {
    return (
      <main className="cart-empty-container">
        <h2>Tu carrito está vacío</h2>
        <p>Agrega algunos productos al carrito</p>
        <Link to="/productos" className="btn-return-shop">
          Explorar Catálogo
        </Link>
      </main>
    );
  }

  const handleSendWhatsApp = (e) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim()) {
      alert("Por favor completá tu nombre y teléfono de contacto.");
      return;
    }

    if (
      (deliveryMethod === "flete" || deliveryMethod === "correo") &&
      !address.trim()
    ) {
      alert("Por favor ingresá tu dirección para coordinar la entrega.");
      return;
    }

    const businessPhone = "5493435611122";

    const deliveryTexts = {
      retiro: "Retiro en taller / local (Gratis)",
      flete: "Cadetería / Flete local",
      correo: `Envío por Correo Argentino ${postalCode ? `(CP: ${postalCode})` : ""}`,
    };

    // Declaración e inicialización en un solo paso
    let waMessage = ` *NUEVO PEDIDO - PUNTO & TRAMA*\n`;
    waMessage += `--------------------------------------\n`;
    waMessage += ` *Cliente:* ${customerName.trim()}\n`;
    if (email && email.trim()) {
      waMessage += ` *Email:* ${email.trim()}\n`;
    }
    waMessage += ` *Teléfono:* ${phone.trim()}\n`;
    waMessage += ` *Método de entrega:* ${deliveryTexts[deliveryMethod] || "A convenir"}\n`;

    if (address && address.trim()) {
      waMessage += ` *Dirección:* ${address.trim()}\n`;
    }
    if (notes && notes.trim()) {
      waMessage += ` *Notas:* ${notes.trim()}\n`;
    }

    waMessage += `--------------------------------------\n`;
    waMessage += ` *DETALLE DEL PEDIDO:*\n`;

    cart.forEach((item, index) => {
      const unit = item.unit_type || "un";
      const colorText =
        item.selectedColor && item.selectedColor !== "Único"
          ? ` [Color: ${item.selectedColor}]`
          : "";
      const subtotal = Number(item.price) * item.quantity;
      waMessage += `${index + 1}. *${item.name}*${colorText}\n`;
      waMessage += `   ↳ Cantidad: ${item.quantity} ${unit} | Subtotal: $${subtotal.toLocaleString("es-AR")}\n`;
    });

    waMessage += `--------------------------------------\n`;
    waMessage += ` *TOTAL APROXIMADO:* $${(totalPrice + (deliveryMethod === "correo" ? shippingCost : 0)).toLocaleString("es-AR")}\n\n`;
    waMessage += `_Hola! Quiero confirmar la disponibilidad de este pedido para coordinar el pago y entrega._`;

    const encodedMessage = encodeURIComponent(waMessage);
    const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleCalculateShipping = async () => {
    if (!postalCode || postalCode.length < 4) {
      alert("Ingresá un código postal válido de 4 dígitos");
      return;
    }

    try {
      setCalculatingShipping(true);
      const res = await fetch(
        `http://localhost:3000/shipping/calculate?cp=${postalCode}`,
      );
      const data = await res.json();

      if (res.ok) {
        setShippingCost(Number(data.cost));
        setShippingInfo(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCalculatingShipping(false);
    }
  };

  // const handleDeliveryChange = (method) => {
  //   setDeliveryMethod(method);
  //   if (method !== "correo") {
  //     setShippingCost(0);
  //     setShippingInfo(null);
  //   }
  // };

  const handlePayWithMercadoPago = async () => {
    if (!customerName.trim() || !phone.trim() || !email.trim()) {
      alert("Por favor completá tu nombre, email y teléfono antes de pagar.");
      return;
    }

    if (
      (deliveryMethod === "flete" || deliveryMethod === "correo") &&
      !address.trim()
    ) {
      alert("Por favor ingresá la dirección de entrega.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3000/payments/create-preference",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: {
              name: customerName,
              phone: phone,
              address:
                `${address} ${postalCode ? `(CP: ${postalCode})` : ""}`.trim(),
              notes: notes,
            },
            items: cart,
            shippingCost: deliveryMethod === "correo" ? shippingCost : 0,
          }),
        },
      );

      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("Hubo un error al generar el enlace de pago.");
      }
    } catch (err) {
      console.error("Error conectando con Mercado Pago:", err);
    }
  };

  return (
    <main className="cart-page-container">
      <h1 className="cart-title">Tu Carrito de Compras 🛍️</h1>

      <div className="cart-grid">
        {/* Listado de Productos */}
        <section className="cart-items-section">
          <div className="cart-header-row">
            <h2>Productos ({cart.length})</h2>
            <button
              type="button"
              className="btn-clear-cart"
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
          </div>

          <div className="cart-items-list">
            {cart.map((item) => {
              const img = item.image_path
                ? `http://localhost:3000${item.image_path}`
                : "https://placehold.co/80x80/ede4d8/a0604a?text=P&T";

              return (
                <article key={item.itemKey} className="cart-item-card">
                  <img src={img} alt={item.name} className="cart-item-img" />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    {item.selectedColor && item.selectedColor !== "Único" && (
                      <span className="cart-item-color">
                        Color: {item.selectedColor}
                      </span>
                    )}
                    <span className="cart-item-unit-price">
                      ${Number(item.price).toLocaleString("es-AR")} /
                      {item.unit_type || "un"}
                    </span>
                  </div>

                  <div className="cart-item-counter">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.itemKey, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.itemKey, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-subtotal">
                    $
                    {(Number(item.price) * item.quantity).toLocaleString(
                      "es-AR",
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={() => removeFromCart(item.itemKey)}
                    title="Eliminar producto"
                  >
                    ✕
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* Resumen y Checkout */}
        <section className="cart-checkout-section">
          <h2>Finalizar Pedido</h2>

          <form onSubmit={handleSendWhatsApp} className="checkout-form">
            <div className="checkout-field">
              <label htmlFor="cName">Tu Nombre Completo *</label>
              <input
                id="cName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej: Laura Gómez"
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="cEmail">Correo Electrónico *</label>
              <input
                id="cEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ej: laura@ejemplo.com"
                required
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="cPhone">Teléfono / WhatsApp *</label>
              <input
                id="cPhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: 3435123456"
                required
              />
            </div>

            <div className="checkout-field">
              <label>Forma de Entrega *</label>
              <div className="delivery-options">
                <label
                  className={`radio-pill ${deliveryMethod === "retiro" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="retiro"
                    checked={deliveryMethod === "retiro"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                  />
                  Retiro en Taller (Gratis)
                </label>

                <label
                  className={`radio-pill ${deliveryMethod === "flete" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="flete"
                    checked={deliveryMethod === "flete"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                  />
                  Cadetería / Flete Local
                </label>

                <label
                  className={`radio-pill ${deliveryMethod === "correo" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="correo"
                    checked={deliveryMethod === "correo"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                  />
                  Correo Argentino
                </label>
              </div>
            </div>

            {deliveryMethod === "correo" && (
              <div className="checkout-field">
                <label htmlFor="cPostal">Código Postal</label>
                <div className="cp-input-group">
                  <input
                    id="cPostal"
                    type="number"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Ej: 3150"
                  />
                  <button
                    type="button"
                    className="btn-calc-cp"
                    onClick={handleCalculateShipping}
                    disabled={calculatingShipping}
                  >
                    {calculatingShipping ? "Calculando..." : "Calcular Costo"}
                  </button>
                </div>
                {shippingInfo && (
                  <div className="shipping-badge-info">
                    <span>🚚 {shippingInfo.name}</span>
                    <strong>
                      ${Number(shippingInfo.cost).toLocaleString("es-AR")}
                    </strong>
                    <small>({shippingInfo.estimated_days})</small>
                  </div>
                )}
              </div>
            )}

            {(deliveryMethod === "flete" || deliveryMethod === "correo") && (
              <div className="checkout-field">
                <label htmlFor="cAddress">Dirección de entrega *</label>
                <input
                  id="cAddress"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, número, piso/depto y localidad"
                  required
                />
              </div>
            )}

            <div className="checkout-field">
              <label htmlFor="cNotes">Aclaraciones adicionales</label>
              <textarea
                id="cNotes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Preferencias de horario, dudas de grosor, etc."
                rows="2"
              />
            </div>

            <div className="checkout-summary-box">
              <div className="summary-row">
                <span>Subtotal productos:</span>
                <span>${totalPrice.toLocaleString("es-AR")}</span>
              </div>
              {deliveryMethod === "correo" && (
                <div className="summary-row">
                  <span>Costo de envío:</span>
                  <span>${shippingCost.toLocaleString("es-AR")}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total Estimado:</span>
                <span>
                  ${(totalPrice + shippingCost).toLocaleString("es-AR")}
                </span>
              </div>
              <small className="summary-hint">
                * El envío se abona o coordina directamente por WhatsApp según
                destino.
              </small>
            </div>

            <button type="submit" className="btn-submit-order">
              Enviar Pedido por WhatsApp 📲
            </button>
            <div className="checkout-buttons-group">
              <button
                type="button"
                className="btn-mp-checkout"
                onClick={handlePayWithMercadoPago}
              >
                Pagar con Mercado Pago 💳
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Cart;
