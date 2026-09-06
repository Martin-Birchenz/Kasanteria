import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "../styles/paymentStatus.css";

export const PaymentStatus = ({ type }) => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get("payment_id");
  const externalReference = searchParams.get("external_reference");

  useEffect(() => {
    if (type === "success") {
      clearCart();
    }
  }, [type]);

  const configs = {
    success: {
      icon: "🎉",
      title: "¡Pago Acreditado con Éxito!",
      subtitle: "Muchas gracias por tu compra en Punto & Trama.",
      desc: "Tu pedido ya ingresó a nuestro sistema y lo estamos preparando con todo el cuidado.",
      btnText: "Volver a la tienda",
      btnClass: "btn-success-view",
    },
    failure: {
      icon: "⚠️",
      title: "El pago no pudo procesarse",
      subtitle: "Ocurrió un problema con el método de pago seleccionado.",
      desc: "No te preocupes, no se realizó ningún cargo. Podés volver a intentarlo o coordinar tu compra por WhatsApp.",
      btnText: "Reintentar en el Carrito",
      btnLink: "/carrito",
      btnClass: "btn-failure-view",
    },
    pending: {
      icon: "⏳",
      title: "Pago en Proceso",
      subtitle: "Estamos aguardando la confirmación de acreditación.",
      desc: "Si elegiste pagar en efectivo (Pago Fácil / Rapipago), recordá abonar el cupón antes de que venza para reservar tu pedido.",
      btnText: "Volver al Catálogo",
      btnClass: "btn-pending-view",
    },
  };

  const current = configs[type] || configs.success;

  return (
    <main className="payment-status-wrapper">
      <div className={`status-card status-${type}`}>
        <div className="status-icon-circle">{current.icon}</div>
        <h1>{current.title}</h1>
        <p className="status-subtitle">{current.subtitle}</p>
        <p className="status-description">{current.desc}</p>

        {externalReference && (
          <div className="status-order-chip">
            Nº de Pedido: <strong>#{externalReference}</strong>
            {paymentId && <small> (Comprobante MP: {paymentId})</small>}
          </div>
        )}

        <div className="status-actions">
          <Link
            to={current.btnLink || "/"}
            className={`btn-status-action ${current.btnClass}`}
          >
            {current.btnText}
          </Link>
          <a
            href="https://wa.me/5493435611122"
            target="_blank"
            rel="noreferrer"
            className="btn-status-support"
          >
            ¿Dudas? Escribinos por WhatsApp 💬
          </a>
        </div>
      </div>
    </main>
  );
};
