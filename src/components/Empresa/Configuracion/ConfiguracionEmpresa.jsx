import React, { useState, useEffect } from 'react';
import HeaderEmpresa from '../../Header/HeaderEmpresa';
import { API_URL, getAuthHeader } from '../../../config';
import { useAuth } from '../../../contexts/AuthContext';
import './ConfiguracionEmpresa.css';

export default function ConfiguracionEmpresa() {
  const { setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [perfilData, setPerfilData] = useState({
    nombre: '',
    correo: '',
    personaContacto: '',
    telefono: '',
    direccion: '',
    descripcion: '',
    sitioWeb: '',
    sector: '',
    tamaño: ''
  });

  useEffect(() => {
    cargarDatosEmpresa();
  }, []);

  const cargarDatosEmpresa = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/perfil-empresa`, {
        headers: getAuthHeader()
      });
      if (response.ok) {
        const data = await response.json();
        setPerfilData({
          nombre: data.nombre || '',
          correo: data.correo || '',
          personaContacto: data.personaContacto || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          descripcion: data.descripcion || '',
          sitioWeb: data.sitioWeb || '',
          sector: data.sector || '',
          tamaño: data.tamaño || ''
        });
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos de la empresa');
    }
  };

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfilData((prev) => ({ ...prev, [name]: value }));
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMensaje('');
    try {
      const response = await fetch(`${API_URL}/api/auth/actualizar-perfil-empresa`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(perfilData)
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setCurrentUser(updatedUser);
        setMensaje('Perfil actualizado correctamente');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar el perfil');
      }
    } catch (err) {
      setError('Error de conexión al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderEmpresa />
      <div className="configuracion-empresa-container">
        <div className="configuracion-header">
          <h1>Perfil de la Empresa</h1>
          <p>Gestiona la información del perfil de tu empresa</p>
        </div>
        <div className="configuracion-content">
          <div className="configuracion-main">
            {mensaje && <div className="success-message">{mensaje}</div>}
            {error && <div className="error-message">{error}</div>}
            <div className="config-section">
              <h2>Perfil de la Empresa</h2>
              <form onSubmit={guardarPerfil} className="perfil-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre de la Empresa <span className="required-field">*</span></label>
                    <input type="text" name="nombre" value={perfilData.nombre} onChange={handlePerfilChange} placeholder="Nombre de la empresa" required />
                  </div>
                  <div className="form-group">
                    <label>Email Corporativo <span className="required-field">*</span></label>
                    <input type="email" name="correo" value={perfilData.correo} onChange={handlePerfilChange} disabled className="disabled-field" title="Este campo no se puede modificar por seguridad" />
                    <small className="field-note">Campo crítico - No editable</small>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Persona de Contacto</label>
                    <input type="text" name="personaContacto" value={perfilData.personaContacto} onChange={handlePerfilChange} placeholder="Nombre del responsable de RR.HH." />
                  </div>
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input type="tel" name="telefono" value={perfilData.telefono} onChange={handlePerfilChange} placeholder="Número de teléfono" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Dirección</label>
                  <input type="text" name="direccion" value={perfilData.direccion} onChange={handlePerfilChange} placeholder="Dirección completa de la empresa" />
                </div>
                <div className="form-group">
                  <label>Descripción de la Empresa</label>
                  <textarea name="descripcion" value={perfilData.descripcion} onChange={handlePerfilChange} rows="4" placeholder="Describe qué hace tu empresa, su misión y valores..." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Sitio Web</label>
                    <input type="url" name="sitioWeb" value={perfilData.sitioWeb} onChange={handlePerfilChange} placeholder="https://www.tuempresa.com" />
                  </div>
                  <div className="form-group">
                    <label>Sector</label>
                    <select name="sector" value={perfilData.sector} onChange={handlePerfilChange}>
                      <option value="">Selecciona el sector</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Manufactura">Manufactura</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Construcción">Construcción</option>
                      <option value="Salud">Salud</option>
                      <option value="Educación">Educación</option>
                      <option value="Finanzas">Finanzas</option>
                      <option value="Consultoría">Consultoría</option>
                      <option value="Energía">Energía</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Tamaño de la Empresa</label>
                  <select name="tamaño" value={perfilData.tamaño} onChange={handlePerfilChange}>
                    <option value="">Selecciona el tamaño</option>
                    <option value="Startup (1-10)">Startup (1-10 empleados)</option>
                    <option value="Pequeña (11-50)">Pequeña (11-50 empleados)</option>
                    <option value="Mediana (51-200)">Mediana (51-200 empleados)</option>
                    <option value="Grande (201-1000)">Grande (201-1000 empleados)</option>
                    <option value="Corporación (+1000)">Corporación (+1000 empleados)</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" disabled={loading} className="btn-save">{loading ? 'Guardando...' : 'Guardar Perfil'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
