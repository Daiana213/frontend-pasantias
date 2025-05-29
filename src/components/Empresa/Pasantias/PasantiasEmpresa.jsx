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

  useEffect(() => {
    cargarPasantias();
  }, []);

  const cargarPasantias = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${API_URL}/api/pasantias`, {
        headers: getAuthHeader(token)
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
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
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
                  <h4>{pasantia.titulo}</h4>
                  <div className={`estado-badge ${pasantia.estado}`}>
                    {pasantia.estado === 'pendiente_sau' ? 'Pendiente de revisión' :
                     pasantia.estado === 'oferta' ? 'Publicada' :
                     pasantia.estado === 'rechazada' ? 'Rechazada' : pasantia.estado}
                  </div>
                  <div className="pasantia-details">
                    <p><strong>Carrera:</strong> {pasantia.carreraSugerida}</p>
                    <p><strong>Área:</strong> {pasantia.areaSector}</p>
                    <p><strong>Modalidad:</strong> {pasantia.modalidad}</p>
                    <p><strong>Duración:</strong> {pasantia.duracionEstimada}</p>
                    <p><strong>Fecha límite:</strong> {new Date(pasantia.fechaLimitePostulacion).toLocaleDateString()}</p>
                  </div>
                  {pasantia.estado === 'rechazada' && pasantia.motivoRechazo && (
                    <div className="rechazo-info">
                      <p><strong>Motivo del rechazo:</strong></p>
                      <p>{pasantia.motivoRechazo}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}