import React, { useState, useEffect } from 'react';
import HeaderEstudiante from '../../Header/HeaderEstudiante';
import { API_URL, getAuthHeader } from '../../../config';
import { useAuth } from '../../../contexts/AuthContext';
import './PasantiasEstudiante.css';

export default function PasantiasEstudiante() {
  const [pasantias, setPasantias] = useState([]);
  const [pasantiasFiltradas, setPasantiasFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postulando, setPostulando] = useState(null);
  const [notificacionActiva, setNotificacionActiva] = useState(false);
  const [pasantiaSeleccionada, setPasantiaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const { currentUser } = useAuth();
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    carrera: '',
    modalidad: '',
    tipoJornada: '',
    duracionEstimada: '',
    horarioPropuesto: '',
    fechaInicio: '',
    empresa: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarPasantias();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, pasantias]);

  const cargarPasantias = async () => {
    try {
      const response = await fetch(`${API_URL}/api/pasantias`, {
        headers: getAuthHeader()
      });
      const data = await response.json();
      setPasantias(data);
      setPasantiasFiltradas(data);
    } catch (error) {
      setError('Error al cargar las pasantías');
    } finally {
      setLoading(false);
    }
  };

  const handlePostular = async (pasantiaId) => {
    setPostulando(pasantiaId);
    try {
      const response = await fetch(`${API_URL}/api/postulaciones`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ pasantiaId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al postular');
      }

      // Notificar éxito
      setError('');
      cargarPasantias(); // Recargar para actualizar estados
    } catch (error) {
      setError(error.message);
    } finally {
      setPostulando(null);
    }
  };

  const abrirModalDetalle = (pasantia) => {
    setPasantiaSeleccionada(pasantia);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPasantiaSeleccionada(null);
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const aplicarFiltros = () => {
    let pasantiasFiltradas = [...pasantias];
    
    // Aplicar cada filtro si tiene valor
    if (filtros.carrera) {
      pasantiasFiltradas = pasantiasFiltradas.filter(p => 
        p.carreraSugerida?.toLowerCase().includes(filtros.carrera.toLowerCase())
      );
    }
    
    if (filtros.modalidad) {
      pasantiasFiltradas = pasantiasFiltradas.filter(p => 
        p.modalidad?.toLowerCase() === filtros.modalidad.toLowerCase()
      );
    }
    
    if (filtros.tipoJornada) {
      pasantiasFiltradas = pasantiasFiltradas.filter(p => 
        p.tipoJornada?.toLowerCase() === filtros.tipoJornada.toLowerCase()
      );
    }
    
    if (filtros.duracionEstimada) {
      pasantiasFiltradas = pasantiasFiltradas.filter(p => 
        p.duracionEstimada?.toLowerCase().includes(filtros.duracionEstimada.toLowerCase())
      );
    }
    
    if (filtros.horarioPropuesto) {
      pasantiasFiltradas = pasantiasFiltradas.filter(p => 
        p.horarioPropuesto?.toLowerCase().includes(filtros.horarioPropuesto.toLowerCase())
      );
    }
    
    if (filtros.empresa) {
      pasantiasFiltradas = pasantiasFiltradas.filter(p => 
        p.empresaNombre?.toLowerCase().includes(filtros.empresa.toLowerCase())
      );
    }
    
    setPasantiasFiltradas(pasantiasFiltradas);
  };

  const limpiarFiltros = () => {
    setFiltros({
      carrera: '',
      modalidad: '',
      tipoJornada: '',
      duracionEstimada: '',
      horarioPropuesto: '',
      fechaInicio: '',
      empresa: ''
    });
  };

  const activarNotificaciones = () => {
    setNotificacionActiva(true);
    // Aquí se implementaría la lógica para activar notificaciones
  };

  if (loading) return <div className="loading-container">Cargando...</div>;

  return (
    <>
      <HeaderEstudiante />
      <div className="pasantias-estudiante-container">
        <div className="pasantias-header">
          <h1>Pasantías Disponibles</h1>
          <button 
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="filtros-toggle-btn"
          >
            {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </button>
        </div>

        {mostrarFiltros && (
          <div className="filtros-seccion">
            <div className="filtros-grid">
              <div className="filtro-grupo">
                <label>Carrera:</label>
                <input 
                  type="text" 
                  name="carrera" 
                  value={filtros.carrera} 
                  onChange={handleFiltroChange} 
                  placeholder="Ingeniería..."
                />
              </div>
              
              <div className="filtro-grupo">
                <label>Modalidad:</label>
                <select 
                  name="modalidad" 
                  value={filtros.modalidad} 
                  onChange={handleFiltroChange}
                >
                  <option value="">Todas</option>
                  <option value="presencial">Presencial</option>
                  <option value="remoto">Remoto</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>
              
              <div className="filtro-grupo">
                <label>Tipo de Jornada:</label>
                <select 
                  name="tipoJornada" 
                  value={filtros.tipoJornada} 
                  onChange={handleFiltroChange}
                >
                  <option value="">Todas</option>
                  <option value="part-time">Part-time</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              
              <div className="filtro-grupo">
                <label>Duración Estimada:</label>
                <select 
                  name="duracionEstimada" 
                  value={filtros.duracionEstimada} 
                  onChange={handleFiltroChange}
                >
                  <option value="">Todas</option>
                  <option value="3 meses">3 meses</option>
                  <option value="6 meses">6 meses</option>
                  <option value="12 meses">12 meses</option>
                </select>
              </div>
              
              <div className="filtro-grupo">
                <label>Horario Propuesto:</label>
                <select 
                  name="horarioPropuesto" 
                  value={filtros.horarioPropuesto} 
                  onChange={handleFiltroChange}
                >
                  <option value="">Todos</option>
                  <option value="mañana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              
              <div className="filtro-grupo">
                <label>Empresa:</label>
                <input 
                  type="text" 
                  name="empresa" 
                  value={filtros.empresa} 
                  onChange={handleFiltroChange} 
                  placeholder="Nombre de la empresa"
                />
              </div>
            </div>
            
            <div className="filtros-acciones">
              <button onClick={limpiarFiltros} className="limpiar-filtros-btn">
                Limpiar Filtros
              </button>
            </div>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        {/* Mensaje cuando no hay pasantías disponibles */}
        {pasantiasFiltradas.length === 0 && !loading && (
          <div className="no-pasantias">
            <p>No hay pasantías disponibles con los criterios seleccionados.</p>
            {!notificacionActiva && (
              <button onClick={activarNotificaciones} className="notificacion-btn">
                Recibir notificaciones cuando haya nuevas ofertas
              </button>
            )}
            {notificacionActiva && (
              <p className="notificacion-activa">¡Te notificaremos cuando haya nuevas ofertas!</p>
            )}
          </div>
        )}
        
        {/* Grid de pasantías */}
        <div className="pasantias-grid">
          {pasantiasFiltradas.map(pasantia => (
            <div key={pasantia.id} className="pasantia-card">
              <div className="pasantia-header">
                <h3>{pasantia.titulo}</h3>
                <p className="empresa">{pasantia.empresaNombre}</p>
              </div>
              
              <div className="pasantia-preview">
                <p className="descripcion">
                  {pasantia.descripcionTareas ? 
                    (pasantia.descripcionTareas.length > 150 ? 
                      `${pasantia.descripcionTareas.substring(0, 150)}...` : 
                      pasantia.descripcionTareas
                    ) : 
                    'Sin descripción disponible'
                  }
                </p>
                <div className="pasantia-details">
                  <p><strong>Carrera:</strong> {pasantia.carreraSugerida}</p>
                  <p><strong>Modalidad:</strong> {pasantia.modalidad}</p>
                  <p><strong>Duración:</strong> {pasantia.duracionEstimada}</p>
                  <p><strong>Fecha Límite:</strong> {new Date(pasantia.fechaLimitePostulacion).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="pasantia-actions">
                <button
                  className="btn-ver-detalle"
                  onClick={() => abrirModalDetalle(pasantia)}
                >
                  Ver detalle
                </button>
                <button
                  onClick={() => handlePostular(pasantia.id)}
                  disabled={postulando === pasantia.id || pasantia.postulaciones?.some(p => p.estudianteId === currentUser.id)}
                  className="postular-btn"
                >
                  {postulando === pasantia.id ? 'Postulando...' :
                   pasantia.postulaciones?.some(p => p.estudianteId === currentUser.id) ? 'Ya Postulado' :
                   'Postularme'}
                </button>
              </div>
            </div>
          ))}
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

            <div className="modal-footer">
              <button 
                className="btn-postular-modal"
                onClick={() => {
                  handlePostular(pasantiaSeleccionada.id);
                  cerrarModal();
                }}
                disabled={postulando === pasantiaSeleccionada.id || pasantiaSeleccionada.postulaciones?.some(p => p.estudianteId === currentUser.id)}
              >
                {postulando === pasantiaSeleccionada.id ? 'Postulando...' :
                 pasantiaSeleccionada.postulaciones?.some(p => p.estudianteId === currentUser.id) ? 'Ya Postulado' :
                 'Postularme'}
              </button>
              <button className="btn-cerrar" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}