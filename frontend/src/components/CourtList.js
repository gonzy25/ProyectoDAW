import React, { useState, useEffect } from 'react';
import { courtsAPI } from '../api/api';
import '../styles/CourtList.css';

function CourtList() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await courtsAPI.getAll();
      setCourts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las pistas');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando pistas...</div>
      </div>
    );
  }

  return (
    <div className="court-list-container">
      <div className="container">
        <h1>Nuestras Pistas</h1>
        {error && <div className="error">{error}</div>}
        
        <div className="courts-grid">
          {courts.map((court) => (
            <div key={court.id} className="court-card card">
              <div className="court-image-container">
                <img 
                  src={court.imagen_url} 
                  alt={court.nombre}
                  className="court-image"
                  onError={(e) => {
                    e.target.src = 'https://padelmagic.es/wp-content/uploads/2023/09/0b5a1993-7eab-42d2-b85e-e947cbd5a751.jpg';
                  }}
                />
                <div className="court-overlay">
                  <span className="court-overlay-text">Ver Pista</span>
                </div>
              </div>
              <div className="court-content">
                <div className="court-header">
                  <h3>{court.nombre}</h3>
                  <span className={`court-status ${court.estado}`}>
                    {court.estado === 'disponible' ? 'Disponible' : 'No Disponible'}
                  </span>
                </div>
                <div className="court-details">
                  <p><strong>Ubicación:</strong> {court.ubicacion}</p>
                  <p><strong>Tipo:</strong> {court.tipo_superficie}</p>
                  {court.descripcion && <p className="court-description">{court.descripcion}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {courts.length === 0 && (
          <div className="no-courts">
            <p>No hay pistas disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourtList;
