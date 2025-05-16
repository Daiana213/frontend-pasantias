import { useState, useEffect } from 'react';
import './InicioEstudiante.css';
import { useNavigate } from 'react-router-dom';
import { API_URL, getAuthHeader } from '../../config';
import { useAuth } from '../../contexts/AuthContext';

export default function InicioEstudiante() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();
  const [ofertas, setOfertas] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const {currentUser, setCurrentUser} = useAuth();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resOfertas = await fetch(`${API_URL}/ofertas`, {
          headers: getAuthHeader()
        });
        const dataOfertas = await resOfertas.json();
        setOfertas(dataOfertas);

        const resNotificaciones = await fetch(`${API_URL}/notificaciones`, {
          headers: getAuthHeader()
        });
        const dataNotificaciones = await resNotificaciones.json();
        setNotificaciones(dataNotificaciones);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    cargarDatos();
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setCurrentUser(false);
  };

  if (!currentUser) {
    return navigate("/");
  }

  return (
    <div className="inicio-estudiante-container">
      <div className="inicio-header">
        <h2 className="inicio-titulo">¡Bienvenido, {usuario?.email || "Estudiante"}!</h2>
        <div className="inicio-info">
          <span>Legajo: <b>{usuario?.legajo}</b></span>
          <span className={`estado-validacion ${usuario?.estadoValidacion || 'pendiente'}`}>
            Estado: <b>{usuario?.estadoValidacion || "pendiente"}</b>
          </span>
          <span>Registro: <b>{usuario?.fechaRegistro ? new Date(usuario.fechaRegistro).toLocaleDateString() : "-"}</b></span>
        </div>
      </div>

      <div className="inicio-estadisticas">
        <div className="estadistica-card ofertas">
          <div className="estadistica-numero">{ofertas.length}</div>
          <div className="estadistica-texto">Ofertas disponibles</div>
        </div>
        <div className="estadistica-card notificaciones">
          <div className="estadistica-numero">{notificaciones.length}</div>
          <div className="estadistica-texto">Notificaciones</div>
        </div>
      </div>

      <div className="inicio-secciones">
        <section className="inicio-bloque">
          <h3>Notificaciones</h3>
          <div className="inicio-cajas">
            {notificaciones.length > 0 ? (
              notificaciones.map(notif => (
                <div key={notif.id} className="inicio-caja notificacion">
                  <p>{notif.mensaje}</p>
                  <span className="fecha">{notif.fecha}</span>
                </div>
              ))
            ) : (
              <div className="inicio-caja vacio">Sin notificaciones</div>
            )}
          </div>
        </section>

        <section className="inicio-bloque">
          <h3>Nuevas ofertas</h3>
          <div className="inicio-cajas">
            {ofertas.length > 0 ? (
              ofertas.map(oferta => (
                <div key={oferta.id} className="inicio-caja oferta">
                  <h4>{oferta.titulo}</h4>
                  <p>{oferta.descripcion}</p>
                  <span className="fecha">{oferta.fecha}</span>
                </div>
              ))
            ) : (
              <div className="inicio-caja vacio">No hay nuevas ofertas</div>
            )}
          </div>
        </section>
      </div>

      <button className="btn-cerrar-sesion" onClick={handleCerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
}