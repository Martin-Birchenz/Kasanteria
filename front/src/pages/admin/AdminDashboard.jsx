import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  getProducts,
  getCategories,
  getSubcategories,
} from "../../services/api";
import {
  createProductWithImages,
  updateProductWithImages,
  toggleProductsStatus,
  toggleFeaturedStatus,
  deleteProduct,
} from "../../services/adminService.js";
import { Loader } from "../../components/Loader.jsx";
import "../../styles/adminDashboard.css";

export const AdminDashboard = () => {
  const { user, token, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [unitType, setUnitType] = useState("unidad");
  const [minStock, setMinStock] = useState("5");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, subcategoriesData] =
        await Promise.all([getProducts(), getCategories(), getSubcategories()]);
      setProducts(productsData);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);
    setSubcategoryId("");

    if (!categoryId) {
      setFilteredSubcategories([]);
    } else {
      const filtered = subcategories.filter(
        (sub) => String(sub.category_id) === String(categoryId),
      );
      setFilteredSubcategories(filtered);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product.idproducts || product.id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price);
    setStock(product.stock);
    setUnitType(product.unit_type || "unidad");
    setMinStock(product.min_stock || 5);

    const currentSub = subcategories.find(
      (sub) => String(sub.idsubcategories) === String(product.subcategory_id),
    );

    if (currentSub) {
      setSelectedCategory(currentSub.category_id);
      setFilteredSubcategories(
        subcategories.filter(
          (sub) => String(sub.category_id) === String(currentSub.category_id),
        ),
      );
      setSubcategoryId(currentSub.idsubcategories);
    }

    setImages([]);
    setImagePreviews([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setUnitType("unidad");
    setMinStock(5);
    setSelectedCategory("");
    setSubcategoryId("");
    setFilteredSubcategories([]);
    setImages([]);
    setImagePreviews([]);
  };

  const handleToggle = async (productId, currentStatus) => {
    try {
      await toggleProductsStatus(productId, currentStatus, token);
      setProducts((prev) =>
        prev.map((p) => {
          const id = p.idproducts || p.id;
          if (id === productId) {
            return { ...p, is_active: currentStatus === 1 ? 0 : 1 };
          }
          return p;
        }),
      );
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?"))
      return;
    try {
      await deleteProduct(productId, token);
      setProducts((prev) => prev.filter((p) => p.idproducts !== productId));
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(files);
    const previews = files.map((files) => URL.createObjectURL(files));
    setImagePreviews(previews);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!subcategoryId) {
      setError("Selecciona una subcategoría");
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("subcategory_id", subcategoryId);

      images.forEach((file) => {
        formData.append("images", file);
      });

      if (editingId) {
        await updateProductWithImages(editingId, formData);
        setMessage("Producto actualizado exitosamente");
      } else {
        await createProductWithImages(formData, token);
        setMessage("Producto creado exitosamente");
      }

      handleCancelEdit();
      loadData();
    } catch (error) {
      console.error(error);
      setError(error.message || "Error al guardar el producto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFeatured = async (productId, currentFeatured) => {
    try {
      await toggleFeaturedStatus(productId, currentFeatured);
      setProducts((prev) =>
        prev.map((p) => {
          const id = p.idproducts || p.id;
          if (id === productId) {
            return { ...p, is_featured: currentFeatured === 1 ? 0 : 1 };
          }
          return p;
        }),
      );
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>Punto & Trama — Administración</h1>
          <p>
            Sesión: <strong>{user?.name || user?.email}</strong>
          </p>
        </div>
        <button onClick={logout} className="btn-logout">
          Cerrar sesión
        </button>
      </header>

      {message && <div className="admin-alert success">{message}</div>}
      {error && <div className="admin-alert danger">{error}</div>}

      <div className="admin-grid">
        {/* Formulario */}
        <section className="admin-card">
          <h2>{editingId ? "✏️ Editar Producto" : "➕ Nuevo Producto"}</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre del producto *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Cinta Raso Doble Faz"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group col-half">
                <label>Categoría *</label>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Selecciona categoría</option>
                  {categories.map((c) => (
                    <option key={c.idcategories} value={c.idcategories}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group col-half">
                <label>Subcategoría *</label>
                <select
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  disabled={!selectedCategory}
                  required
                >
                  <option value="">
                    {!selectedCategory
                      ? "Elige categoría primero"
                      : "Selecciona subcategoría"}
                  </option>
                  {filteredSubcategories.map((s) => (
                    <option key={s.idsubcategories} value={s.idsubcategories}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-half">
                <label>Precio ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group col-half">
                <label>Unidad de Venta *</label>
                <select
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                >
                  <option value="unidad">Por Unidad</option>
                  <option value="metro">Por Metro</option>
                  <option value="100g">Por 100 gramos</option>
                  <option value="kilo">Por Kilo</option>
                  <option value="paquete">Por Paquete</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-half">
                <label>Stock Disponible *</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Cantidad actual"
                  required
                />
              </div>

              <div className="form-group col-half">
                <label>Alerta de Stock Mínimo</label>
                <input
                  type="number"
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value)}
                  placeholder="Avisar cuando baje de..."
                />
              </div>
            </div>

            <div className="form-group">
              <label>Descripción / Colores disponibles</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Colores: Rojo, Azul marino, Blanco tiza. Grosor: 25mm..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>
                {editingId
                  ? "Agregar más imágenes (opcional)"
                  : "Imágenes del producto"}
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="preview-container">
                {imagePreviews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Preview"
                    className="image-preview"
                  />
                ))}
              </div>
            )}

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={submitting}
              >
                {submitting
                  ? "Guardando..."
                  : editingId
                    ? "💾 Guardar Cambios"
                    : "➕ Publicar Producto"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Listado */}
        <section className="admin-card">
          <div className="card-header-flex">
            <h3>Inventario ({products.length})</h3>
            <button className="btn-refresh-sm" onClick={loadData}>
              🔄
            </button>
          </div>

          {loading ? (
            <Loader message="Cargando inventario..." />
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Destacado</th>
                    <th>Visibilidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const id = p.idproducts || p.id;
                    const img = p.image_path
                      ? `http://localhost:3000${p.image_path}`
                      : "https://placehold.co/50x50?text=P&T";
                    const isLowStock =
                      Number(p.stock) <= Number(p.min_stock || 5);

                    return (
                      <tr
                        key={id}
                        className={isLowStock ? "row-low-stock" : ""}
                      >
                        <td>
                          <img
                            src={img}
                            alt={p.name}
                            className="table-thumbnail"
                          />
                        </td>
                        <td>
                          <strong>{p.name}</strong>
                          <div className="table-subcat-badge">
                            {p.category_name} ➔ {p.subcategory_name}
                          </div>
                        </td>
                        <td>
                          ${Number(p.price).toFixed(2)}
                          <small className="unit-label">
                            /{p.unit_type || "un"}
                          </small>
                        </td>
                        <td>
                          <span
                            className={
                              isLowStock ? "badge-low-stock" : "badge-ok-stock"
                            }
                          >
                            {p.stock} {p.unit_type || "un."}
                            {isLowStock && " ⚠️"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`btn-toggle-badge ${p.is_featured === 1 ? "featured-yes" : "featured-no"}`}
                            onClick={() =>
                              handleToggleFeatured(id, p.is_featured)
                            }
                            title="Alternar destacado"
                          >
                            {p.is_featured === 1 ? "⭐ Sí" : "☆ No"}
                          </button>
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`btn-toggle-badge ${p.is_active === 1 ? "active-yes" : "active-no"}`}
                            onClick={() => handleToggle(id, p.is_active)}
                          >
                            {p.is_active === 1 ? "Visible" : "Pausado"}
                          </button>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button
                              className="btn-action-edit"
                              onClick={() => handleEditClick(p)}
                              title="Editar producto"
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-action-delete"
                              onClick={() => handleDelete(id)}
                              title="Eliminar producto"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
