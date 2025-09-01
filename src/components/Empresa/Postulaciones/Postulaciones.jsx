import React, { useState, useEffect } from 'react';
import HeaderEmpresa from '../../Header/HeaderEmpresa';
import { API_URL, getAuthHeader } from '../../../config';
import { useAuth } from '../../../contexts/AuthContext';
import './Postulaciones.css';

export default function Postulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(null);
  const [mostrarModalRechazar, setMostrarModalRechazar] = useState(false);
  const [postulacionARechazar, setPostulacionARechazar] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const { currentUser } = useAuth();

  useEffect(() => {
    cargarPostulaciones();
  }, []);

  const cargarPostulaciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/postulaciones/empresa`, {
        headers: getAuthHeader()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar las postulaciones');
      }
      
      const data = await response.json();
      setPostulaciones(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar las postulaciones');
    } finally {
      setLoading(false);
    }
  };

  const aceptarPostulacion = async (pasantiaId, estudianteId) => {
    setProcesando(`${pasantiaId}-${estudianteId}`);
    try {
      const response = await fetch(`${API_URL}/api/pasantias/${pasantiaId}/aceptar/${estudianteId}`, {
        method: 'PUT',
        headers: getAuthHeader()
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al aceptar la postulación');
      }

      await cargarPostulaciones();
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setProcesando(null);
    }
  };

  const confirmarRechazar = (pasantiaId, estudianteId, pasantiaTitulo, estudianteEmail) => {
    setPostulacionARechazar({
      pasantiaId,
      estudianteId,
      pasantiaTitulo,
      estudianteEmail
    });
    setMostrarModalRechazar(true);
  };

  const rechazarPostulacion = async () => {
    if (!postulacionARechazar || !motivoRechazo.trim()) {
      setError('Debe proporcionar un motivo para el rechazo');
      return;
    }

    setProcesando(`${postulacionARechazar.pasantiaId}-${postulacionARechazar.estudianteId}`);
    try {
      const response = await fetch(`${API_URL}/api/pasantias/${postulacionARechazar.pasantiaId}/rechazar/${postulacionARechazar.estudianteId}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ motivo: motivoRechazo })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al rechazar la postulación');
      }

      await cargarPostulaciones();
      setMostrarModalRechazar(false);
      setPostulacionARechazar(null);
      setMotivoRechazo('');
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setProcesando(null);
    }
  };

  const cancelarRechazo = () => {
    setMostrarModalRechazar(false);
    setPostulacionARechazar(null);
    setMotivoRechazo('');
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'estado-pendiente';
      case 'aceptada':
        return 'estado-aceptada';
      case 'rechazada':
        return 'estado-rechazada';
      default:
        return 'estado-default';
    }
  };

  const getEstadoText = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'aceptada':
        return 'Aceptada';
      case 'rechazada':
        return 'Rechazada';
      default:
        return estado;
    }
  };

  const filtrarPostulaciones = () => {
    if (filtroEstado === 'todas') return postulaciones;
    
    return postulaciones.map(pasantia => ({
      ...pasantia,
      postulaciones: pasantia.postulaciones.filter(post => post.estado === filtroEstado)
    })).filter(pasantia => pasantia.postulaciones.length > 0);
  };

  if (loading) return <div className="loading-container">Cargando...</div>;

  const postulacionesFiltradas = filtrarPostulaciones();

  return (
    <>
      <HeaderEmpresa />
      <div className="postulaciones-container">
        <div className="postulaciones-header">
          <h1>Postulaciones Recibidas</h1>
          <div className="filtros-container">
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="filtro-estado"
            >
              <option value="todas">Todas las postulaciones</option>
              <option value="pendiente">Pendientes</option>
              <option value="aceptada">Aceptadas</option>
              <option value="rechazada">Rechazadas</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {postulacionesFiltradas.length === 0 ? (
          <div className="no-postulaciones">
            <div className="no-postulaciones-icon">📋</div>
            <h2>No hay postulaciones</h2>
            <p>No tienes postulaciones {filtroEstado !== 'todas' ? `en estado "${filtroEstado}"` : 'en este momento'}.</p>
          </div>
        ) : (
          <div className="pasantias-list">
            {postulacionesFiltradas.map((pasantia) => (
              <div key={pasantia.id} className="pasantia-section">
                <div className="pasantia-info">
                  <h2>{pasantia.titulo}</h2>
                  <p className="pasantia-estado">Estado: {pasantia.estado}</p>
                </div>

                <div className="postulaciones-grid">
                  {pasantia.postulaciones.map((postulacion) => (
                    <div key={postulacion.estudianteId} className="postulacion-card">
                      <div className="postulacion-header">
                        <h3>Postulación</h3>
                        <span className={`estado-badge ${getEstadoClass(postulacion.estado)}`}>
                          {getEstadoText(postulacion.estado)}
                        </span>
                      </div>

                      <div className="estudiante-info">
                        <p><strong>Email:</strong> {postulacion.estudiante?.email || 'No disponible'}</p>
                        <p><strong>Legajo:</strong> {postulacion.estudiante?.legajo || 'No disponible'}</p>
                        <p><strong>Fecha de postulación:</strong> {new Date(postulacion.fecha).toLocaleDateString()}</p>
                        
                        {postulacion.motivoRechazo && (
                          <div className="motivo-rechazo">
                            <p><strong>Motivo del rechazo:</strong></p>
                            <p className="motivo-texto">{postulacion.motivoRechazo}</p>
                          </div>
                        )}
                      </div>

                      {postulacion.estado === 'pendiente' && (
                        <div className="postulacion-actions">
                          <button
                            onClick={() => aceptarPostulacion(pasantia.id, postulacion.estudianteId)}
                            disabled={procesando === `${pasantia.id}-${postulacion.estudianteId}`}
                            className="btn-aceptar"
                          >
                            {procesando === `${pasantia.id}-${postulacion.estudianteId}` ? 'Procesando...' : 'Aceptar'}
                          </button>
                          <button
                            onClick={() => confirmarRechazar(
                              pasantia.id, 
                              postulacion.estudianteId,
                              pasantia.titulo,
                              postulacion.estudiante?.email
                            )}
                            disabled={procesando === `${pasantia.id}-${postulacion.estudianteId}`}
                            className="btn-rechazar"
                          >
                            {procesando === `${pasantia.id}-${postulacion.estudianteId}` ? 'Procesando...' : 'Rechazar'}
                          </button>
                        </div>
                      )}

                      {postulacion.estado === 'aceptada' && (
                        <div className="postulacion-aceptada">
                          <p className="mensaje-aceptada">Postulación aceptada</p>
                        </div>
                      )}

                      {postulacion.estado === 'rechazada' && (
                        <div className="postulacion-rechazada">
                          <p className="mensaje-rechazada">Postulación rechazada</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación para rechazar */}
      {mostrarModalRechazar && postulacionARechazar && (
        <div className="modal-overlay">
          <div className="modal-content modal-rechazar">
            <div className="modal-header">
              <h2>Rechazar postulación</h2>
            </div>
            
            <div className="modal-body">
              <p>¿Estás seguro de que deseas rechazar la postulación de:</p>
              <div className="postulacion-info">
                <p><strong>Email:</strong> {postulacionARechazar.estudianteEmail}</p>
                <p><strong>Pasantía:</strong> {postulacionARechazar.pasantiaTitulo}</p>
              </div>
              
              <div className="motivo-container">
                <label htmlFor="motivo">Motivo del rechazo (requerido):</label>
                <textarea
                  id="motivo"
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  placeholder="Proporciona un motivo para el rechazo..."
                  rows="4"
                  className="motivo-textarea"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={rechazarPostulacion}
                disabled={!motivoRechazo.trim() || procesando}
                className="btn-confirmar-rechazo"
              >
                {procesando ? 'Procesando...' : 'Confirmar rechazo'}
              </button>
              <button 
                onClick={cancelarRechazo}
                className="btn-cancelar"
                disabled={procesando}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
