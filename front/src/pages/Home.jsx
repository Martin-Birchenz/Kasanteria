import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFeatured } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { getCategories, getSubcategories, getProducts } from "../services/api";
import { Loader } from "../components/Loader.jsx";
import "../styles/shopFlow.css";
import { ProductGrid } from "../components/shop/ProductGrid.jsx";
import { CategoryHero } from "../components/shop/CategoryHero.jsx";
import { SubcategoryPills } from "../components/shop/SubcategoryPills.jsx";

export const Home = () => {
  const [featured, setFeatured] = useState([]);
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCatId, setSelectedCatId] = useState("all");
  const [selectedSubId, setSelectedSubId] = useState("all");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [cats, subs, prods] = await Promise.all([
          getCategories(),
          getSubcategories(),
          getProducts(),
        ]);
        setCategories(cats);
        setAllSubcategories(subs);
        setProducts(prods.filter((p) => p.is_active === 1));
      } catch (error) {
        console.error("Error al obtener los datos iniciales", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleSelectCategory = (catId) => {
    setSelectedCatId(catId);
    setSelectedSubId("all");
  };

  const handleSelectSubcategory = (subId) => {
    setSelectedSubId(subId);
  };

  const handleAddToCart = (product) => {
    alert(`Se añadió el producto ${product.name} a su carrito`);
  };

  const activeSubcategories =
    selectedCatId === "all"
      ? []
      : allSubcategories.filter(
          (sub) => String(sub.category_id) === String(selectedCatId),
        );

  const displayedProducts = products.filter((prod) => {
    if (selectedCatId === "all") return true;

    if (selectedSubId === "all") {
      const allowedSubIds = activeSubcategories.map((sub) =>
        String(sub.idsubcategories || sub.id),
      );
      return allowedSubIds.includes(String(prod.subcategory_id));
    }
    return String(prod.subcategory_id) === String(selectedSubId);
  });

  if (loading) {
    return (
      <div className="home-loader-wrap">
        <Loader message="Cargando productos..." />
      </div>
    );
  }

  return (
    <main className="shop-main-container">
      <CategoryHero
        categories={categories}
        selectedCatId={selectedCatId}
        onSelectCategory={handleSelectCategory}
      />

      <SubcategoryPills
        subcategories={activeSubcategories}
        selectedSubId={selectedSubId}
        onSelectSubcategory={handleSelectSubcategory}
      />

      <div className="shop-results-header">
        <h2>
          {selectedCatId === "all"
            ? "Catálogo Completo"
            : categories.find(
                (c) => String(c.idcategories || c.id) === String(selectedCatId),
              )?.name}
        </h2>
        <span className="results-badge">
          {displayedProducts.length} productos
        </span>
      </div>

      <ProductGrid products={displayedProducts} onAddToCart={handleAddToCart} />
    </main>
  );
};

export default Home;
