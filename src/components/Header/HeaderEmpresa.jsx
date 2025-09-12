import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/utn.png';
import './Header.css';

export default function HeaderEmpresa() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const handleCerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
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
          onClick={() => navigate('/inicio-empresa')}
        />
        <nav className="header-nav">
          <button onClick={() => navigate('/empresa/pasantias')} className="nav-link">
            Pasantías
          </button>
          <button onClick={() => navigate('/empresa/postulaciones')} className="nav-link">
            Postulaciones
          </button>
          <button onClick={() => navigate('/empresa/comunicacion')} className="nav-link">
            Comunicación
          </button>
          <button onClick={() => navigate('/empresa/evaluacion')} className="nav-link">
            Evaluación
          </button>
          <button onClick={() => navigate('/empresa/configuracion')} className="nav-link">
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