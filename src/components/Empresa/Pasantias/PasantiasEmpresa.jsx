import React, { useState, useEffect } from 'react';
import HeaderEmpresa from '../../Header/HeaderEmpresa';
import { API_URL, getAuthHeader } from '../../../config';
import './PasantiasEmpresa.css';

export default function PasantiasEmpresa() {
  const [formData, setFormData] = useState({
    titulo: '',
    carreraSugerida: '',
    areaSector: '',
    descripcionTareas: '',
    requisitos: '',
    duracionEstimada: '',
    cargaHorariaSemanal: '',
    horarioPropuesto: '',
    tipoJornada: '',
    modalidad: '',
    fechaInicioEstimada: '',
    fechaLimitePostulacion: '',
    observacionesAdicionales: ''
  });
  const [pasantias, setPasantias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [pasantiaExpandida, setPasantiaExpandida] = useState(null);
  const [pasantiaSeleccionada, setPasantiaSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalRetirar, setMostrarModalRetirar] = useState(false);
  const [pasantiaARetirar, setPasantiaARetirar] = useState(null);
  const [justificacionRetiro, setJustificacionRetiro] = useState('');
  const [retirando, setRetirando] = useState(false);

  useEffect(() => {
    cargarPasantias();
  }, []);

  const cargarPasantias = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${API_URL}/api/pasantias/empresa`, {
        headers: getAuthHeader()
      });
      if (!response.ok) {
        throw new Error('Error al cargar las pasantías');
      }
      const data = await response.json();
      setPasantias(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Error al cargar las pasantías');
      setPasantias([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/pasantias`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la pasantía');
      }

      setFormData({
        titulo: '',
        carreraSugerida: '',
        areaSector: '',
        descripcionTareas: '',
        requisitos: '',
        duracionEstimada: '',
        cargaHorariaSemanal: '',
        horarioPropuesto: '',
        tipoJornada: '',
        modalidad: '',
        fechaInicioEstimada: '',
        fechaLimitePostulacion: '',
        observacionesAdicionales: ''
      });

      setMostrarFormulario(false);
      cargarPasantias();
      alert('Pasantía creada exitosamente. Pendiente de revisión por SAU.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasantiaExpandida = (pasantiaId) => {
    setPasantiaExpandida(pasantiaExpandida === pasantiaId ? null : pasantiaId);
  };

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
      case 'retirada':
        return 'Retirada';
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
      case 'retirada':
        return 'estado-retirada';
      default:
        return 'estado-default';
    }
  };

  const confirmarRetirarOferta = (pasantia) => {
    setPasantiaARetirar(pasantia);
    setMostrarModalRetirar(true);
  };

  const retirarOferta = async () => {
    if (!pasantiaARetirar || !justificacionRetiro.trim()) {
      setError('Debe proporcionar una justificación para retirar la oferta');
      return;
    }

    setRetirando(true);
    try {
      const response = await fetch(`${API_URL}/api/pasantias/${pasantiaARetirar.id}/retirar`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ justificacion: justificacionRetiro })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al retirar la oferta');
      }

      await cargarPasantias();
      setMostrarModalRetirar(false);
      setPasantiaARetirar(null);
      setJustificacionRetiro('');
      setError('');
      alert('Oferta retirada exitosamente');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setRetirando(false);
    }
  };

  const cancelarRetiro = () => {
    setMostrarModalRetirar(false);
    setPasantiaARetirar(null);
    setJustificacionRetiro('');
  };

  return (
    <>
      <HeaderEmpresa />
      <div className="pasantias-empresa-container">
        <div className="pasantias-header">
          <h2>Gestión de Pasantías</h2>
          <button 
            className="btn-crear-pasantia"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? 'Cancelar' : 'Crear Nueva Pasantía'}
          </button>
        </div>

        {mostrarFormulario && (
          <section className="crear-pasantia-section">
            <h3>Nueva Oferta de Pasantía</h3>
            <form onSubmit={handleSubmit} className="crear-pasantia-form">
              <div className="form-group">
                <label htmlFor="titulo">Título de la oferta</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="carreraSugerida">Carrera sugerida</label>
                <select
                  id="carreraSugerida"
                  name="carreraSugerida"
                  value={formData.carreraSugerida}
                  onChange={handleChange}
                  required
                >
                <option value="">Selecciona una opción</option>
                <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                <option value="Ingeniería Electromecánica">Ingeniería Electromecánica</option>
                <option value="Ingeniería Química">Ingeniería Química</option>
                <option value="Ingeniería en Sistemas de Información">Ingeniería en Sistemas de Información</option>
                <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                <option value="Licenciatura en Administración Rural">Licenciatura en Administración Rural</option>
                <option value="Tecnicatura Universitaria en Programación">Tecnicatura Universitaria en Programación</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="areaSector">Área o sector</label>
                <input
                  type="text"
                  id="areaSector"
                  name="areaSector"
                  value={formData.areaSector}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcionTareas">Descripción de tareas</label>
                <textarea
                  id="descripcionTareas"
                  name="descripcionTareas"
                  value={formData.descripcionTareas}
                  onChange={handleChange}
                  required
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="requisitos">Requisitos</label>
                <textarea
                  id="requisitos"
                  name="requisitos"
                  value={formData.requisitos}
                  onChange={handleChange}
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="duracionEstimada">Duración estimada</label>
                <input
                  type="text"
                  id="duracionEstimada"
                  name="duracionEstimada"
                  value={formData.duracionEstimada}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 4 meses"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cargaHorariaSemanal">Carga horaria semanal</label>
                <input
                  type="text"
                  id="cargaHorariaSemanal"
                  name="cargaHorariaSemanal"
                  value={formData.cargaHorariaSemanal}
                  onChange={handleChange}
                  required
                  placeholder="Ej: 20 hs/semana"
                />
              </div>

              <div className="form-group">
                <label htmlFor="horarioPropuesto">Horario propuesto</label>
                <input
                  type="text"
                  id="horarioPropuesto"
                  name="horarioPropuesto"
                  value={formData.horarioPropuesto}
                  onChange={handleChange}
                  required
                  placeholder="Ej: Lunes a Viernes, 9 a 13 hs"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tipoJornada">Tipo de jornada</label>
                <select
                  id="tipoJornada"
                  name="tipoJornada"
                  value={formData.tipoJornada}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="part-time">Part-time</option>
                  <option value="flexible">Flexible</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="modalidad">Modalidad</label>
                <select
                  id="modalidad"
                  name="modalidad"
                  value={formData.modalidad}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="presencial">Presencial</option>
                  <option value="remoto">Remoto</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fechaInicioEstimada">Fecha de inicio estimada</label>
                <input
                  type="date"
                  id="fechaInicioEstimada"
                  name="fechaInicioEstimada"
                  value={formData.fechaInicioEstimada}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fechaLimitePostulacion">Fecha límite de postulación</label>
                <input
                  type="date"
                  id="fechaLimitePostulacion"
                  name="fechaLimitePostulacion"
                  value={formData.fechaLimitePostulacion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="observacionesAdicionales">Observaciones adicionales</label>
                <textarea
                  id="observacionesAdicionales"
                  name="observacionesAdicionales"
                  value={formData.observacionesAdicionales}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn-submit">
                  {loading ? 'Creando...' : 'Crear Pasantía'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setMostrarFormulario(false)} 
                  className="btn-cancel"
                >
                  Cancelar
                </button>
              </div>

              {error && <p className="error-message">{error}</p>}
            </form>
          </section>
        )}

        <section className="lista-pasantias-section">
          <h3>Mis Ofertas de Pasantía</h3>
          {pasantias.length === 0 ? (
            <p className="no-pasantias">No hay ofertas de pasantía registradas.</p>
          ) : (
            <div className="pasantias-grid">
              {pasantias.map(pasantia => (
                <div key={pasantia.id} className="pasantia-card">
                  <div className="pasantia-header">
                    <h4>{pasantia.titulo}</h4>
                    <div className={`estado-badge ${getEstadoClass(pasantia.estado)}`}>
                      {getEstadoText(pasantia.estado)}
                    </div>
                  </div>
                  
                  <div className="pasantia-preview">
                    <p className="pasantia-carrera">{pasantia.carreraSugerida}</p>
                    <p className="pasantia-area">{pasantia.areaSector}</p>
                    <p className="pasantia-modalidad">{pasantia.modalidad}</p>
                    <p className="pasantia-duracion">{pasantia.duracionEstimada}</p>
                    <p className="pasantia-fecha">Límite: {new Date(pasantia.fechaLimitePostulacion).toLocaleDateString()}</p>
                    <p className="pasantia-descripcion-preview">
                      {pasantia.descripcionTareas ? 
                        (pasantia.descripcionTareas.length > 100 ? 
                          `${pasantia.descripcionTareas.substring(0, 100)}...` : 
                          pasantia.descripcionTareas
                        ) : 
                        'Sin descripción disponible'
                      }
                    </p>
                  </div>

                  <div className="pasantia-actions">
                    <button 
                      className="btn-ver-detalle"
                      onClick={() => abrirModalDetalle(pasantia)}
                    >
                      Ver detalle
                    </button>
                    {(pasantia.estado === 'oferta' || pasantia.estado === 'pendiente_sau') && (
                      <button
                        className="btn-retirar-oferta"
                        onClick={() => confirmarRetirarOferta(pasantia)}
                        disabled={retirando}
                      >
                        {retirando ? 'Retirando...' : 'Retirar oferta'}
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
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
                    <span className="detalle-label">Estado:</span>
                    <span className={`detalle-valor estado-badge ${getEstadoClass(pasantiaSeleccionada.estado)}`}>
                      {getEstadoText(pasantiaSeleccionada.estado)}
                    </span>
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

              {pasantiaSeleccionada.estado === 'rechazada' && pasantiaSeleccionada.motivoRechazo && (
                <div className="detalle-seccion rechazo-info">
                  <h3>Motivo del Rechazo</h3>
                  <p className="detalle-texto">{pasantiaSeleccionada.motivoRechazo}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-editar" onClick={() => {
                // Aquí iría la lógica para editar
                alert('Funcionalidad de edición en desarrollo');
              }}>
                Editar Pasantía
              </button>
              {(pasantiaSeleccionada.estado === 'oferta' || pasantiaSeleccionada.estado === 'pendiente_sau') && (
                <button
                  className="btn-retirar-oferta"
                  onClick={() => {
                    cerrarModal();
                    confirmarRetirarOferta(pasantiaSeleccionada);
                  }}
                  disabled={retirando}
                >
                  {retirando ? 'Retirando...' : 'Retirar oferta'}
                </button>
              )}
              <button className="btn-cerrar" onClick={cerrarModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para retirar oferta */}
      {mostrarModalRetirar && pasantiaARetirar && (
        <div className="modal-overlay">
          <div className="modal-content modal-retirar">
            <div className="modal-header">
              <h2>Retirar oferta de pasantía</h2>
            </div>
            
            <div className="modal-body">
              <p>¿Estás seguro de que deseas retirar la siguiente oferta de pasantía?</p>
              <div className="oferta-info">
                <h3>{pasantiaARetirar.titulo}</h3>
                <p><strong>Carrera:</strong> {pasantiaARetirar.carreraSugerida}</p>
                <p><strong>Área:</strong> {pasantiaARetirar.areaSector}</p>
                <p><strong>Estado actual:</strong> {getEstadoText(pasantiaARetirar.estado)}</p>
              </div>
              
              <div className="justificacion-container">
                <label htmlFor="justificacion">Justificación (requerida):</label>
                <textarea
                  id="justificacion"
                  value={justificacionRetiro}
                  onChange={(e) => setJustificacionRetiro(e.target.value)}
                  placeholder="Proporciona una justificación para el retiro de la oferta..."
                  rows="4"
                  className="justificacion-textarea"
                />
              </div>
              <p className="advertencia">Esta acción notificará a todos los estudiantes que se postularon y no se puede deshacer.</p>
            </div>

            <div className="modal-footer">
              <button 
                onClick={retirarOferta}
                disabled={!justificacionRetiro.trim() || retirando}
                className="btn-confirmar-retiro"
              >
                {retirando ? 'Retirando...' : 'Confirmar retiro'}
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
