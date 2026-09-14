import { Link } from "react-router-dom";
import "../styles/footer.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-col brand-col">
          <h3 className="footer-logo">Punto & Trama</h3>
          <p className="footer-text">
            Hilados de primera calidad, insumos textiles y mercería creativa
            seleccionados con dedicación para artesanos y amantes de las
            manualidades.
          </p>
          <div className="footer-socials">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="social-link"
            >
              <i className="fa-brands fa-instagram"></i>
              Instagram
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="social-link"
            >
              <i className="fa-brands fa-facebook"></i>
              Facebook
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Navegación</h4>
          <ul className="footer-links">
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/productos">Nuestro Catálogo</Link>
            </li>
            <li>
              <Link to="/carrito">Carrito de compras</Link>
            </li>
            <li>
              <Link to="/login">Acceso para Administradores</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <ul className="footer-contact">
            <li>📍 Nogoyá, Entre Ríos, Argentina</li>
            <li>
              <i className="fa-brands fa-whatsapp"></i>
              WhatsApp:{" "}
              <a
                href="https://wa.me/5493435123456"
                target="_blank"
                rel="noreferrer"
              >
                +54 9 3435 12-3456
              </a>
            </li>
            <li>✉️ info@kasanteria.com</li>
            <li>🕒 Lun a Sáb: 09:00 a 19:00 hs</li>
          </ul>
        </div>

        {/* Columna 4: Medios de Pago & Envíos */}
        <div className="footer-col">
          <h4>Medios de Pago</h4>
          <p className="footer-text-small">
            Aceptamos transferencias bancarias, efectivo y pagos seguros
            coordinados de forma directa.
          </p>
          <div className="payment-badges">
            <span className="badge">💵 Efectivo</span>
            <span className="badge">🏦 Transferencia</span>
            <span className="badge">💳 Mercado Pago</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© {currentYear} Punto & Marca. Todos los derechos reservados.</p>
          <p className="dev-credit">Hecho con dedicación para artesanos.</p>
        </div>
      </div>
    </footer>
  );
};
