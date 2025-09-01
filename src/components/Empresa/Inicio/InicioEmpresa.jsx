import { useState, useEffect } from 'react';
import HeaderEmpresa from '../../Header/HeaderEmpresa';
import './InicioEmpresa.css';
import { API_URL, getAuthHeader } from '../../../config';
import { useAuth } from '../../../contexts/AuthContext';

export default function InicioEmpresa() {
  const { currentUser } = useAuth();
  const [pasantias, setPasantias] = useState([]);
  const [postulaciones, setPostulaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        // Cargar pasantías de la empresa
        const resPasantias = await fetch(`${API_URL}/api/pasantias/empresa`, {
          headers: getAuthHeader()
        });
        if (resPasantias.ok) {
          const dataPasantias = await resPasantias.json();
          setPasantias(dataPasantias);
        }

        // Cargar postulaciones a las pasantías de la empresa
        const resPostulaciones = await fetch(`${API_URL}/api/postulaciones/empresa/resumen`, {
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
      <HeaderEmpresa />
      <div className="inicio-empresa-container">
        <div className="inicio-header">
          <h1 className="inicio-titulo">Bienvenido, {currentUser?.nombre || currentUser?.razonSocial || currentUser?.correo || currentUser?.email}</h1>
          <p className="inicio-subtitulo">Panel de Gestión de Pasantías</p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon pasantias-icon">📋</div>
            <div className="card-content">
              <h2>{pasantias.length}</h2>
              <p>Pasantías publicadas</p>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon postulaciones-icon">👥</div>
            <div className="card-content">
              <h2>{postulaciones.length}</h2>
              <p>Postulaciones recibidas</p>
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="inicio-secciones">
          <section className="inicio-seccion">
            <h2>Mis pasantías activas</h2>
            <div className="pasantias-recientes">
              {pasantias.length > 0 ? (
                pasantias.slice(0, 3).map(pasantia => (
                  <div key={pasantia.id} className="pasantia-card-mini">
                    <h3>{pasantia.titulo}</h3>
                    <div className="pasantia-info">
                      <span className={`estado-badge ${pasantia.estado}`}>{pasantia.estado}</span>
                      <span className="pasantia-postulaciones">{pasantia.postulaciones?.length || 0} postulaciones</span>
                    </div>
                    <p className="pasantia-descripcion">{pasantia.descripcion?.substring(0, 100)}...</p>
                    <div className="pasantia-footer">
                      <span className="pasantia-fecha">Publicada: {new Date(pasantia.fechaCreacion).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No tienes pasantías activas.</p>
              )}
            </div>
            <a href="/empresa/pasantias" className="ver-mas-link">Ver todas mis pasantías</a>
          </section>

          <section className="inicio-seccion">
            <h2>Postulaciones recientes</h2>
            <div className="postulaciones-recientes">
              {postulaciones.length > 0 ? (
                postulaciones.slice(0, 3).map(postulacion => (
                  <div key={postulacion.id} className="postulacion-card-mini">
                    <h3>{postulacion.pasantiaTitulo}</h3>
                    <p className="estudiante-nombre">{postulacion.estudianteNombre}</p>
                    <div className="postulacion-estado">
                      <span className={`estado-badge ${postulacion.estado}`}>{postulacion.estado}</span>
                      <span className="postulacion-fecha">{new Date(postulacion.fecha).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No hay postulaciones recientes.</p>
              )}
            </div>
            <a href="/empresa/postulaciones" className="ver-mas-link">Ver todas las postulaciones</a>
          </section>
        </div>
      </div>
    </>
  );
}