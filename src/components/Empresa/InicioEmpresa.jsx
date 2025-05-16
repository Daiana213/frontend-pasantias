import { useState, useEffect } from 'react';
import './InicioEmpresa.css';
import { useNavigate } from 'react-router-dom';
import { API_URL, getAuthHeader } from '../../config';

export default function InicioEmpresa() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();
  const [postulaciones, setPostulaciones] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar postulaciones
        const resPostulaciones = await fetch(`${API_URL}/postulaciones/empresa`, {
          headers: getAuthHeader()
        });
        const dataPostulaciones = await resPostulaciones.json();
        setPostulaciones(dataPostulaciones);

        // Cargar notificaciones
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
    navigate("/");
  };

  return (
    <div className="inicio-empresa-container">
      <h2 className="inicio-titulo"> Hola, {usuario?.nombre || "Nombre Empresa"}</h2>
      <div className="inicio-secciones">
        <section className="inicio-bloque">
          <h3>Opciones rápidas</h3>
          <div className="inicio-cajas">
            <div className="inicio-caja" onClick={() => navigate("/publicar-oferta")}>
              Publicar oferta
            </div>
            <div className="inicio-caja" onClick={() => navigate("/ver-postulaciones")}>
              Ver postulaciones ({postulaciones.length})
            </div>
          </div>
        </section>
        <section className="inicio-bloque">
          <h3>Notificaciones</h3>
          <div className="inicio-cajas">
            {notificaciones.length > 0 ? (
              notificaciones.map(notif => (
                <div key={notif.id} className="inicio-caja">
                  {notif.mensaje}
                </div>
              ))
            ) : (
              <div className="inicio-caja">Sin notificaciones</div>
            )}
          </div>
        </section>
      </div>
      <button
        onClick={handleCerrarSesion}
        style={{marginTop: 20}}
        className="btn-cerrar-sesion"
      >
        Cerrar sesión
      </button>
    </div>
  );
} 