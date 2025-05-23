import React from 'react';
import HeaderEstudiante from '../../Header/HeaderEstudiante';
import './PasantiasEstudiante.css';

export default function PasantiasEstudiante() {
  return (
    <>
      <HeaderEstudiante />
      <div className="pasantias-container">
        <h1>Pasantías Disponibles</h1>
        <div className="pasantias-grid">
          {/* Lista de pasantías disponibles */}
        </div>
      </div>
    </>
  );
}