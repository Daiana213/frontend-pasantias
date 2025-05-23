import React from 'react';
import HeaderEstudiante from '../../Header/HeaderEstudiante';
import './PerfilEstudiante.css';

export default function PerfilEstudiante() {
  return (
    <>
      <HeaderEstudiante />
      <div className="perfil-container">
        <h1>Mi Perfil</h1>
        <div className="perfil-info">
          {/* Información del perfil */}
        </div>
      </div>
    </>
  );
}