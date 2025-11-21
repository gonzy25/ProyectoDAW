import React, { useState, useEffect } from 'react';
import { bookingsAPI, courtsAPI } from '../api/api';
import '../styles/MyBookings.css';

function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [courts, setCourts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [bookingsResponse, courtsResponse] = await Promise.all([
        bookingsAPI.getByUser(user.id),
        courtsAPI.getAll()
      ]);

      setBookings(bookingsResponse.data);
      
      // Crear un mapa de pistas para acceso rápido
      const courtsMap = {};
      courtsResponse.data.forEach(court => {
        courtsMap[court.id] = court;
      });
      setCourts(courtsMap);
      
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las reservas');
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }

    try {
      await bookingsAPI.cancel(bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      alert('Reserva cancelada exitosamente');
    } catch (err) {
      alert('Error al cancelar la reserva');
    }
  };

  const getStatusBadge = (estado) => {
    const badges = {
      'confirmada': { text: '✅ Confirmada', class: 'status-confirmed' },
      'cancelada': { text: '❌ Cancelada', class: 'status-cancelled' },
      'completada': { text: '✔️ Completada', class: 'status-completed' }
    };
    return badges[estado] || { text: estado, class: '' };
  };

  const isPastBooking = (fecha, hora) => {
    const bookingDateTime = new Date(`${fecha}T${hora}`);
    return bookingDateTime < new Date();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className="my-bookings-container">
      <div className="container">
        <h1>📋 Mis Reservas</h1>
        {error && <div className="error">{error}</div>}

        {bookings.length === 0 ? (
          <div className="no-bookings card">
            <p>No tienes reservas en este momento.</p>
            <a href="/booking" className="btn btn-primary">Hacer una Reserva</a>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => {
              const court = courts[booking.pista_id];
              const statusBadge = getStatusBadge(booking.estado);
              const isPast = isPastBooking(booking.fecha, booking.hora_inicio);
              
              return (
                <div key={booking.id} className="booking-card card">
                  <div className="booking-header">
                    <h3>{court?.nombre || 'Pista desconocida'}</h3>
                    <span className={`booking-status ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <p><strong>📍 Ubicación:</strong> {court?.ubicacion}</p>
                    <p><strong>📅 Fecha:</strong> {new Date(booking.fecha).toLocaleDateString('es-ES')}</p>
                    <p><strong>🕐 Hora:</strong> {booking.hora_inicio}</p>
                    <p><strong>⏱️ Duración:</strong> {booking.duracion} minutos</p>
                    <p><strong>🏟️ Superficie:</strong> {court?.tipo_superficie}</p>
                  </div>

                  {booking.estado === 'confirmada' && !isPast && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="btn btn-danger"
                    >
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
