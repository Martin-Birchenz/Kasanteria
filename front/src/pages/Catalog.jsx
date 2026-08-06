import { useEffect, useState } from "react";
import { getProducts } from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";
import "../styles/catalog.css";

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      {products.length === 0 ? (
        <p className="catalog-status">No hay productos disponibles</p>
      ) : (
        <div className="catalog-grid">
          {products.map((product) => (
            <ProductCard
              key={product.idproducts || product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog;
