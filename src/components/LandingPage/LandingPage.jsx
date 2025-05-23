import { useNavigate } from "react-router-dom";
import './LandingPage.css';
import logo from '../../assets/utn.png';
import Header from '../Header/Header';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="landing-bg">
        <div className="landing-container">
          <header className="landing-header">
            <img src={logo} alt="Logo UTN" className="logo" />
            <h1>PASANTIAS UTN</h1>
            <h2>REGIONAL SAN FRANCISCO</h2>
          </header>
          <main className="landing-main">
            <p>
              Da el primer paso crucial hacia tu futuro profesional.<br />
              Explorá nuestra plataforma y descubrí las pasantías universitarias que te brindarán experiencia práctica, el conocimiento y las conexiones necesarias para destacarte en el competitivo mundo laboral.<br />
              ¡Descubrí a tu próximo líder entre universitarios talentosos!<br />
              Talento universitario impulsa empresas. ¡Tu futuro profesional comienza aquí!
            </p>
            <div className="landing-buttons">
              <button onClick={() => navigate("/login-empresa")}>Empresa</button>
              <button onClick={() => navigate("/login-estudiante")}>Estudiante</button>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
