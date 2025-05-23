import React from 'react';
import HeaderEmpresa from '../../Header/HeaderEmpresa';
import './ComunicacionEmpresa.css';

export default function ComunicacionEmpresa() {
  return (
    <>
      <HeaderEmpresa />
      <div className="comunicacion-empresa-container">
        <h1>Centro de Comunicación</h1>
        <div className="mensajes-section">
          {/* Sistema de mensajería */}
        </div>
      </div>
    </>
  );
}