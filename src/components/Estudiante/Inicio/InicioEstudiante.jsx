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
        const resPostulaciones = await fetch(`${API_URL}/api/postulaciones/estudiante`, {
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
            <h2>Pasantías destacadas</h2>
            <div className="pasantias-recientes">
              {pasantias.length > 0 ? (
                pasantias.slice(0, 3).map(pasantia => (
                  <div key={pasantia.id} className="pasantia-card-mini">
                    <h3>{pasantia.titulo}</h3>
                    <p className="empresa-nombre">{pasantia.empresaNombre}</p>
                    <p className="pasantia-descripcion">{pasantia.descripcion?.substring(0, 100)}...</p>
                    <div className="pasantia-footer">
                      <span className="pasantia-modalidad">{pasantia.modalidad}</span>
                      <span className="pasantia-fecha">Hasta: {new Date(pasantia.fechaLimitePostulacion).toLocaleDateString()}</span>
                    </div>
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
                postulaciones.slice(0, 3).map(postulacion => (
                  <div key={postulacion.id} className="postulacion-card-mini">
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

        <div className="acciones-rapidas">
          <h2>Acciones rápidas</h2>
          <div className="acciones-botones">
            <a href="/pasantias" className="accion-btn">Buscar pasantías</a>
            <a href="/perfil-estudiante" className="accion-btn">Actualizar perfil</a>
            <a href="/comunicacion" className="accion-btn">Mensajes</a>
          </div>
        </div>
      </div>
    </>
  );
}