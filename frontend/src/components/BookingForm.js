import React, { useState, useEffect } from 'react';
import { courtsAPI, bookingsAPI } from '../api/api';
import '../styles/BookingForm.css';

function BookingForm({ user }) {
  const [courts, setCourts] = useState([]);
  const [formData, setFormData] = useState({
    pista_id: '',
    fecha: '',
    hora_inicio: '',
    duracion: 60
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await courtsAPI.getAll();
      setCourts(response.data.filter(court => court.estado === 'disponible'));
    } catch (err) {
      setError('Error al cargar las pistas');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // El usuario_id se obtiene del token JWT en el backend
      await bookingsAPI.create(formData);
      setSuccess('¡Reserva creada exitosamente!');
      
      // Resetear formulario
      setFormData({
        pista_id: '',
        fecha: '',
        hora_inicio: '',
        duracion: 60
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  // Generar opciones de horarios (de 8:00 a 22:00)
  const timeSlots = [];
  for (let hour = 8; hour <= 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 22) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  return (
    <div className="booking-form-container">
      <div className="container">
        <div className="card booking-form-card">
          <h1>Nueva Reserva</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="pista_id">Selecciona una Pista</label>
              <select
                id="pista_id"
                name="pista_id"
                value={formData.pista_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona una pista --</option>
                {courts.map((court) => (
                  <option key={court.id} value={court.id}>
                    {court.nombre} - {court.ubicacion} ({court.tipo_superficie})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fecha">Fecha</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="hora_inicio">Hora de Inicio</label>
              <select
                id="hora_inicio"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                required
              >
                <option value="">-- Selecciona una hora --</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="duracion">Duración (minutos)</label>
              <select
                id="duracion"
                name="duracion"
                value={formData.duracion}
                onChange={handleChange}
                required
              >
                <option value="60">60 minutos (1 hora)</option>
                <option value="90">90 minutos (1.5 horas)</option>
                <option value="120">120 minutos (2 horas)</option>
              </select>
            </div>

            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creando reserva...' : 'Reservar Pista'}
            </button>
          </form>
        </div>

        <div className="card booking-info">
          <h2>Información de Reservas</h2>
          <ul>
            <li>Las reservas se realizan por bloques de 60, 90 o 120 minutos</li>
            <li>Horario disponible: 8:00 - 23:00</li>
            <li>Puedes cancelar tu reserva hasta 2 horas antes del inicio</li>
            <li>Cada usuario puede tener hasta 3 reservas activas simultáneamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
