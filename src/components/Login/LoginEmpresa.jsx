import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config';
import './Login.css';
import Header from '../Header/Header';
import { useAuth } from '../../contexts/AuthContext'; // Añadir esta importación

export default function LoginEmpresa() {
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth(); // Añadir esta línea

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login-empresa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      });
      const data = await res.json();
      if (data.ok) {
        const userData = {
          rol: "empresa", // Asegúrate de incluir el rol
          ...data
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(userData));
        setCurrentUser(userData); // Actualizar el contexto de autenticación
        navigate("/inicio-empresa");
      } else {
        setError(data.error || data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-header">
          <h2>Iniciar Sesión</h2>
          <p>Accede a tu cuenta de empresa</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico:</label>
            <input
              id="correo"
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contraseña">Contraseña:</label>
            <input
              id="contraseña"
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
              required
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
            onClick={() => navigate("/registro-empresa")}
            className="link-button"
            disabled={loading}
            >
              Registrarse
            </button>
      </div>
    </div>
    </>
  );
}
