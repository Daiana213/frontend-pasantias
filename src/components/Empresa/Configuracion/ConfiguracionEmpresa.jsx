import React from 'react';
import HeaderEmpresa from '../../Header/HeaderEmpresa';
import './ConfiguracionEmpresa.css';

export default function ConfiguracionEmpresa() {
  return (
    <>
      <HeaderEmpresa />
      <div className="configuracion-empresa-container">
        <h1>Configuración</h1>
        <div className="configuracion-options">
          {/* Opciones de configuración */}
        </div>
      </div>
    </>
  );
}