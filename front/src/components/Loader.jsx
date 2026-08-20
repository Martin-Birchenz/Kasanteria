import "../styles/loader.css";

export const Loader = ({ message = "Cargando..." }) => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p className="loader-text">{message}</p>
    </div>
  );
};
