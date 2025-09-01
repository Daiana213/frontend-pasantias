import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import LandingPage from './components/LandingPage/LandingPage';
import LoginEstudiante from './components/Login/LoginEstudiante';
import LoginEmpresa from './components/Login/LoginEmpresa';
import RegistroEstudiante from './components/Registro/RegistroEstudiante';
import RegistroEmpresa from './components/Registro/RegistroEmpresa';
import InicioEstudiante from './components/Estudiante/Inicio/InicioEstudiante';
import InicioEmpresa from './components/Empresa/Inicio/InicioEmpresa';
import Pasantias from './components/Estudiante/Pasantias/PasantiasEstudiante';
import MisPostulaciones from './components/Estudiante/Postulaciones/MisPostulaciones';
import Comunicacion from './components/Estudiante/Comunicacion/ComunicacionEstudiante';
import Evaluacion from './components/Estudiante/Evaluacion/EvaluacionEstudiante';
import PerfilEstudiante from './components/Estudiante/Perfil/PerfilEstudiante';
import Configuracion from './components/Estudiante/Configuracion/ConfiguracionEstudiante';
import PasantiasEmpresa from './components/Empresa/Pasantias/PasantiasEmpresa';
import Postulaciones from './components/Empresa/Postulaciones/Postulaciones';
import ComunicacionEmpresa from './components/Empresa/Comunicacion/ComunicacionEmpresa';
import EvaluacionEmpresa from './components/Empresa/Evaluacion/EvaluacionEmpresa';
import PerfilEmpresa from './components/Empresa/Perfil/PerfilEmpresa';
import ConfiguracionEmpresa from './components/Empresa/Configuracion/ConfiguracionEmpresa';
import VerificarEmail from './components/Auth/VerificarEmail';
import PrivateRoute from './components/Auth/PrivateRoute';
import './styles/globals.css';

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
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
        {/* Rutas de Estudiante */}
        <Route 
          path="/pasantias" 
          element={
            <PrivateRoute requiredRole="estudiante">
              <Pasantias />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/mis-postulaciones" 
          element={
            <PrivateRoute requiredRole="estudiante">
              <MisPostulaciones />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/comunicacion" 
          element={
            <PrivateRoute requiredRole="estudiante">
              <Comunicacion />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/evaluacion" 
          element={
            <PrivateRoute requiredRole="estudiante">
              <Evaluacion />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/perfil-estudiante" 
          element={
            <PrivateRoute requiredRole="estudiante">
              <PerfilEstudiante />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/configuracion" 
          element={
            <PrivateRoute requiredRole="estudiante">
              <Configuracion />
            </PrivateRoute>
          } 
        />

        {/* Rutas de Empresa */}
        <Route 
          path="/empresa/pasantias" 
          element={
            <PrivateRoute requiredRole="empresa">
              <PasantiasEmpresa />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/empresa/postulaciones" 
          element={
            <PrivateRoute requiredRole="empresa">
              <Postulaciones />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/empresa/comunicacion" 
          element={
            <PrivateRoute requiredRole="empresa">
              <ComunicacionEmpresa />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/empresa/evaluacion" 
          element={
            <PrivateRoute requiredRole="empresa">
              <EvaluacionEmpresa />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/empresa/perfil" 
          element={
            <PrivateRoute requiredRole="empresa">
              <PerfilEmpresa />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/empresa/configuracion" 
          element={
            <PrivateRoute requiredRole="empresa">
              <ConfiguracionEmpresa />
            </PrivateRoute>
          } 
        />
        
        {/* Ruta catch-all para manejar rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
