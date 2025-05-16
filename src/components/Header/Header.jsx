import './Header.css';
import logo from '../../assets/utn.png';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);

  return (
    <header className="main-header">
      <div className="header-content">
        <img
          src={logo}
          alt="Logo UTN"
          className="header-logo"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')} 
        />
        <div>
          <span className="header-title">PASANTIAS UTN</span>
          <span className="header-subtitle">Regional San Francisco</span>
        </div>
      </div>
      <div className="header-actions">
        <div className="header-btn-group">
          <button
            className="header-btn"
            onClick={() => {
              setShowLoginMenu((v) => !v);
              setShowRegisterMenu(false);
            }}
          >
            Iniciar Sesión
          </button>
          {showLoginMenu && (
            <div className="header-dropdown">
              <button onClick={() => navigate('/login-estudiante')}>Estudiante</button>
              <button onClick={() => navigate('/login-empresa')}>Empresa</button>
            </div>
          )}
        </div>
        <div className="header-btn-group">
          <button
            className="header-btn"
            onClick={() => {
              setShowRegisterMenu((v) => !v);
              setShowLoginMenu(false);
            }}
          >
            Registrarse
          </button>
          {showRegisterMenu && (
            <div className="header-dropdown">
              <button onClick={() => navigate('/registro-estudiante')}>Estudiante</button>
              <button onClick={() => navigate('/registro-empresa')}>Empresa</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 