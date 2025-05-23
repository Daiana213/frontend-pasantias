import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/utn.png';
import './Header.css';

export default function HeaderEstudiante() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleCerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <img
          src={logo}
          alt="Logo UTN"
          className="header-logo"
          onClick={() => navigate('/inicio-estudiante')}
        />
        <nav className="header-nav">
          <button onClick={() => navigate('/pasantias')} className="nav-link">
            Pasantías
          </button>
          <button onClick={() => navigate('/comunicacion')} className="nav-link">
            Comunicación
          </button>
          <button onClick={() => navigate('/evaluacion')} className="nav-link">
            Evaluación
          </button>
          <button onClick={() => navigate('/perfil-estudiante')} className="nav-link">
            Perfil
          </button>
          <button onClick={() => navigate('/configuracion')} className="nav-link">
            Configuración
          </button>
        </nav>
        <button onClick={handleCerrarSesion} className="header-btn">
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}