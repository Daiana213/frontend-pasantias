import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config';
import "./Login.css";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginEstudiante() {
  const [legajo, setLegajo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login-estudiante`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ legajo, password: contraseña }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify({
        tipo: "estudiante",
        ...data
      }));

      setCurrentUser({
        tipo: "estudiante",
        ...data
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      window.location.href= '/inicio-estudiante';
    }
  }, [currentUser]); // Add navigate to the dependency array

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Iniciar Sesión</h2>
        <p>Accede a tu cuenta de estudiante</p>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="legajo">Legajo</label>
          <input
            id="legajo"
            type="text"
            placeholder="Ingresa tu legajo"
            value={legajo}
            onChange={e => setLegajo(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contraseña">Contraseña</label>
          <input
            id="contraseña"
            type="password"
            placeholder="Ingresa tu contraseña"
            value={contraseña}
            onChange={e => setContraseña(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
      <div className="login-footer">
        <p>¿No tienes cuenta?</p>
        <button 
          onClick={() => navigate("/registro-estudiante")}
          className="link-button"
          disabled={loading}
        >
          Registrarse
        </button>
      </div>
    </div>
  );
}
