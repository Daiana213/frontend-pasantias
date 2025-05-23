import React from 'react';
import HeaderEstudiante from '../../Header/HeaderEstudiante';
import './EvaluacionEstudiante.css';

export default function EvaluacionEstudiante() {
  return (
    <>
      <HeaderEstudiante />
      <div className="evaluacion-container">
        <h1>Evaluación de Pasantía</h1>
        <div className="evaluacion-form">
          {/* Formulario de evaluación */}
        </div>
      </div>
    </>
  );
}