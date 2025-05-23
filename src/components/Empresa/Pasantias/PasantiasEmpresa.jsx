import React from 'react';
import HeaderEmpresa from '../../Header/HeaderEmpresa';
import './PasantiasEmpresa.css';

export default function PasantiasEmpresa() {
  return (
    <>
      <HeaderEmpresa />
      <div className="pasantias-empresa-container">
        <h1>Gestión de Pasantías</h1>
        <div className="pasantias-list">
          {/* Lista de pasantías publicadas */}
        </div>
      </div>
    </>
  );
}