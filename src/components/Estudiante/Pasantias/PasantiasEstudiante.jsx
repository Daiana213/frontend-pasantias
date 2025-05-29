import React, { useState, useEffect } from 'react';
import HeaderEstudiante from '../../Header/HeaderEstudiante';
import { API_URL, getAuthHeader } from '../../../config';
import './PasantiasEstudiante.css';

export default function PasantiasEstudiante() {
  const [pasantias, setPasantias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postulando, setPostulando] = useState(null);

  useEffect(() => {
    cargarPasantias();
  }, []);

  const cargarPasantias = async () => {
    try {
      const response = await fetch(`${API_URL}/api/pasantias`, {
        headers: getAuthHeader()
      });
      const data = await response.json();
      setPasantias(data);
    } catch (error) {
      setError('Error al cargar las pasantías');
    } finally {
      setLoading(false);
    }
  };

  const handlePostular = async (pasantiaId) => {
    setPostulando(pasantiaId);
    try {
      const response = await fetch(`${API_URL}/api/postulaciones`, {
        method: 'POST',
        headers: {
          ...getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pasantiaId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al postular');
      }

      cargarPasantias(); // Recargar para actualizar estados
    } catch (error) {
      setError(error.message);
    } finally {
      setPostulando(null);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <>
      <HeaderEstudiante />
      <div className="pasantias-container">
        <h1>Pasantías Disponibles</h1>
        <div className="pasantias-grid">
          {pasantias.map(pasantia => (
            <div key={pasantia.id} className="pasantia-card">
              <h3>{pasantia.titulo}</h3>
              <p>{pasantia.descripcion}</p>
              <div className="pasantia-details">
                <p><strong>Duración:</strong> {pasantia.duracion}</p>
                <p><strong>Horario:</strong> {pasantia.horario}</p>
                <p><strong>Remuneración:</strong> {pasantia.remuneracion}</p>
              </div>
              <button
                onClick={() => handlePostular(pasantia.id)}
                disabled={postulando === pasantia.id || pasantia.postulaciones.some(p => p.estudianteId === currentUser.id)}
                className="postular-button"
              >
                {postulando === pasantia.id ? 'Postulando...' :
                 pasantia.postulaciones.some(p => p.estudianteId === currentUser.id) ? 'Ya Postulado' :
                 'Postularme'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}