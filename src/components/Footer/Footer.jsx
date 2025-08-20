import { useState, useEffect } from 'react';
import './Footer.css';
import logo from '../../assets/utn.png';

export default function Footer() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="main-footer">
      <div className="footer-content">
        {/* Información principal */}
        <div className="footer-brand">
          <h3 className="footer-title">Sistema de Pasantías UTN</h3>
          <p className="footer-subtitle">Facultad Regional San Francisco</p>
          <p className="footer-description">
            Conectamos estudiantes con empresas para crear oportunidades de crecimiento profesional.
          </p>
        </div>

        {/* Información de contacto */}
        <div className="footer-section">
          <h4 className="footer-section-title">Contacto</h4>
          <div className="footer-contact">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <span>Av. de la Universidad 501, San Francisco, Córdoba</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>pasantias@sanfrancisco.utn.edu.ar</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>+54 3564 420147</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🌐</span>
              <span>www.sanfrancisco.utn.edu.ar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botón volver arriba */}
      <button 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Volver arriba"
      >
        ↑
      </button>
    </footer>
  );
} 