import React, { useState, useEffect } from 'react';
import HeaderEmpresa from '../../Header/HeaderEmpresa';
import { API_URL, getAuthHeader } from '../../../config';
import { useAuth } from '../../../contexts/AuthContext';
import './ConfiguracionEmpresa.css';

export default function ConfiguracionEmpresa() {
  const { currentUser, setCurrentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('perfil');

  // Estados para datos del perfil
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

  // Estados para configuraciones
  const [configuraciones, setConfiguraciones] = useState({
    notificaciones: {
      email: true,
      nuevas_postulaciones: true,
      recordatorios: true,
      reportes: false
    },
    privacidad: {
      perfil_publico: true,
      mostrar_contacto: true,
      mostrar_direccion: false
    },
    preferencias: {
      auto_aprobar_postulaciones: false,
      limite_postulaciones_pasantia: 10,
      duracion_maxima_respuesta: 7
    }
  });

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
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
        
        if (data.configuraciones) {
          setConfiguraciones(data.configuraciones);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos de la empresa');
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
        body: JSON.stringify({ configuraciones })
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
      <HeaderEmpresa />
      <div className="configuracion-empresa-container">
        <div className="configuracion-header">
          <h1>Configuración de Empresa</h1>
          <p>Gestiona el perfil de tu empresa y preferencias</p>
        </div>

        <div className="configuracion-content">
          <div className="configuracion-sidebar">
            <nav className="config-nav">
              <button 
                className={activeSection === 'perfil' ? 'active' : ''}
                onClick={() => setActiveSection('perfil')}
              >
                🏢 Perfil de Empresa
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
                <h2>Perfil de la Empresa</h2>
                <form onSubmit={guardarPerfil} className="perfil-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre de la Empresa</label>
                      <input
                        type="text"
                        name="nombre"
                        value={perfilData.nombre}
                        onChange={handlePerfilChange}
                        placeholder="Nombre de la empresa"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Corporativo</label>
                      <input
                        type="email"
                        name="correo"
                        value={perfilData.correo}
                        onChange={handlePerfilChange}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Persona de Contacto</label>
                      <input
                        type="text"
                        name="personaContacto"
                        value={perfilData.personaContacto}
                        onChange={handlePerfilChange}
                        placeholder="Nombre del responsable de RR.HH."
                      />
                    </div>
                    <div className="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        name="telefono"
                        value={perfilData.telefono}
                        onChange={handlePerfilChange}
                        placeholder="Número de teléfono"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Dirección</label>
                    <input
                      type="text"
                      name="direccion"
                      value={perfilData.direccion}
                      onChange={handlePerfilChange}
                      placeholder="Dirección completa de la empresa"
                    />
                  </div>

                  <div className="form-group">
                    <label>Descripción de la Empresa</label>
                    <textarea
                      name="descripcion"
                      value={perfilData.descripcion}
                      onChange={handlePerfilChange}
                      rows="4"
                      placeholder="Describe qué hace tu empresa, su misión y valores..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Sitio Web</label>
                      <input
                        type="url"
                        name="sitioWeb"
                        value={perfilData.sitioWeb}
                        onChange={handlePerfilChange}
                        placeholder="https://www.tuempresa.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>Sector</label>
                      <select
                        name="sector"
                        value={perfilData.sector}
                        onChange={handlePerfilChange}
                      >
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
                    <select
                      name="tamaño"
                      value={perfilData.tamaño}
                      onChange={handlePerfilChange}
                    >
                      <option value="">Selecciona el tamaño</option>
                      <option value="Startup (1-10)">Startup (1-10 empleados)</option>
                      <option value="Pequeña (11-50)">Pequeña (11-50 empleados)</option>
                      <option value="Mediana (51-200)">Mediana (51-200 empleados)</option>
                      <option value="Grande (201-1000)">Grande (201-1000 empleados)</option>
                      <option value="Corporación (+1000)">Corporación (+1000 empleados)</option>
                    </select>
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
                          checked={configuraciones.notificaciones.nuevas_postulaciones}
                          onChange={(e) => handleConfigChange('notificaciones', 'nuevas_postulaciones', e.target.checked)}
                        />
                        <span className="switch"></span>
                        Nuevas postulaciones a mis pasantías
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
                        Recordatorios de fechas límite
                      </label>
                    </div>
                    
                    <div className="notification-item">
                      <label className="switch-label">
                        <input
                          type="checkbox"
                          checked={configuraciones.notificaciones.reportes}
                          onChange={(e) => handleConfigChange('notificaciones', 'reportes', e.target.checked)}
                        />
                        <span className="switch"></span>
                        Reportes semanales de actividad
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
                        Hacer mi empresa visible públicamente
                      </label>
                      <p className="privacy-description">Los estudiantes podrán ver el perfil de tu empresa</p>
                    </div>
                    
                    <div className="privacy-item">
                      <label className="switch-label">
                        <input
                          type="checkbox"
                          checked={configuraciones.privacidad.mostrar_contacto}
                          onChange={(e) => handleConfigChange('privacidad', 'mostrar_contacto', e.target.checked)}
                        />
                        <span className="switch"></span>
                        Mostrar información de contacto
                      </label>
                    </div>
                    
                    <div className="privacy-item">
                      <label className="switch-label">
                        <input
                          type="checkbox"
                          checked={configuraciones.privacidad.mostrar_direccion}
                          onChange={(e) => handleConfigChange('privacidad', 'mostrar_direccion', e.target.checked)}
                        />
                        <span className="switch"></span>
                        Mostrar dirección física
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
                <h2>Preferencias de Gestión</h2>
                <form onSubmit={guardarConfiguraciones}>
                  <div className="form-group">
                    <label className="switch-label">
                      <input
                        type="checkbox"
                        checked={configuraciones.preferencias.auto_aprobar_postulaciones}
                        onChange={(e) => handleConfigChange('preferencias', 'auto_aprobar_postulaciones', e.target.checked)}
                      />
                      <span className="switch"></span>
                      Aprobación automática de postulaciones
                    </label>
                    <p className="form-description">Las postulaciones se aprobarán automáticamente sin revisión manual</p>
                  </div>
                  
                  <div className="form-group">
                    <label>Límite de postulaciones por pasantía</label>
                    <select
                      value={configuraciones.preferencias.limite_postulaciones_pasantia}
                      onChange={(e) => handleConfigChange('preferencias', 'limite_postulaciones_pasantia', parseInt(e.target.value))}
                    >
                      <option value={5}>5 postulaciones</option>
                      <option value={10}>10 postulaciones</option>
                      <option value={20}>20 postulaciones</option>
                      <option value={50}>50 postulaciones</option>
                      <option value={0}>Sin límite</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Tiempo máximo de respuesta (días)</label>
                    <select
                      value={configuraciones.preferencias.duracion_maxima_respuesta}
                      onChange={(e) => handleConfigChange('preferencias', 'duracion_maxima_respuesta', parseInt(e.target.value))}
                    >
                      <option value={3}>3 días</option>
                      <option value={7}>7 días</option>
                      <option value={14}>14 días</option>
                      <option value={30}>30 días</option>
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
