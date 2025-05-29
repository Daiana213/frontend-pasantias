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
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
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
        p.horarioPropuesto?.toLowerCase() === filtros.horarioPropuesto.toLowerCase()
      );
    }
    
    if (filtros.fechaInicio) {
      pasantiasFiltradas = pasantiasFiltradas.filter(p => 
        p.fechaInicioEstimada?.includes(filtros.fechaInicio)
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
    // Aquí se implementaría la lógica para activar notificaciones
    setNotificacionActiva(true);
    setError('');
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <>
      <HeaderEstudiante />
      <div className="pasantias-container">
        <h1>Pasantías Disponibles</h1>
        
        {/* Botón para mostrar/ocultar filtros */}
        <button 
          className="toggle-filtros-btn"
          onClick={() => setMostrarFiltros(!mostrarFiltros)}
        >
          {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </button>
        
        {/* Panel de filtros */}
        {mostrarFiltros && (
          <div className="filtros-panel">
            <h3>Filtrar Pasantías</h3>
            <div className="filtros-grid">
              <div className="filtro-grupo">
                <label>Carrera:</label>
                <select 
                  name="carrera" 
                  value={filtros.carrera} 
                  onChange={handleFiltroChange}
                >
                  <option value="">Todas</option>
                  <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                  <option value="Ingeniería Electromecánica">Ingeniería Electromecánica</option>
                  <option value="Ingeniería Química">Ingeniería Química</option>
                  <option value="Ingeniería en Sistemas de Información">Ingeniería en Sistemas de Información</option>
                  <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                  <option value="Licenciatura en Administración Rural">Licenciatura en Administración Rural</option>
                  <option value="Tecnicatura Universitaria en Programación">Tecnicatura Universitaria en Programación</option>
                </select>
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
                  <option value="remota">Remota</option>
                  <option value="hibrida">Híbrida</option>
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
              <h3>{pasantia.titulo}</h3>
              <p className="empresa">{pasantia.empresaNombre}</p>
              <p className="descripcion">{pasantia.descripcion}</p>
              <div className="pasantia-details">
                <p><strong>Carrera:</strong> {pasantia.carreraSugerida}</p>
                <p><strong>Modalidad:</strong> {pasantia.modalidad}</p>
                <p><strong>Duración:</strong> {pasantia.duracionEstimada}</p>
                <p><strong>Horario:</strong> {pasantia.horarioPropuesto}</p>
                <p><strong>Tipo de Jornada:</strong> {pasantia.tipoJornada}</p>
                <p><strong>Fecha de Inicio:</strong> {new Date(pasantia.fechaInicioEstimada).toLocaleDateString()}</p>
                <p><strong>Fecha Límite de Postulación:</strong> {new Date(pasantia.fechaLimitePostulacion).toLocaleDateString()}</p>
              </div>
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
          ))}
        </div>
      </div>
    </>
  );
}