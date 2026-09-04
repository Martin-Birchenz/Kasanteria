import "../../styles/shopFlow.css";

export const CategoryHero = ({
  categories,
  selectedCatId,
  onSelectCategory,
}) => {
  return (
    <section className="category-section">
      <h2 className="section-title">Explorar por Categoría 🧶</h2>
      <div className="category-pills-row">
        <button
          className={`pill-cat-btn ${selectedCatId === "all" ? "active" : ""}`}
          onClick={() => onSelectCategory("all")}
        >
          Todas
        </button>
        {categories.map((cat) => {
          const id = cat.idcategories || cat.id;
          return (
            <button
              key={id}
              className={`pill-cat-btn ${String(selectedCatId) === String(id) ? "active" : ""}`}
              onClick={() => onSelectCategory(id)}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </section>
  );
};
