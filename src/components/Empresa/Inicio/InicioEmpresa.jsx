import { useState, useEffect } from 'react';
import Header from '../../Header/HeaderEmpresa';
import './InicioEmpresa.css';
import { useNavigate } from 'react-router-dom';
import { API_URL, getAuthHeader } from '../../../config';


export default function InicioEmpresa() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();
  const [postulaciones, setPostulaciones] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [error, setError] = useState(''); 

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No hay token de autenticación');
        }

        // Cargar postulaciones
        const resPostulaciones = await fetch(`${API_URL}/api/postulaciones/empresa`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!resPostulaciones.ok) {
          throw new Error('Error al cargar las postulaciones');
        }

        const dataPostulaciones = await resPostulaciones.json();
        setPostulaciones(dataPostulaciones);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError(error.message);
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
    <>
    <Header />
    <div className="inicio-empresa-container">
      <h2 className="inicio-titulo"> Hola, {usuario?.nombre || "Empresa"}</h2>
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
    </div>
    </>
  );
}