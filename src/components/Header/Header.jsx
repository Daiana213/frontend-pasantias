import './Header.css';
import logo from '../../assets/utn.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const loginDropdownRef = useRef(null);
  const registerDropdownRef = useRef(null);

  // Cerrar dropdowns cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target)) {
        setShowLoginMenu(false);
      }
      if (registerDropdownRef.current && !registerDropdownRef.current.contains(event.target)) {
        setShowRegisterMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = (type) => {
    navigate(`/login-${type}`);
    setShowLoginMenu(false);
    setIsMobileMenuOpen(false);
  };

  const handleRegisterClick = (type) => {
    navigate(`/registro-${type}`);
    setShowRegisterMenu(false);
    setIsMobileMenuOpen(false);
  };

  const toggleLoginMenu = () => {
    setShowLoginMenu(!showLoginMenu);
    setShowRegisterMenu(false); // Cerrar el otro dropdown
  };

  const toggleRegisterMenu = () => {
    setShowRegisterMenu(!showRegisterMenu);
    setShowLoginMenu(false); // Cerrar el otro dropdown
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-brand" onClick={handleLogoClick}>
          <img
            src={logo}
            alt="Logo UTN"
            className="header-logo"
          />
          <div className="header-titles">
            <h1 className="header-title">Sistema de Pasantías</h1>
            <p className="header-subtitle">UTN - Regional San Francisco</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="header-dropdown" ref={loginDropdownRef}>
            <button
              className={`header-btn header-btn-secundario ${showLoginMenu ? 'active' : ''}`}
              onClick={toggleLoginMenu}
            >
              Iniciar Sesión
            </button>
            {showLoginMenu && (
              <div className="header-dropdown-content">
                <button 
                  className="header-dropdown-btn"
                  onClick={() => handleLoginClick('estudiante')}
                >
                  Estudiante
                </button>
                <button 
                  className="header-dropdown-btn"
                  onClick={() => handleLoginClick('empresa')}
                >
                  Empresa
                </button>
              </div>
            )}
          </div>

          <div className="header-dropdown" ref={registerDropdownRef}>
            <button
              className={`header-btn ${showRegisterMenu ? 'active' : ''}`}
              onClick={toggleRegisterMenu}
            >
              Registrarse
            </button>
            {showRegisterMenu && (
              <div className="header-dropdown-content">
                <button 
                  className="header-dropdown-btn"
                  onClick={() => handleRegisterClick('estudiante')}
                >
                  Estudiante
                </button>
                <button 
                  className="header-dropdown-btn"
                  onClick={() => handleRegisterClick('empresa')}
                >
                  Empresa
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 