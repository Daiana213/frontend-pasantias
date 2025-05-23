import React from 'react';
import HeaderEmpresa from '../../Header/HeaderEmpresa';
import './EvaluacionEmpresa.css';

export default function EvaluacionEmpresa() {
  return (
    <>
      <HeaderEmpresa />
      <div className="evaluacion-empresa-container">
        <h1>Evaluación de Pasantes</h1>
        <div className="evaluacion-list">
          {/* Lista de evaluaciones */}
        </div>
      </div>
    </>
  );
}