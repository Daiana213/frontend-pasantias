import React, { useState, useEffect } from 'react';
import HeaderEstudiante from '../../Header/HeaderEstudiante';
import { API_URL, getAuthHeader } from '../../../config';
import { useAuth } from '../../../contexts/AuthContext';
import './ConfiguracionEstudiante.css';

export default function ConfiguracionEstudiante() {
  const { currentUser, setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('perfil');

  // Estados para datos del perfil
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

  // Estados para configuraciones
  const [configuraciones, setConfiguraciones] = useState({
    notificaciones: {
      email: true,
      nuevas_pasantias: true,
      actualizaciones_postulacion: true,
      recordatorios: true
    },
    privacidad: {
      perfil_publico: false,
      mostrar_email: false,
      mostrar_telefono: false
    },
    preferencias: {
      modalidad_preferida: '',
      tipo_jornada_preferida: '',
      areas_interes: []
    }
  });

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/perfil-estudiante`, {
        headers: getAuthHeader()
      });
      
      if (response.ok) {
        const data = await response.json();
        setPerfilData({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          email: data.email || '',
          legajo: data.legajo || '',
          telefono: data.telefono || '',
          carrera: data.carrera || '',
          añoIngreso: data.añoIngreso || '',
          materias_aprobadas: data.materias_aprobadas || '',
          promedio: data.promedio || '',
          experienciaLaboral: data.experienciaLaboral || '',
          habilidades: data.habilidades || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          cv_url: data.cv_url || ''
        });
        
        if (data.configuraciones) {
          setConfiguraciones(data.configuraciones);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos del usuario');
    }
  };

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setPerfilData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfigChange = (section, key, value) => {
    setConfiguraciones(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
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
    } catch (error) {
      setError('Error de conexión al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const guardarConfiguraciones = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMensaje('');

    try {
      const response = await fetch(`${API_URL}/api/auth/actualizar-configuraciones`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(configuraciones)
      });

      if (response.ok) {
        setMensaje('Configuraciones guardadas correctamente');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al guardar configuraciones');
      }
    } catch (error) {
      setError('Error de conexión al guardar configuraciones');
    } finally {
      setLoading(false);
    }
  };

  const cambiarContraseña = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMensaje('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Las contraseñas nuevas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/cambiar-password`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({
          currentPassword: passwordData.current_password,
          newPassword: passwordData.new_password
        })
      });

      if (response.ok) {
        setMensaje('Contraseña cambiada correctamente');
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      setError('Error de conexión al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderEstudiante />
      <div className="configuracion-container">
        <div className="configuracion-header">
          <h1>Configuración de Cuenta</h1>
          <p>Gestiona tu perfil y preferencias</p>
        </div>

        <div className="configuracion-content">
          <div className="configuracion-sidebar">
            <nav className="config-nav">
              <button 
                className={activeSection === 'perfil' ? 'active' : ''}
                onClick={() => setActiveSection('perfil')}
              >
                👤 Mi Perfil
              </button>
              <button 
                className={activeSection === 'notificaciones' ? 'active' : ''}
                onClick={() => setActiveSection('notificaciones')}
              >
                🔔 Notificaciones
              </button>
              <button 
                className={activeSection === 'privacidad' ? 'active' : ''}
                onClick={() => setActiveSection('privacidad')}
              >
                🔒 Privacidad
              </button>
              <button 
                className={activeSection === 'preferencias' ? 'active' : ''}
                onClick={() => setActiveSection('preferencias')}
              >
                ⚙️ Preferencias
              </button>
              <button 
                className={activeSection === 'seguridad' ? 'active' : ''}
                onClick={() => setActiveSection('seguridad')}
              >
                🛡️ Seguridad
              </button>
            </nav>
          </div>

          <div className="configuracion-main">
            {mensaje && <div className="success-message">{mensaje}</div>}
            {error && <div className="error-message">{error}</div>}

            {activeSection === 'perfil' && (
              <div className="config-section">
                <h2>Mi Perfil</h2>
                <form onSubmit={guardarPerfil} className="perfil-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={perfilData.nombre}
                        onChange={handlePerfilChange}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="form-group">
                      <label>Apellido</label>
                      <input
                        type="text"
                        name="apellido"
                        value={perfilData.apellido}
                        onChange={handlePerfilChange}
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={perfilData.email}
                        onChange={handlePerfilChange}
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label>Legajo</label>
                      <input
                        type="text"
                        name="legajo"
                        value={perfilData.legajo}
                        onChange={handlePerfilChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        name="telefono"
                        value={perfilData.telefono}
                        onChange={handlePerfilChange}
                        placeholder="Tu número de teléfono"
                      />
                    </div>
                    <div className="form-group">
                      <label>Carrera</label>
                      <select
                        name="carrera"
                        value={perfilData.carrera}
                        onChange={handlePerfilChange}
                      >
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
                      <input
                        type="number"
                        name="añoIngreso"
                        value={perfilData.añoIngreso}
                        onChange={handlePerfilChange}
                        min="2000"
                        max="2024"
                        placeholder="2020"
                      />
                    </div>
                    <div className="form-group">
                      <label>Materias Aprobadas</label>
                      <input
                        type="number"
                        name="materias_aprobadas"
                        value={perfilData.materias_aprobadas}
                        onChange={handlePerfilChange}
                        min="0"
                        placeholder="Número de materias"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Promedio</label>
                    <input
                      type="number"
                      name="promedio"
                      value={perfilData.promedio}
                      onChange={handlePerfilChange}
                      min="1"
                      max="10"
                      step="0.01"
                      placeholder="8.50"
                    />
                  </div>

                  <div className="form-group">
                    <label>Experiencia Laboral</label>
                    <textarea
                      name="experienciaLaboral"
                      value={perfilData.experienciaLaboral}
                      onChange={handlePerfilChange}
                      rows="4"
                      placeholder="Describe tu experiencia laboral previa..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Habilidades y Competencias</label>
                    <textarea
                      name="habilidades"
                      value={perfilData.habilidades}
                      onChange={handlePerfilChange}
                      rows="3"
                      placeholder="Ej: JavaScript, React, Python, Trabajo en equipo, etc."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>LinkedIn</label>
                      <input
                        type="url"
                        name="linkedin"
                        value={perfilData.linkedin}
                        onChange={handlePerfilChange}
                        placeholder="https://linkedin.com/in/tu-perfil"
                      />
                    </div>
                    <div className="form-group">
                      <label>GitHub</label>
                      <input
                        type="url"
                        name="github"
                        value={perfilData.github}
                        onChange={handlePerfilChange}
                        placeholder="https://github.com/tu-usuario"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-save">
                      {loading ? 'Guardando...' : 'Guardar Perfil'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'notificaciones' && (
              <div className="config-section">
                <h2>Configuración de Notificaciones</h2>
                <form onSubmit={guardarConfiguraciones}>
                  <div className="notification-options">
                    <div className="notification-item">
                      <label className="switch-label">
                        <input
                          type="checkbox"
                          checked={configuraciones.notificaciones.email}
                          onChange={(e) => handleConfigChange('notificaciones', 'email', e.target.checked)}
                        />
                        <span className="switch"></span>
                        Recibir notificaciones por email
                      </label>
                    </div>
                    
                    <div className="notification-item">
                      <label className="switch-label">
                        <input
                          type="checkbox"
                          checked={configuraciones.notificaciones.nuevas_pasantias}
                          onChange={(e) => handleConfigChange('notificaciones', 'nuevas_pasantias', e.target.checked)}
                        />
                        <span className="switch"></span>
                        Nuevas pasantías disponibles
                      </label>
                    </div>
                    
                    <div className="notification-item">
                      <label className="switch-label">
                        <input
                          type="checkbox"
                          checked={configuraciones.notificaciones.actualizaciones_postulacion}
                          onChange={(e) => handleConfigChange('notificaciones', 'actualizaciones_postulacion', e.target.checked)}
                        />
                        <span className="switch"></span>
                        Actualizaciones de mis postulaciones
                      </label>
                    </div>
                    
                    <div className="notification-item">
                      <label className="switch-label">
                        <input
                          type="checkbox"
                          checked={configuraciones.notificaciones.recordatorios}
                          onChange={(e) => handleConfigChange('notificaciones', 'recordatorios', e.target.checked)}
                        />
                        <span className="switch"></span>
                        Recordatorios importantes
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-save">
                      {loading ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'privacidad' && (
              <div className="config-section">
                <h2>Configuración de Privacidad</h2>
                <form onSubmit={guardarConfiguraciones}>
                  <div className="privacy-options">
                    <div className="privacy-item">
                      <label className="switch-label">
                        <input
                          type="checkbox"
                          checked={configuraciones.privacidad.perfil_publico}
                          onChange={(e) => handleConfigChange('privacidad', 'perfil_publico', e.target.checked)}
                        />
                        <span className="switch"></span>
                        Hacer mi perfil visible para empresas
                      </label>
                      <p className="privacy-description">Las empresas podrán ver tu perfil y contactarte directamente</p>
                    </div>
                    
                    <div className="privacy-item">
                      <label className="switch-label">
                        <input
                          type="checkbox"
                          checked={configuraciones.privacidad.mostrar_email}
                          onChange={(e) => handleConfigChange('privacidad', 'mostrar_email', e.target.checked)}
                        />
                        <span className="switch"></span>
                        Mostrar mi email en el perfil público
                      </label>
                    </div>
                    
                    <div className="privacy-item">
                      <label className="switch-label">
                        <input
                          type="checkbox"
                          checked={configuraciones.privacidad.mostrar_telefono}
                          onChange={(e) => handleConfigChange('privacidad', 'mostrar_telefono', e.target.checked)}
                        />
                        <span className="switch"></span>
                        Mostrar mi teléfono en el perfil público
                      </label>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-save">
                      {loading ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'preferencias' && (
              <div className="config-section">
                <h2>Preferencias de Búsqueda</h2>
                <form onSubmit={guardarConfiguraciones}>
                  <div className="form-group">
                    <label>Modalidad Preferida</label>
                    <select
                      value={configuraciones.preferencias.modalidad_preferida}
                      onChange={(e) => handleConfigChange('preferencias', 'modalidad_preferida', e.target.value)}
                    >
                      <option value="">Sin preferencia</option>
                      <option value="presencial">Presencial</option>
                      <option value="remota">Remota</option>
                      <option value="hibrida">Híbrida</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Tipo de Jornada Preferida</label>
                    <select
                      value={configuraciones.preferencias.tipo_jornada_preferida}
                      onChange={(e) => handleConfigChange('preferencias', 'tipo_jornada_preferida', e.target.value)}
                    >
                      <option value="">Sin preferencia</option>
                      <option value="part-time">Part-time</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-save">
                      {loading ? 'Guardando...' : 'Guardar Preferencias'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'seguridad' && (
              <div className="config-section">
                <h2>Cambiar Contraseña</h2>
                <form onSubmit={cambiarContraseña}>
                  <div className="form-group">
                    <label>Contraseña Actual</label>
                    <input
                      type="password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Nueva Contraseña</label>
                    <input
                      type="password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      minLength="6"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      minLength="6"
                      required
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-save">
                      {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
