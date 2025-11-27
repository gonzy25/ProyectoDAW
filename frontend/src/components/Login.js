import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/api';
import '../styles/Login.css';
import logo from '../logo/logoAceNet.jpg';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const backgroundImages = [
    'https://padelmagazine.fr/wp-content/uploads/2023/10/17385996__B4A1521_Yasmine_Akki_20230910_185440-scaled.jpg',
    'https://mediaassets.cbre.com/-/media/project/cbre/shared-site/emea/spain/articles/el%20auge%20del%20pdel%20en%20espaa.png',
    'https://contents.mediadecathlon.com/p2529452/k$02c7b9e204838530154fe4ace0b32b29/1920x0/3504pt1927/7008xcr2156/fnl_bg_padel_basic_artengo.jpg?format=auto',
    'https://padelmagazine.fr/wp-content/uploads/2025/02/terrains-padel.jpg.webp'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      onLogin(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Carrusel de imágenes de fondo */}
      <div className="background-carousel">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`carousel-image ${index === currentImageIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      <div className="login-overlay"></div>
      
      {/* Logo en la esquina superior izquierda */}
      <div className="page-logo">
        <img src={logo} alt="AceNet Logo" />
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <h1> AceNet</h1>
          <h2>Iniciar Sesión</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="login-footer">
          <p>
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
