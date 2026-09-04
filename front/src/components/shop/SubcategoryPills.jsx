import "../../styles/shopFlow.css";

export const SubcategoryPills = ({
  subcategories,
  selectedSubId,
  onSelectSubcategory,
}) => {
  if (!subcategories || !subcategories.length === 0) return null;
  return (
    <div className="subcat-filter-wrapper">
      <span className="subcat-label">Filtrar tipo:</span>
      <div className="subcat-pills-row">
        <button
          className={`pill-sub-btn ${selectedSubId === "all" ? "active" : ""}`}
          onClick={() => onSelectSubcategory("all")}
        >
          Ver todo el rubro
        </button>
        {subcategories.map((sub) => {
          const id = sub.idsubcategories || sub.id;
          return (
            <button
              key={id}
              className={`pill-sub-btn ${String(selectedSubId) === String(id) ? "active" : ""}`}
              onClick={() => onSelectSubcategory(id)}
            >
              {sub.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
