import { useState, useEffect } from 'react';
import './InicioEstudiante.css';
import { API_URL, getAuthHeader } from '../../../config';
import { useAuth } from '../../../contexts/AuthContext';
import HeaderEstudiante from '../../Header/HeaderEstudiante';

export default function InicioEstudiante() {
  const { currentUser } = useAuth();
  const [pasantias, setPasantias] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pasantiaSeleccionada, setPasantiaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // Cargar pasantías disponibles
        const resPasantias = await fetch(`${API_URL}/api/pasantias`, {
          headers: getAuthHeader()
        });
        const dataPasantias = await resPasantias.json();
        setPasantias(dataPasantias);

        // Cargar postulaciones del estudiante
        const resPostulaciones = await fetch(`${API_URL}/api/postulaciones/mis-postulaciones`, {
          headers: getAuthHeader()
        });
        if (resPostulaciones.ok) {
          const dataPostulaciones = await resPostulaciones.json();
          setPostulaciones(dataPostulaciones);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const abrirModalDetalle = (pasantia) => {
    setPasantiaSeleccionada(pasantia);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPasantiaSeleccionada(null);
  };

  const getEstadoText = (estado) => {
    switch (estado) {
      case 'pendiente_sau':
        return 'Pendiente de revisión';
      case 'oferta':
        return 'Publicada';
      case 'rechazada':
        return 'Rechazada';
      default:
        return estado;
    }
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'pendiente_sau':
        return 'estado-pendiente';
      case 'oferta':
        return 'estado-publicada';
      case 'rechazada':
        return 'estado-rechazada';
      default:
        return 'estado-default';
    }
  };

  if (loading) return <div className="loading-container">Cargando...</div>;

  return (
    <>
      <HeaderEstudiante />
      <div className="inicio-estudiante-container">
        <div className="inicio-header">
          <h1 className="inicio-titulo">Bienvenido, {currentUser?.nombre || currentUser?.email}</h1>
          <p className="inicio-subtitulo">Sistema de Pasantías UTN</p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon pasantias-icon">📋</div>
            <div className="card-content">
              <h2>{pasantias.length}</h2>
              <p>Pasantías disponibles</p>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon postulaciones-icon">📝</div>
            <div className="card-content">
              <h2>{postulaciones.length}</h2>
              <p>Mis postulaciones</p>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="inicio-secciones">
          <section className="inicio-seccion">
            <h2>Pasantías recientes</h2>
            <div className="pasantias-recientes">
              {pasantias.length > 0 ? (
                pasantias.slice(0, 3).map((pasantia, index) => (
                  <div key={pasantia.id || `pasantia-${index}`} className="pasantia-card-mini">
                    <h3>{pasantia.titulo}</h3>
                    <p className="empresa-nombre">{pasantia.empresaNombre}</p>
                    <p className="pasantia-descripcion">{pasantia.descripcionTareas?.substring(0, 100)}...</p>
                    <div className="pasantia-footer">
                      <span className="pasantia-modalidad">{pasantia.modalidad}</span>
                      <span className="pasantia-fecha">Hasta: {new Date(pasantia.fechaLimitePostulacion).toLocaleDateString()}</span>
                    </div>
                    <button 
                      className="btn-ver-detalle"
                      onClick={() => abrirModalDetalle(pasantia)}
                    >
                      Ver detalle
                    </button>
                  </div>
                ))
              ) : (
                <p className="no-data">No hay pasantías disponibles actualmente.</p>
              )}
            </div>
            <a href="/pasantias" className="ver-mas-link">Ver todas las pasantías</a>
          </section>

          <section className="inicio-seccion">
            <h2>Mis postulaciones recientes</h2>
            <div className="postulaciones-recientes">
              {postulaciones.length > 0 ? (
                postulaciones.slice(0, 3).map((postulacion, index) => (
                  <div key={postulacion.id || `postulacion-${index}`} className="postulacion-card-mini">
                    <h3>{postulacion.pasantiaTitulo}</h3>
                    <div className="postulacion-estado">
                      <span className={`estado-badge ${postulacion.estado}`}>{postulacion.estado}</span>
                      <span className="postulacion-fecha">{new Date(postulacion.fecha).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No tienes postulaciones activas.</p>
              )}
            </div>
            <a href="/mis-postulaciones" className="ver-mas-link">Ver todas mis postulaciones</a>
          </section>
        </div>
      </div>

      {/* Modal de Detalle de Pasantía */}
      {mostrarModal && pasantiaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{pasantiaSeleccionada.titulo}</h2>
              <button className="modal-close" onClick={cerrarModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detalle-seccion">
                <h3>Información General</h3>
                <div className="detalle-grid">
                  <div className="detalle-item">
                    <span className="detalle-label">Empresa:</span>
                    <span className="detalle-valor">{pasantiaSeleccionada.empresaNombre}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Carrera sugerida:</span>
                    <span className="detalle-valor">{pasantiaSeleccionada.carreraSugerida}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Área/Sector:</span>
                    <span className="detalle-valor">{pasantiaSeleccionada.areaSector}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Modalidad:</span>
                    <span className="detalle-valor">{pasantiaSeleccionada.modalidad}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Duración:</span>
                    <span className="detalle-valor">{pasantiaSeleccionada.duracionEstimada}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Carga horaria:</span>
                    <span className="detalle-valor">{pasantiaSeleccionada.cargaHorariaSemanal}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Horario:</span>
                    <span className="detalle-valor">{pasantiaSeleccionada.horarioPropuesto}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Tipo de jornada:</span>
                    <span className="detalle-valor">{pasantiaSeleccionada.tipoJornada}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Fecha de inicio:</span>
                    <span className="detalle-valor">
                      {pasantiaSeleccionada.fechaInicioEstimada ? 
                        new Date(pasantiaSeleccionada.fechaInicioEstimada).toLocaleDateString() : 
                        'No especificada'
                      }
                    </span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">Fecha límite:</span>
                    <span className="detalle-valor">
                      {new Date(pasantiaSeleccionada.fechaLimitePostulacion).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detalle-seccion">
                <h3>Descripción de Tareas</h3>
                <p className="detalle-texto">{pasantiaSeleccionada.descripcionTareas || 'No disponible'}</p>
              </div>

              <div className="detalle-seccion">
                <h3>Requisitos</h3>
                <p className="detalle-texto">{pasantiaSeleccionada.requisitos || 'No disponible'}</p>
              </div>

              {pasantiaSeleccionada.observacionesAdicionales && (
                <div className="detalle-seccion">
                  <h3>Observaciones Adicionales</h3>
                  <p className="detalle-texto">{pasantiaSeleccionada.observacionesAdicionales}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}