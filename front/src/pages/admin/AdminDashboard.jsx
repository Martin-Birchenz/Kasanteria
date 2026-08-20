import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getProducts, getCategories } from "../../services/api";
import {
  createProductWithImages,
  toggleProductsStatus,
  deleteProduct,
} from "../../services/adminService.js";
import { Loader } from "../../components/Loader.jsx";
import "../../styles/adminDashboard.css";

export const AdminDashboard = () => {
  const { user, token, logout } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
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
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("subcategoryId", subcategoryId || 1);

      images.forEach((file) => {
        formData.append("images", file);
      });

      await createProductWithImages(formData, token);
      setMessage("Producto creado exitosamente");

      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      setSubcategoryId("");
      setImages([]);
      setImagePreviews([]);

      loadData();
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>Dashboard de administración</h1>
          <p>
            Bienvenido <strong> {user?.name || user?.email}</strong> (Admin)
          </p>
        </div>
        <button onClick={logout}>Cerrar sesión</button>
      </header>

      {message && <div className="admin-alert success">{message}</div>}
      {error && <div className="admin-alert danger">{error}</div>}

      <div className="admin-grid">
        <section className="admin-card">
          <h2>Productos</h2>
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre del producto</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del producto"
              />
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción del producto"
              />
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Precio ($) * </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Precio del producto"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Stock disponible</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stock disponible"
              />
            </div>
            <div className="form-group">
              <label>Imágenes del producto</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                placeholder="Subir imágenes del producto"
              />
            </div>

            {imagePreviews.length > 0 && (
              <div className="preview-container">
                {imagePreviews.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt="Preview"
                    className="image-preview"
                  />
                ))}
              </div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={submitting}
            >
              {submitting ? "Guardando en la base de datos..." : "Guardar"}
            </button>
          </form>
        </section>
        <section className="admin-card">
          <h3>Inventario Actual ({products.length})</h3>
          {loading ? (
            <Loader message="Cargando productos..." />
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const id = p.idproducts || p.id;
                    const img = p.image_path
                      ? `http://localhost:3000${p.image_path}`
                      : "https://via.placeholder.com/50x50?text=K";

                    return (
                      <tr key={id}>
                        <td>
                          <img
                            src={img}
                            alt={p.name}
                            className="table-thumbnail"
                          />
                        </td>
                        <td>
                          <strong>{p.name}</strong>
                        </td>
                        <td>${Number(p.price).toFixed(2)}</td>
                        <td>{p.stock}</td>
                        <td>
                          <button
                            className={
                              p.is_active === 1
                                ? "badge-active btn-badge"
                                : "badge-inactive btn-badge"
                            }
                            onClick={() => handleToggle(id, p.is_active)}
                          >
                            {p.is_active === 1
                              ? "Activo (Visible)"
                              : "Pausado (Oculto)"}
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(id)}
                          >
                            Eliminar
                          </button>
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
