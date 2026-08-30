import { useState, useEffect } from "react";
import { Loader } from "../../components/Loader.jsx";
import "../../styles/adminSubcategories.css";

export const AdminSubcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const loadData = async () => {
    try {
      setLoading(true);
      const [resCats, resSubs] = await Promise.all([
        fetch("http://localhost:3000/categories"),
        fetch("http://localhost:3000/subcategories"),
      ]);

      if (resCats.ok && resSubs.ok) {
        const dataCats = await resCats.json();
        const dataSubs = await resSubs.json();
        setCategories(dataCats);
        setSubcategories(dataSubs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    if (!subcategoryName.trim() || !selectedCategoryId || submitting) return;

    setSubmitting(true);
    setFeedback({ message: "", type: "" });

    try {
      const res = await fetch("http://localhost:3000/subcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: subcategoryName.trim(),
          category_id: selectedCategoryId,
          categoryId: selectedCategoryId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setFeedback({
        message: "Subcategoría creada con éxito",
        type: "success",
      });
      setSubcategoryName("");
      loadData();
    } catch (error) {
      console.error(error);
      setFeedback({
        message: "Error al crear la subcategoría",
        type: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-subcat-container">
      <div className="admin-subcat-header">
        <h2>Gestión de Subcategorías</h2>
        <p className="admin-subcat-subtitle">
          Organiza tipos específicos dentro de cada categoría principal
        </p>
      </div>

      {feedback.message && (
        <div className={`feedback-alert ${feedback.type}`}>
          {feedback.message}
        </div>
      )}

      <div className="admin-subcat-grid">
        <section className="admin-card form-card">
          <h3>Nueva Subcategoría</h3>
          <form onSubmit={handleCreate} className="subcat-form">
            <div className="form-group">
              <label htmlFor="parentCat">Categoría Principal *</label>
              <select
                id="parentCat"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                required
              >
                <option value="">-- Selecciona una categoría --</option>
                {categories.map((cat) => (
                  <option key={cat.idcategories} value={cat.idcategories}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subName">Nombre de la Subcategoría *</label>
              <input
                id="subName"
                type="text"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
                placeholder="Ej: Cashmilon 4/7, Agujas de Bambú..."
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || categories.length === 0}
            >
              {submitting ? "Guardando..." : " Guardar Subcategoría"}
            </button>
            {categories.length === 0 && (
              <small className="hint-text">
                Primero debes crear al menos una Categoría principal.
              </small>
            )}
          </form>
        </section>

        {/* Listado */}
        <section className="admin-card list-card">
          <div className="card-header-flex">
            <h3>Subcategorías Registradas ({subcategories.length})</h3>
            <button onClick={loadData} className="btn-refresh-sm">
              🔄 Actualizar
            </button>
          </div>

          {loading ? (
            <Loader message="Cargando subcategorías..." />
          ) : subcategories.length === 0 ? (
            <p className="empty-text">No hay subcategorías creadas aún.</p>
          ) : (
            <div className="subcat-table-wrap">
              <table className="subcat-table">
                <thead>
                  <tr>
                    <th>Subcategoría</th>
                    <th>Categoría Padre</th>
                    <th>Slug</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategories.map((sub) => (
                    <tr key={sub.idsubcategories}>
                      <td>
                        <strong>{sub.name}</strong>
                      </td>
                      <td>
                        <span className="cat-badge">{sub.category_name}</span>
                      </td>
                      <td className="slug-cell">/{sub.slug}</td>
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
