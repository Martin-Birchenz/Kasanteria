import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../services/authService.js";
import "../../styles/login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      console.log("Enviando login desde React:", { email, password });
      const data = await loginRequest(email, password);
      console.log("Respuesta recibida del backend:", data);
      if (data && data.user && data.token) {
        login(data.user, data.token);
        navigate("/admin");
      } else {
        throw new Error("Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error al intentar login:", error);
      const errorMessage = error?.message || "Error al iniciar sesión";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Panel de administración</h2>
        <p>Inicia sesión con tu cuenta de administrador</p>

        {error && <div className="login-alert danger">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </div>

        <button type="submit" className="login-button" disabled={submitting}>
          {submitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
};
