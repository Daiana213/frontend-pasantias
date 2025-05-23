import React from 'react';
import HeaderEmpresa from '../../Header/HeaderEmpresa';
import './Postulaciones.css';

export default function Postulaciones() {
  return (
    <>
      <HeaderEmpresa />
      <div className="postulaciones-container">
        <h1>Postulaciones Recibidas</h1>
        <div className="postulaciones-list">
          {/* Lista de postulaciones */}
        </div>
      </div>
    </>
  );
}