import React from 'react';
import HeaderEstudiante from '../../Header/HeaderEstudiante';
import './ComunicacionEstudiante.css';

export default function ComunicacionEstudiante() {
  return (
    <>
      <HeaderEstudiante />
      <div className="comunicacion-container">
        <h1>Centro de Comunicación</h1>
        <div className="mensajes-section">
          {/* Sistema de mensajería */}
        </div>
      </div>
    </>
  );
}