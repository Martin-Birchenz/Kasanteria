import { useState, useEffect } from "react";
import { Loader } from "../../components/Loader.jsx";
import "../../styles/adminCategories.css";

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    if (!newCatName.trim() || submitting) return;
    setSubmitting(true);
    setFeedback({ message: "", type: "" });

    try {
      const res = await fetch("http://localhost:3000/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: newCatName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setFeedback({ message: "Categoría creada con éxito", type: "success" });
      setNewCatName("");
      loadCategories();
    } catch (error) {
      console.error(error);
      setFeedback({ message: "Error al crear la categoría", type: "danger" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-cat-container">
      <div className="admin-cat-header">
        <div>
          <h2>Gestión de Categorías 🏷️</h2>
          <p className="admin-cat-subtitle">
            Crea categorías para organizar lanas, hilos, agujas y accesorios.
          </p>
        </div>
      </div>

      {feedback.message && (
        <div className={`feedback-alert ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      <div className="admin-cat-grid">
        {/* Formulario de Creación */}
        <section className="admin-card form-card">
          <h3>Nueva Categoría</h3>
          <form onSubmit={handleCreateCategory} className="cat-form">
            <div className="form-group">
              <label htmlFor="catName">Nombre de la categoría</label>
              <input
                id="catName"
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Ej: Lanas de Invierno, Macramé, Agujas..."
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Creando..." : "➕ Guardar Categoría"}
            </button>
          </form>
        </section>

        {/* Listado de Categorías */}
        <section className="admin-card list-card">
          <div className="card-header-flex">
            <h3>Categorías Existentes ({categories.length})</h3>
            <button onClick={loadCategories} className="btn-refresh-sm">
              🔄 Actualizar
            </button>
          </div>

          {loading ? (
            <Loader message="Cargando categorías..." />
          ) : categories.length === 0 ? (
            <p className="empty-text">No hay categorías registradas aún.</p>
          ) : (
            <div className="cat-table-wrap">
              <table className="cat-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Slug (URL)</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.idcategories}>
                      <td>
                        <strong>#{cat.idcategories}</strong>
                      </td>
                      <td>
                        <span className="cat-badge">{cat.name}</span>
                      </td>
                      <td className="cat-slug-cell">/{cat.slug}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
