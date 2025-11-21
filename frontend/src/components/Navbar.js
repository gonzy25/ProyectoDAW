import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../logo/logoAceNet.jpg';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard">
            <img src={logo} alt="AceNet Logo" className="navbar-logo" />
            <span>AceNet</span>
          </Link>
        </div>
        <ul className="navbar-menu">
          <li>
            <Link to="/dashboard">Inicio</Link>
          </li>
          <li>
            <Link to="/courts">Pistas</Link>
          </li>
          <li>
            <Link to="/booking">Nueva Reserva</Link>
          </li>
          <li>
            <Link to="/my-bookings">Mis Reservas</Link>
          </li>
        </ul>
        <div className="navbar-user">
          <span>👤 {user?.nombre}</span>
          <button onClick={onLogout} className="btn btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
