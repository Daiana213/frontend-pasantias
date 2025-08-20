import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL} from '../../config';
import "./Registro.css";
import Header from '../Header/Header';

export default function RegistroEstudiante() {
  const [email, setEmail] = useState("");
  const [legajo, setLegajo] = useState("");
  const [password, setPassword] = useState("");
  const [verificarContraseña, setVerificarContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== verificarContraseña) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/registro-estudiante`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, legajo, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      alert(data.message || "Tu solicitud de registro ha sido enviada. Recibirás un email cuando sea aprobada.");
      navigate("/login-estudiante");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="registro-container">
        <h2>Registro de Estudiante</h2>
        <p>Completa tus datos para crear tu cuenta</p>
        <form className="registro-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input 
              id="email"
              type="email" 
              placeholder="Ingresa tu correo electrónico" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
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
            <label htmlFor="password">Contraseña</label>
            <input 
              id="password"
              type="password" 
              placeholder="Ingresa tu contraseña" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="verificarContraseña">Confirmar contraseña</label>
            <input 
              id="verificarContraseña"
              type="password" 
              placeholder="Confirma tu contraseña" 
              value={verificarContraseña} 
              onChange={e => setVerificarContraseña(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className={loading ? 'loading' : ''}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>
        <div className="registro-link">
          <span>¿Ya tienes cuenta?</span>
          <button 
            onClick={() => navigate("/login-estudiante")}
            className="link-button"
            disabled={loading}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </>
  );
}
