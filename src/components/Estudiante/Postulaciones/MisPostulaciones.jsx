import React, { useState, useEffect } from 'react';
import HeaderEstudiante from '../../Header/HeaderEstudiante';
import { API_URL, getAuthHeader } from '../../../config';
import { useAuth } from '../../../contexts/AuthContext';
import './MisPostulaciones.css';

export default function MisPostulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retirando, setRetirando] = useState(null);
  const [mostrarModalConfirmar, setMostrarModalConfirmar] = useState(false);
  const [postulacionARetirar, setPostulacionARetirar] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    cargarPostulaciones();
  }, []);

  const cargarPostulaciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/postulaciones/mis-postulaciones`, {
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

  const confirmarRetirarPostulacion = (postulacion) => {
    setPostulacionARetirar(postulacion);
    setMostrarModalConfirmar(true);
  };

  const retirarPostulacion = async () => {
    if (!postulacionARetirar) return;
    
    setRetirando(postulacionARetirar.pasantia.id);
    try {
      const response = await fetch(`${API_URL}/api/postulaciones/${postulacionARetirar.pasantia.id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al retirar la postulación');
      }

      // Actualizar la lista de postulaciones
      await cargarPostulaciones();
      setError('');
      setMostrarModalConfirmar(false);
      setPostulacionARetirar(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setRetirando(null);
    }
  };

  const cancelarRetiro = () => {
    setMostrarModalConfirmar(false);
    setPostulacionARetirar(null);
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

  if (loading) return <div className="loading-container">Cargando...</div>;

  return (
    <>
      <HeaderEstudiante />
      <div className="mis-postulaciones-container">
        <div className="mis-postulaciones-header">
          <h1>Mis Postulaciones</h1>
          <p>Aquí puedes ver el estado de todas tus postulaciones</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {postulaciones.length === 0 ? (
          <div className="no-postulaciones">
            <div className="no-postulaciones-icon">📝</div>
            <h2>No tienes postulaciones</h2>
            <p>Aún no te has postulado a ninguna pasantía.</p>
            <a href="/pasantias" className="btn-explorar">
              Explorar pasantías
            </a>
          </div>
        ) : (
          <div className="postulaciones-grid">
            {postulaciones.map((postulacion) => (
              <div key={postulacion.pasantia.id} className="postulacion-card">
                <div className="postulacion-header">
                  <h3>{postulacion.pasantia.titulo}</h3>
                  <span className={`estado-badge ${getEstadoClass(postulacion.estado)}`}>
                    {getEstadoText(postulacion.estado)}
                  </span>
                </div>

                <div className="postulacion-details">
                  <p><strong>Empresa:</strong> {postulacion.pasantia.empresa}</p>
                  <p><strong>Fecha de postulación:</strong> {new Date(postulacion.fecha).toLocaleDateString()}</p>
                  <p><strong>Estado de la pasantía:</strong> {postulacion.pasantia.estado}</p>
                  
                  {postulacion.motivoRechazo && (
                    <div className="motivo-rechazo">
                      <p><strong>Motivo del rechazo:</strong></p>
                      <p className="motivo-texto">{postulacion.motivoRechazo}</p>
                    </div>
                  )}
                </div>

                <div className="postulacion-actions">
                  {postulacion.estado === 'pendiente' && (
                    <button
                      onClick={() => confirmarRetirarPostulacion(postulacion)}
                      disabled={retirando === postulacion.pasantia.id}
                      className="btn-retirar"
                    >
                      {retirando === postulacion.pasantia.id ? 'Retirando...' : 'Retirar postulación'}
                    </button>
                  )}
                  
                  {postulacion.estado === 'aceptada' && (
                    <div className="postulacion-aceptada">
                      <p className="mensaje-felicitaciones">¡Felicitaciones! Tu postulación fue aceptada.</p>
                    </div>
                  )}
                  
                  {postulacion.estado === 'rechazada' && (
                    <div className="postulacion-rechazada">
                      <p className="mensaje-rechazo">Esta postulación no fue seleccionada.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      {mostrarModalConfirmar && postulacionARetirar && (
        <div className="modal-overlay">
          <div className="modal-content modal-confirmar">
            <div className="modal-header">
              <h2>Confirmar retiro de postulación</h2>
            </div>
            
            <div className="modal-body">
              <p>¿Estás seguro de que deseas retirar tu postulación a:</p>
              <div className="postulacion-confirmar">
                <h3>{postulacionARetirar.pasantia.titulo}</h3>
                <p><strong>Empresa:</strong> {postulacionARetirar.pasantia.empresa}</p>
              </div>
              <p className="advertencia">Esta acción no se puede deshacer.</p>
            </div>

            <div className="modal-footer">
              <button 
                onClick={retirarPostulacion}
                disabled={retirando}
                className="btn-confirmar"
              >
                {retirando ? 'Retirando...' : 'Sí, retirar postulación'}
              </button>
              <button 
                onClick={cancelarRetiro}
                className="btn-cancelar"
                disabled={retirando}
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
