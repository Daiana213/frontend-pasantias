import React, { useState, useEffect } from 'react';
import HeaderEstudiante from '../../Header/HeaderEstudiante';
import { API_URL, getAuthHeader } from '../../../config';
import { useAuth } from '../../../contexts/AuthContext';
import './ConfiguracionEstudiante.css';

export default function ConfiguracionEstudiante() {
  const { setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [perfilData, setPerfilData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    legajo: '',
    telefono: '',
    carrera: '',
    añoIngreso: '',
    materias_aprobadas: '',
    promedio: '',
    experienciaLaboral: '',
    habilidades: '',
    linkedin: '',
    github: '',
    cv_url: ''
  });

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/auth/perfil-estudiante`, {
        headers: getAuthHeader()
      });
      if (response.ok) {
        const data = await response.json();
        const perfil = { ...perfilData };
        Object.keys(perfil).forEach((key) => {
          perfil[key] = data[key] || '';
        });
        setPerfilData(perfil);
      } else {
        throw new Error('Error al cargar los datos del usuario');
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.message || 'Error de conexión al cargar el perfil');
    } finally {
      setLoading(false);
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
      const response = await fetch(`${API_URL}/api/auth/actualizar-perfil-estudiante`, {
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
      <HeaderEstudiante />
      <div className="configuracion-container">
        <div className="configuracion-header">
          <h1>Mi Perfil</h1>
          <p>Gestiona la información de tu perfil</p>
        </div>
        <div className="configuracion-content">
          <div className="configuracion-main">
            {mensaje && <div className="success-message">{mensaje}</div>}
            {error && <div className="error-message">{error}</div>}
            <div className="config-section">
              <h2>Mi Perfil</h2>
              <form onSubmit={guardarPerfil} className="perfil-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" name="nombre" value={perfilData.nombre} onChange={handlePerfilChange} placeholder="Tu nombre" />
                  </div>
                  <div className="form-group">
                    <label>Apellido</label>
                    <input type="text" name="apellido" value={perfilData.apellido} onChange={handlePerfilChange} placeholder="Tu apellido" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email <span className="required-field">*</span></label>
                    <input type="email" name="email" value={perfilData.email} onChange={handlePerfilChange} disabled className="disabled-field" title="Este campo no se puede modificar por seguridad" />
                    <small className="field-note">Campo crítico - No editable</small>
                  </div>
                  <div className="form-group">
                    <label>Legajo <span className="required-field">*</span></label>
                    <input type="text" name="legajo" value={perfilData.legajo} onChange={handlePerfilChange} disabled className="disabled-field" title="Este campo no se puede modificar por seguridad" />
                    <small className="field-note">Campo crítico - No editable</small>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Teléfono</label>
                    <input type="tel" name="telefono" value={perfilData.telefono} onChange={handlePerfilChange} placeholder="Tu número de teléfono" />
                  </div>
                  <div className="form-group">
                    <label>Carrera</label>
                    <select name="carrera" value={perfilData.carrera} onChange={handlePerfilChange}>
                      <option value="">Selecciona tu carrera</option>
                      <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                      <option value="Ingeniería Electromecánica">Ingeniería Electromecánica</option>
                      <option value="Ingeniería Química">Ingeniería Química</option>
                      <option value="Ingeniería en Sistemas de Información">Ingeniería en Sistemas de Información</option>
                      <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                      <option value="Licenciatura en Administración Rural">Licenciatura en Administración Rural</option>
                      <option value="Tecnicatura Universitaria en Programación">Tecnicatura Universitaria en Programación</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Año de Ingreso</label>
                    <input type="number" name="añoIngreso" value={perfilData.añoIngreso} onChange={handlePerfilChange} min="2000" max="2024" placeholder="2020" />
                  </div>
                  <div className="form-group">
                    <label>Materias Aprobadas</label>
                    <input type="number" name="materias_aprobadas" value={perfilData.materias_aprobadas} onChange={handlePerfilChange} min="0" placeholder="Número de materias" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Promedio</label>
                  <input type="number" name="promedio" value={perfilData.promedio} onChange={handlePerfilChange} min="1" max="10" step="0.01" placeholder="8.50" />
                </div>
                <div className="form-group">
                  <label>Experiencia Laboral</label>
                  <textarea name="experienciaLaboral" value={perfilData.experienciaLaboral} onChange={handlePerfilChange} rows="4" placeholder="Describe tu experiencia laboral previa..." />
                </div>
                <div className="form-group">
                  <label>Habilidades y Competencias</label>
                  <textarea name="habilidades" value={perfilData.habilidades} onChange={handlePerfilChange} rows="3" placeholder="Ej: JavaScript, React, Python, Trabajo en equipo, etc." />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>LinkedIn</label>
                    <input type="url" name="linkedin" value={perfilData.linkedin} onChange={handlePerfilChange} placeholder="https://linkedin.com/in/tu-perfil" />
                  </div>
                  <div className="form-group">
                    <label>GitHub</label>
                    <input type="url" name="github" value={perfilData.github} onChange={handlePerfilChange} placeholder="https://github.com/tu-usuario" />
                  </div>
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
