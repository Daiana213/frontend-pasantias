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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (contraseña !== verificarContraseña) {
      setError("Las contraseñas no coinciden");
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

      console.log("Response status:", res.status);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar usuario");
      }

      alert("Registro exitoso. Por favor, inicia sesión.");
      navigate("/login-empresa");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="registro-container">
        <h2>Registro de Empresa</h2>
        <form className="registro-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          <input type="email" placeholder="Correo electrónico" value={correo} onChange={e => setCorreo(e.target.value)} required />
          <input type="text" placeholder="Persona de contacto" value={personaContacto} onChange={e => setPersonaContacto(e.target.value)} required />
          <input type="tel" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required />
          <input type="text" placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={contraseña} onChange={e => setContraseña(e.target.value)} required />
          <input type="password" placeholder="Verificar contraseña" value={verificarContraseña} onChange={e => setVerificarContraseña(e.target.value)} required />
          <button type="submit">Registrarse</button>
        </form>
        {error && <div style={{color: "red", marginTop: 8}}>{error}</div>}
        <div className="registro-link">
          <span>¿Ya tienes cuenta?</span>
          <button onClick={() => navigate("/login-empresa")}>Iniciar Sesión</button>
        </div>
      </div>
    </>
  );
}