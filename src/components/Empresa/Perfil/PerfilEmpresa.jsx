import React from 'react';
import HeaderEmpresa from '../../Header/HeaderEmpresa';
import './PerfilEmpresa.css';

export default function PerfilEmpresa() {
  return (
    <>
      <HeaderEmpresa />
      <div className="perfil-empresa-container">
        <h1>Perfil de la Empresa</h1>
        <div className="perfil-info">
          {/* Información del perfil */}
        </div>
      </div>
    </>
  );
}