import { useEffect, useState, useMemo } from "react";
import { getProducts, getCategories } from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";
import { Loader } from "../components/Loader.jsx";
import { useCart } from "../context/CartContext.jsx";
import "../styles/catalog.css";
import { Link } from "react-router-dom";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories().catch(() => []),
        ]);
        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch =
          product.name
            ?.toLowerCase()
            .includes(searchTerm.toLocaleLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm.toLocaleLowerCase());
        const matchesCategory =
          selectedCategory === "all" ||
          String(product.category_id || product.subcategory_id) ===
            String(selectedCategory);
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
        if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
        return 0;
      });
  }, [products, searchTerm, selectedCategory, sortBy]);

  if (isLoading) {
    return <h1 className="catalog-status">Cargando...</h1>;
  }
  if (error) {
    return <h1 className="catalog-error">Error al obtener los productos</h1>;
  }

  return (
    <div className="catalog-container">
      <header className="catalog-header">
        <h1>Catálogo de productos</h1>
        <p>Insumos seleccionado para tus proyectos de tejido y mercería</p>
      </header>
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nombre o material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        <div className="select-group">
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todas las Categorías</option>
              {categories.map((cat) => (
                <option
                  key={cat.idcategories || cat.id}
                  value={cat.idcategories || cat.id}
                >
                  {cat.name}
                </option>
              ))}
            </select>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="default">Ordenar por: Destacados</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>
      <div className="results-count">
        Mostrando {filteredProducts.length}{" "}
        {filteredProducts.length === 1 ? "producto" : "productos"}
      </div>
      {filteredProducts.length === 0 ? (
        <div className="empty-catalog">
          <h3>No encontramos productos 🧶</h3>
          <p>
            Prueba con otros términos de búsqueda o selecciona otra categoría.
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const id = product.idproducts || product.id;
            const img = product.image_path
              ? `http://localhost:3000${product.image_path}`
              : "https://via.placeholder.com/300x300?text=Kasanteria";

            return (
              <article key={id} className="product-card">
                <div className="product-image-wrap">
                  <Link to={`/productos/${id}`}>
                    <img src={img} alt={product.name} loading="lazy" />
                  </Link>
                  {product.stock <= 0 && (
                    <span className="badge-out">Sin Stock</span>
                  )}
                </div>

                <div className="product-info">
                  <Link to={`/productos/${id}`}>
                    <h3>{product.name}</h3>
                  </Link>
                  <p className="product-description">{product.description}</p>
                  <div className="product-bottom">
                    <span className="product-price">
                      ${Number(product.price).toLocaleString("es-AR")}
                    </span>
                    <button
                      className="btn-add"
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      {product.stock > 0 ? "Agregar 🛒" : "Agotado"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Catalog;
