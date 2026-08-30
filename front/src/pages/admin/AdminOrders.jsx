import { useState, useEffect } from "react";
import { Loader } from "../../components/Loader.jsx";
import "../../styles/admin.css";

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/orders", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:3000/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            (o.idorders || o.id) === orderId ? { ...o, status: newStatus } : o,
          ),
        );
        if (
          selectedOrder &&
          (selectedOrder.idorders || selectedOrder.id) === orderId
        ) {
          setSelectedOrder((prev) => ({ ...selectedOrder, status: newStatus }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openDetail = async (orderId) => {
    try {
      setModalLoading(true);
      const res = await fetch(`http://localhost:3000/orders/${orderId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Reciente";
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? "Reciente"
      : d.toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  return (
    <div className="admin-orders-container">
      <div className="orders-header">
        <h2>Gestión de Pedidos 📋</h2>
        <button className="btn-refresh" onClick={loadOrders}>
          Actualizar 🔄
        </button>
      </div>

      {loading ? (
        <Loader message="Cargando pedidos..." />
      ) : orders.length === 0 ? (
        <p className="empty-msg">No hay pedidos registrados aún.</p>
      ) : (
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Nº de orden</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Contacto y entrega</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const id = o.idorders || o.id;
                return (
                  <tr key={id}>
                    <td>
                      <strong>#{id}</strong>
                    </td>
                    <td>{formatDate(o.created_at)}</td>
                    <td>{o.customer_name}</td>
                    <td>
                      <div>📞 {o.customer_phone || "Sin teléfono"}</div>
                      {o.customer_address && <div>📍 {o.customer_address}</div>}
                      {o.customer_notes && <div>📝 {o.customer_notes}</div>}
                    </td>
                    <td>
                      <strong>
                        ${Number(o.total_amount || 0).toLocaleString("es-AR")}
                      </strong>
                    </td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(id, e.target.value)}
                        className={`status-select status-${o.status}`}
                      >
                        <option value="pendiente">Pendiente ⏳</option>
                        <option value="completado">Completado ✅</option>
                        <option value="cancelado">Cancelado ❌</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => openDetail(id)}
                      >
                        Ver detalle 🔍
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Detalle */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Detalle del Pedido #{selectedOrder.idorders || selectedOrder.id}
              </h3>
              <button
                className="btn-close"
                onClick={() => setSelectedOrder(null)}
              >
                ✕
              </button>
            </div>

            <div className="order-summary-meta">
              <p>
                <strong>Fecha:</strong> {formatDate(selectedOrder.created_at)}
              </p>
              <p>
                <strong>Cliente:</strong> {selectedOrder.customer_name}
              </p>
              <p>
                <strong>Teléfono:</strong>{" "}
                {selectedOrder.customer_phone || "Sin teléfono"}
              </p>
              <p>
                <strong>Dirección:</strong>{" "}
                {selectedOrder.customer_address || "Sin dirección"}
              </p>
              <p>
                <strong>Notas del cliente:</strong>{" "}
                {selectedOrder.customer_notes || "Sin notas"}
              </p>
              <p>
                <strong>Estado:</strong> {selectedOrder.status?.toUpperCase()}
              </p>
              <p>
                <strong>Total:</strong> $
                {Number(selectedOrder.total_amount || 0).toLocaleString(
                  "es-AR",
                )}
              </p>
            </div>

            <h4>Productos del pedido:</h4>
            <div className="order-items-list">
              {selectedOrder.items?.map((item) => (
                <div
                  key={item.idorder_items || item.id}
                  className="order-item-row"
                >
                  <div>
                    <p className="item-name">{item.name}</p>
                    <span className="item-qty">
                      Cantidad: {item.quantity} x $
                      {Number(item.price_at_purchase).toLocaleString("es-AR")}
                    </span>
                  </div>
                  <strong>
                    $
                    {(
                      item.quantity * Number(item.price_at_purchase)
                    ).toLocaleString("es-AR")}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
