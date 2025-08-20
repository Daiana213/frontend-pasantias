import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../../config';
import './Registro.css';
import Header from '../Header/Header';

export default function RegistroEmpresa() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [personaContacto, setPersonaContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [verificarContraseña, setVerificarContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (contraseña !== verificarContraseña) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/registro-empresa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nombre, 
          correo, 
          personaContacto, 
          telefono, 
          direccion, 
          contraseña 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar empresa");
      }

      alert("Registro exitoso. Por favor, inicia sesión.");
      navigate("/login-empresa");
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
        <h2>Registro de Empresa</h2>
        <p>Completa los datos de tu empresa</p>
        <form className="registro-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la empresa</label>
            <input 
              id="nombre"
              type="text" 
              placeholder="Ingresa el nombre de la empresa" 
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input 
              id="correo"
              type="email" 
              placeholder="Ingresa el correo electrónico" 
              value={correo} 
              onChange={e => setCorreo(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="personaContacto">Persona de contacto</label>
            <input 
              id="personaContacto"
              type="text" 
              placeholder="Ingresa el nombre de la persona de contacto" 
              value={personaContacto} 
              onChange={e => setPersonaContacto(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input 
              id="telefono"
              type="tel" 
              placeholder="Ingresa el número de teléfono" 
              value={telefono} 
              onChange={e => setTelefono(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input 
              id="direccion"
              type="text" 
              placeholder="Ingresa la dirección de la empresa" 
              value={direccion} 
              onChange={e => setDireccion(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="contraseña">Contraseña</label>
            <input 
              id="contraseña"
              type="password" 
              placeholder="Ingresa la contraseña" 
              value={contraseña} 
              onChange={e => setContraseña(e.target.value)} 
              required 
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="verificarContraseña">Confirmar contraseña</label>
            <input 
              id="verificarContraseña"
              type="password" 
              placeholder="Confirma la contraseña" 
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
            onClick={() => navigate("/login-empresa")}
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