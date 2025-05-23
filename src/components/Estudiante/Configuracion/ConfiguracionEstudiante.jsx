import React from 'react';
import HeaderEstudiante from '../../Header/HeaderEstudiante';
import './ConfiguracionEstudiante.css';

export default function Configuracion() {
  return (
    <>
      <HeaderEstudiante />
      <div className="configuracion-container">
        <h1>Configuración</h1>
        <div className="configuracion-options">
          {/* Opciones de configuración */}
        </div>
      </div>
    </>
  );
}