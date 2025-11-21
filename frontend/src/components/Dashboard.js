import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard({ user }) {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  const padelNews = [
    {
      title: "Mundial de Pádel 2025",
      description: "España se proclama campeona del mundo por séptima vez consecutiva",
      image: "https://padelmagazine.fr/wp-content/uploads/2023/10/17385996__B4A1521_Yasmine_Akki_20230910_185440-scaled.jpg",
      date: "21 Nov 2025"
    },
    {
      title: "Premier Padel Tour",
      description: "Arranca la nueva temporada con récord de participación",
      image: "https://mediaassets.cbre.com/-/media/project/cbre/shared-site/emea/spain/articles/el%20auge%20del%20pdel%20en%20espaa.png",
      date: "18 Nov 2025"
    },
    {
      title: "Tecnología en Pádel",
      description: "Nuevas palas con tecnología de grafeno revolucionan el juego",
      image: "https://contents.mediadecathlon.com/p2529452/k$02c7b9e204838530154fe4ace0b32b29/1920x0/3504pt1927/7008xcr2156/fnl_bg_padel_basic_artengo.jpg?format=auto",
      date: "15 Nov 2025"
    },
    {
      title: "Crecimiento del Pádel",
      description: "España supera los 4 millones de practicantes activos",
      image: "https://news.mondoiberica.com.es/wp-content/uploads/2020/12/1wpt.jpg",
      date: "10 Nov 2025"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % padelNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [padelNews.length]);

  const nextNews = () => {
    setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % padelNews.length);
  };

  const prevNews = () => {
    setCurrentNewsIndex((prevIndex) => (prevIndex - 1 + padelNews.length) % padelNews.length);
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <h1>Bienvenido, {user?.nombre}! 👋</h1>
          <p>Gestiona tus reservas de pádel en AceNet</p>
        </div>

        <div className="dashboard-grid">
          <Link to="/courts" className="dashboard-card card-courts">
            <div className="card-background" style={{ backgroundImage: 'url(https://news.mondoiberica.com.es/wp-content/uploads/2020/12/1wpt.jpg)' }}></div>
            <div className="card-content">
              <h3>Ver Pistas</h3>
              <p>Explora todas nuestras pistas disponibles</p>
            </div>
          </Link>

          <Link to="/booking" className="dashboard-card card-booking">
            <div className="card-background" style={{ backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa9miuxRjRniQITpK2IeKalzOMvByYadecgQ&s)' }}></div>
            <div className="card-content">
              <h3>Nueva Reserva</h3>
              <p>Reserva tu pista favorita</p>
            </div>
          </Link>

          <Link to="/my-bookings" className="dashboard-card card-my-bookings">
            <div className="card-background" style={{ backgroundImage: 'url(https://reservatupadel.es/wp-content/uploads/2022/04/calendario-reserva-vista-semanal.jpg)' }}></div>
            <div className="card-content">
              <h3>Mis Reservas</h3>
              <p>Consulta y gestiona tus reservas</p>
            </div>
          </Link>

          <div className="dashboard-card card-profile">
            <div className="card-background" style={{ backgroundImage: 'url(https://media.licdn.com/dms/image/v2/D4D03AQGjsfnMaZqRJA/profile-displayphoto-shrink_400_400/B4DZh1DDLbGsAk-/0/1754310391820?e=2147483647&v=beta&t=jMkODRS0uj8Lm0Q1StIaQCeB5o5oNQUwk1lwqGr5Daw)' }}></div>
            <div className="card-content">
              <h3>Mi Perfil</h3>
              <p>Email: {user?.email}</p>
              <p>Teléfono: {user?.telefono}</p>
            </div>
          </div>
        </div>

        <div className="news-section">
          <div className="news-header">
            <h2>🎾 Noticias del Mundo del Pádel</h2>
          </div>
          
          <div className="news-carousel">
            <button className="news-nav-btn prev" onClick={prevNews}>
              ‹
            </button>
            
            <div className="news-content">
              <div 
                className="news-image"
                style={{ backgroundImage: `url(${padelNews[currentNewsIndex].image})` }}
              >
                <div className="news-overlay"></div>
              </div>
              
              <div className="news-details">
                <span className="news-date">{padelNews[currentNewsIndex].date}</span>
                <h3>{padelNews[currentNewsIndex].title}</h3>
                <p>{padelNews[currentNewsIndex].description}</p>
                
                <div className="news-indicators">
                  {padelNews.map((_, index) => (
                    <span 
                      key={index}
                      className={`indicator ${index === currentNewsIndex ? 'active' : ''}`}
                      onClick={() => setCurrentNewsIndex(index)}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
            
            <button className="news-nav-btn next" onClick={nextNews}>
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
