import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import LandingPage from './components/LandingPage/LandingPage';
import LoginEstudiante from './components/Login/LoginEstudiante';
import LoginEmpresa from './components/Login/LoginEmpresa';
import RegistroEstudiante from './components/Registro/RegistroEstudiante';
import RegistroEmpresa from './components/Registro/RegistroEmpresa';
import InicioEstudiante from './components/Estudiante/InicioEstudiante';
import InicioEmpresa from './components/Empresa/InicioEmpresa';
import VerificarEmail from './components/Auth/VerificarEmail';
import PrivateRoute from './components/Auth/PrivateRoute';
import './styles/colors.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login-estudiante" element={<LoginEstudiante />} />
        <Route path="/login-empresa" element={<LoginEmpresa />} />
        <Route path="/registro-estudiante" element={<RegistroEstudiante />} />
        <Route path="/registro-empresa" element={<RegistroEmpresa />} />
        <Route path="/verificar-email" element={<VerificarEmail />} />
        <Route 
          path="/inicio-estudiante" 
          element={
            <PrivateRoute requiredRole="estudiante">
              <InicioEstudiante />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/inicio-empresa" 
          element={
            <PrivateRoute requiredRole="empresa">
              <InicioEmpresa />
            </PrivateRoute>
          } 
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
