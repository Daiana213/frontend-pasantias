import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config';
import './Login.css';
import Header from '../Header/Header';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginEmpresa() {
  const [correo, setCorreo] = useState("");
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
      const res = await fetch(`${API_URL}/api/auth/login-empresa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contraseña }),
      });
      
      const data = await res.json();
      
      if (data.ok) {
        const userData = {
          role: "empresa",
          ...data
        };
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
        }
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        localStorage.setItem("usuario", JSON.stringify(userData));
        setCurrentUser(userData);
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

  useEffect(() => {
    if (currentUser) {
      navigate('/inicio-empresa');
    }
  }, [currentUser, navigate]);

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
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
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
