import { YMaps, Map, Placemark, ZoomControl, GeolocationControl } from '@pbe/react-yandex-maps';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import axios from 'axios';

const Home = () => {
  // Состояние для открытия/закрытия дополнительного текста "Читать подробнее"
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-100">
      
      {/* ---- БЛОК С ГОРАМИ И ЗАГОЛОВКАМИ (HERO СЕКЦИЯ) ---- */}
      <div 
        className="container-fluid text-center d-flex flex-column justify-content-start align-items-center position-relative" 
        style={{ 
          backgroundImage: 'url("/bg.jpg")',
          backgroundColor: '#e8eedf',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '526px', 
          paddingTop: '80px', 
          paddingBottom: '80px',
          marginTop: '25px' 
        }}
      >
        <div style={{ maxWidth: '1000px', zIndex: 2 }}>
          <h1 
            className="mb-0 font-russkin" 
            style={{ 
              fontSize: '96px', 
              color: '#18442a',
              lineHeight: '100%',
              whiteSpace: 'nowrap' 
            }}
          >
            ПЕРЕРАБОТКА НАЧИНАЕТСЯ ЗДЕСЬ!
          </h1>
          
          <p 
            className="mx-auto" 
            style={{ 
              maxWidth: '551px', 
              fontSize: '24px',  
              lineHeight: '30px', 
              fontWeight: 400, 
              color: '#18442a',
              marginTop: '25px', 
              marginBottom: '0'
            }}
          >
            Выбирай пункт по рейтингу, делись опытом,<br/>изучай статьи и слушай эко-подкасты.
          </p>
          
          <div className="d-flex justify-content-center" style={{ marginTop: '50px' }}>
            <Link 
              to="/map" 
              className="text-decoration-none d-flex align-items-center justify-content-center shadow-sm" 
              style={{ 
                width: '316px',
                height: '40px',
                backgroundColor: '#18442a', 
                color: '#ffffff', 
                borderRadius: '40px',
                fontSize: '14px',
                fontWeight: 400,
                gap: '15px'
              }}
            >
              <span>Найти пункт приема вторсырья</span>
              <i className="bi bi-geo-alt"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* ---- БЛОК СТАТИСТИКИ ---- */}
      <div 
        className="container-fluid" 
        style={{ 
          backgroundColor: '#ffffff', 
          marginTop: '60px', 
          paddingLeft: '8%', 
          paddingRight: '8%' 
        }}
      >
        <div className="d-flex justify-content-between flex-wrap w-100 m-0">
          
          <div className="mb-4" style={{ width: '22%', minWidth: '180px' }}>
            <h2 className="m-0 font-russkin" style={{ fontSize: '2.5rem', color: '#18442a' }}>19. 1%</h2>
            <p className="mt-2" style={{ fontSize: '1rem', lineHeight: '1.4', color: '#18442a' }}>средний уровень<br/>переработки в мире</p>
          </div>
          
          <div className="mb-4" style={{ width: '22%', minWidth: '180px' }}>
            <h2 className="m-0 font-russkin" style={{ fontSize: '2.5rem', color: '#18442a' }}>31. 8%</h2>
            <p className="mt-2" style={{ fontSize: '1rem', lineHeight: '1.4', color: '#18442a' }}>утилизация отходов в России</p>
          </div>
          
          <div className="mb-4" style={{ width: '22%', minWidth: '180px' }}>
            <h2 className="m-0 font-russkin" style={{ fontSize: '2.5rem', color: '#18442a' }}>65 000+</h2>
            <p className="mt-2" style={{ fontSize: '1rem', lineHeight: '1.4', color: '#18442a' }}>пунктов приема вторсырья</p>
          </div>
          
          <div className="mb-4" style={{ width: '22%', minWidth: '180px' }}>
            <h2 className="m-0 font-russkin" style={{ fontSize: '2.5rem', color: '#18442a' }}>2. 3 МЛРД ТОНН</h2>
            <p className="mt-2" style={{ fontSize: '1rem', lineHeight: '1.4', color: '#18442a' }}>мировое образование ТКО<br/>в год</p>
          </div>
        </div>
        
        {/* ИСПРАВЛЕННЫЙ ТЕКСТ (С разворачиванием по клику) */}
        <div className="text-center mt-4 mb-5" style={{ transition: 'all 0.3s ease' }}>
          <p className="mb-3 mx-auto" style={{ fontSize: '1.1rem', color: '#18442a', maxWidth: '1000px', lineHeight: '1.6' }}>
            «ГдеСдать» — это сервис, который помогает найти ближайший пункт приема вторсырья.<br/>
            У нас есть отзывы, рейтинги, часы работы, а также статьи и подкасты об экологии.<br/>
            Всё, чтобы осознанная утилизация отходов стала простой привычкой.
            
            {/* Дополнительный текст, который показывается, если isExpanded === true */}
            {isExpanded && (
              <span className="d-block mt-3" style={{ animation: 'fadeIn 0.5s' }}>
                Мы собираем актуальную базу пунктов переработки по всей стране, проверяем информацию 
                и готовим обучающие материалы. Наша цель — объединить эко-активистов и новичков, 
                предоставив удобный инструмент для сортировки и утилизации мусора. Присоединяйтесь 
                к нашему сообществу, делитесь отзывами и делайте мир чище вместе с нами!
              </span>
            )}
          </p>
          <span 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ cursor: 'pointer', color: '#18442a', fontWeight: 700, fontSize: '1.1rem', userSelect: 'none' }}
          >
            {isExpanded ? 'Скрыть текст' : 'Читать подробнее'} <i className={`bi bi-chevron-${isExpanded ? 'up' : 'right'} ms-1`}></i>
          </span>
        </div>
      </div>

      {/* ---- БЛОК ПОПУЛЯРНОЕ ---- */}
      <div 
        className="container-fluid py-5" 
        style={{ 
          paddingLeft: '8%', 
          paddingRight: '8%', 
          backgroundColor: '#ffffff',
          borderTop: '1px solid #E7EFE8'
        }}
      >
        <h3 className="mb-4 font-russkin" style={{ fontSize: '2.2rem', color: '#3F3F3F' }}>ПОПУЛЯРНОЕ</h3>
        <div className="row">
          
          <div className="col-12 col-lg-4 mb-4">
            <div className="card h-100 border-0 p-3 d-flex flex-row" style={{ backgroundColor: '#f1f4e9', borderRadius: '20px' }}>
              <div style={{ width: '35%', borderRadius: '12px', backgroundColor: '#ddd', backgroundImage: 'url("/card1.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '120px' }}></div>
              <div className="card-body py-1 pe-0 ps-3 d-flex flex-column justify-content-between" style={{ width: '65%' }}>
                <div>
                  <h5 className="font-russkin mb-2" style={{ color: '#18442a', fontSize: '1.1rem', lineHeight: '1.2' }}>ШАГ К ЭКОЛОГИИ. СОРТИРОВКА МУСОРА</h5>
                  <p style={{ fontSize: '0.85rem', color: '#18442a', marginBottom: '0' }}>Правила, инструкции и полезные советы для новичков...</p>
                </div>
                {/* Исправлено: Заменили button на Link для перенаправления */}
                <Link to="/articles" className="btn bg-white rounded-pill align-self-start mt-3 px-3 py-1 shadow-sm text-decoration-none" style={{ fontSize: '0.85rem', color: '#18442a', fontWeight: 400 }}>
                  Читать &gt;
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 mb-4">
            <div className="card h-100 border-0 p-3 d-flex flex-row" style={{ backgroundColor: '#f1f4e9', borderRadius: '20px' }}>
              <div style={{ width: '35%', borderRadius: '12px', backgroundColor: '#ddd', backgroundImage: 'url("/card2.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '120px' }}></div>
              <div className="card-body py-1 pe-0 ps-3 d-flex flex-column justify-content-between" style={{ width: '65%' }}>
                <div>
                  <h5 className="font-russkin mb-2" style={{ color: '#18442a', fontSize: '1.1rem', lineHeight: '1.2' }}>КАК МОЯ СЕМЬЯ ОРГАНИЗОВАЛА РАЗДЕЛЬНЫЙ СБОР ОТХОДОВ</h5>
                  <p style={{ fontSize: '0.85rem', color: '#18442a', marginBottom: '0' }}>Как организовать сбор в квартире, научиться сортировать...</p>
                </div>
                {/* Исправлено: Заменили button на Link для перенаправления */}
                <Link to="/articles" className="btn bg-white rounded-pill align-self-start mt-3 px-3 py-1 shadow-sm text-decoration-none" style={{ fontSize: '0.85rem', color: '#18442a', fontWeight: 400 }}>
                  Слушать подкаст &gt;
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 mb-4">
            <div className="card h-100 border-0 p-3 d-flex flex-row" style={{ backgroundColor: '#f1f4e9', borderRadius: '20px' }}>
              <div style={{ width: '35%', borderRadius: '12px', backgroundColor: '#ddd', backgroundImage: 'url("/card3.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '120px' }}></div>
              <div className="card-body py-1 pe-0 ps-3 d-flex flex-column justify-content-between" style={{ width: '65%' }}>
                <div>
                  <h5 className="font-russkin mb-2" style={{ color: '#18442a', fontSize: '1.1rem', lineHeight: '1.2' }}>ВОЛНЫ ПОДНИМАЮТ ВОПРОСЫ</h5>
                  <p style={{ fontSize: '0.85rem', color: '#18442a', marginBottom: '0' }}>Эксперимент с рекультивацией загрязненных пляжей...</p>
                </div>
                {/* Исправлено: Заменили button на Link для перенаправления */}
                <Link to="/articles" className="btn bg-white rounded-pill align-self-start mt-3 px-3 py-1 shadow-sm text-decoration-none" style={{ fontSize: '0.85rem', color: '#18442a', fontWeight: 400 }}>
                  Читать &gt;
                </Link>
              </div>
            </div>
          </div>

        </div>
        <div className="text-center mt-4 mb-5">
          {/* Исправлено: Заменили span на Link для перенаправления */}
          <Link to="/articles" className="text-decoration-none" style={{ cursor: 'pointer', color: '#18442a', fontSize: '1.1rem'}}>
            Перейти ко всем статьям и подкастам
          </Link>
        </div>
      </div>

      {/* НОВЫЙ ПОДВАЛ (FOOTER) ПО МАКЕТУ */}
      <footer 
        className="w-100 d-flex justify-content-between align-items-center" 
        style={{ 
          height: '40px', 
          backgroundColor: '#F4F6E3', 
          paddingLeft: '80px', 
          paddingRight: '80px' 
        }}
      >
        <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700, fontFamily: 'Actay, sans-serif' }}>
          © 2026 «ГдеСдать»
        </div>
        <div style={{ color: '#FFFFFF', fontSize: '12px', fontWeight: 700, fontFamily: 'Actay, sans-serif' }}>
          Support: <a href="mailto:gdesdat@gmail.com" style={{ color: '#FFFFFF', textDecoration: 'none' }}>gdesdat@gmail.com</a>
        </div>
      </footer>

    </div>
  );
};

const MapPage = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Новые состояния для фильтров
  const [wastes, setWastes] = useState([]); // Список всех существующих типов мусора (для кнопок)
  const [activeFilter, setActiveFilter] = useState(null); // Текущий выбранный фильтр (null = "Все")

  useEffect(() => {
    // 1. Загружаем все точки
    fetch('http://127.0.0.1:8000/api/points/')
      .then(response => {
        if (!response.ok) throw new Error('Ошибка сети');
        return response.json();
      })
      .then(data => {
        setPoints(data);
        
        // 2. Извлекаем уникальные типы вторсырья из полученных точек
        // Проходим по всем точкам, собираем их accepted_waste в один массив и убираем дубликаты по имени
        const allWastes = [];
        const wasteNames = new Set();
        
        data.forEach(point => {
          if (point.accepted_waste) {
            point.accepted_waste.forEach(waste => {
              if (!wasteNames.has(waste.name)) {
                wasteNames.add(waste.name);
                allWastes.push(waste);
              }
            });
          }
        });
        
        setWastes(allWastes);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Фильтруем точки перед отрисовкой
  // Оставляем только те точки, у которых в accepted_waste есть мусор с именем activeFilter
  const filteredPoints = activeFilter 
    ? points.filter(point => 
        point.accepted_waste?.some(waste => waste.name === activeFilter)
      )
    : points; // Если фильтр не выбран, показываем все

  return (
    <div className="container-fluid mt-4 mb-5" style={{ height: '80vh', paddingLeft: '80px', paddingRight: '80px' }}>
      <h2 className="font-russkin mb-4" style={{ color: '#18442a', fontSize: '2.5rem' }}>КАРТА ПУНКТОВ ПРИЕМА</h2>
      
      {/* ПАНЕЛЬ ФИЛЬТРОВ */}
      {!loading && !error && wastes.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mb-3">
          <button 
            className={`btn rounded-pill px-4 shadow-sm ${activeFilter === null ? 'active-filter' : 'inactive-filter'}`}
            style={{
              backgroundColor: activeFilter === null ? '#18442a' : '#f1f4e9',
              color: activeFilter === null ? '#ffffff' : '#18442a',
              border: 'none',
              fontSize: '14px',
              fontWeight: activeFilter === null ? 700 : 400
            }}
            onClick={() => setActiveFilter(null)}
          >
            Все
          </button>
          
          {wastes.map(waste => (
            <button 
              key={waste.id || waste.name}
              className={`btn rounded-pill px-4 shadow-sm ${activeFilter === waste.name ? 'active-filter' : 'inactive-filter'}`}
              style={{
                backgroundColor: activeFilter === waste.name ? '#18442a' : '#f1f4e9',
                color: activeFilter === waste.name ? '#ffffff' : '#18442a',
                border: 'none',
                fontSize: '14px',
                fontWeight: activeFilter === waste.name ? 700 : 400
              }}
              onClick={() => setActiveFilter(waste.name)}
            >
              {waste.name}
            </button>
          ))}
        </div>
      )}

      {loading && <div className="text-center"><div className="spinner-border text-success"></div></div>}
      {error && <div className="alert alert-danger text-center mx-auto" style={{maxWidth: '600px'}}>{error}</div>}

      {!loading && !error && (
        <div className="w-100 shadow-sm rounded overflow-hidden" style={{ height: 'calc(100% - 100px)', border: '2px solid #E7EFE8', borderRadius: '20px' }}>
          <YMaps query={{ apikey: "cd6e05b5-779b-4303-b21c-f9534e4a4a39" }}>
            <Map 
              defaultState={{ 
                center: [55.751574, 37.573856],
                zoom: 10,
                controls: []
              }} 
              width="100%" 
              height="100%"
            >
              <ZoomControl options={{ float: "right" }} />
              <GeolocationControl options={{ float: "left" }} />

              {/* Отрисовываем уже отфильтрованный массив filteredPoints */}
              {filteredPoints.map((point) => {
                const lat = point.coordinates?.lat || point.latitude || point.coordinates?.[0];
                const lng = point.coordinates?.lng || point.longitude || point.coordinates?.[1];

                if (!lat || !lng) return null;

                const wasteTags = point.accepted_waste?.map(waste => 
                  `<span style="display: inline-block; background-color: #f1f4e9; color: #18442a; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-right: 4px; margin-bottom: 4px;">
                    ${waste.name}
                  </span>`
                ).join('') || 'Нет данных о вторсырье';

                return (
                  <Placemark 
                    key={point.id || point.name}
                    geometry={[parseFloat(lat), parseFloat(lng)]}
                    properties={{
                      balloonContentHeader: `<strong style="color: #18442a; font-size: 16px;">${point.name}</strong>`,
                      balloonContentBody: `
                        <div style="margin-bottom: 8px;">
                          <span style="color: #666; font-size: 13px;">Адрес:</span><br/>
                          <span style="font-size: 14px;">${point.address || 'Не указан'}</span>
                        </div>
                        <div>
                          <span style="color: #666; font-size: 13px; display: block; margin-bottom: 4px;">Принимают:</span>
                          ${wasteTags}
                        </div>
                      `,
                      hintContent: point.name
                    }}
                    options={{
                      preset: 'islands#darkGreenIcon',
                    }}
                    modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
                  />
                );
              })}
            </Map>
          </YMaps>
        </div>
      )}
    </div>
  );
};

const Login = () => <div className="container-fluid mt-5 text-center"><h1>Вход</h1></div>;
const Profile = () => <div className="container-fluid mt-5 text-center"><h1>Личный кабинет</h1></div>;
const Articles = () => <div className="container-fluid mt-5 text-center"><h1>Статьи и подкасты</h1></div>;

// ---- НАВИГАЦИЯ (ШАПКА) ----
const CustomNavbar = () => {
  const location = useLocation();
  
  return (
    <nav 
      className="w-100 d-flex justify-content-between align-items-center bg-white position-sticky top-0" 
      style={{ 
        zIndex: 1000, 
        paddingTop: '18px', 
        paddingBottom: '18px',
        paddingLeft: '80px', 
        paddingRight: '80px', 
      }}
    >
      <div className="d-flex align-items-center">
        <img src="/logo.jpg" alt="Логотип" style={{ width: '51px', height: '55px', objectFit: 'contain' }} />
      </div>
      
      <div 
        className="d-flex align-items-center justify-content-between" 
        style={{ 
          width: '503px', 
          height: '40px', 
          backgroundColor: '#f1f4e9', 
          borderRadius: '40px', 
          padding: '4px' 
        }}
      >
        <Link 
          to="/" 
          className={`text-decoration-none h-100 d-flex align-items-center justify-content-center flex-grow-1 ${location.pathname === '/' ? 'text-white' : 'text-dark'}`} 
          style={{ 
            backgroundColor: location.pathname === '/' ? '#18442a' : 'transparent', 
            borderRadius: '40px',
            fontSize: '14px',
            fontWeight: location.pathname === '/' ? 700 : 400 
          }}
        >
          Главная
        </Link>
        <Link 
          to="/map" 
          className={`text-decoration-none h-100 d-flex align-items-center justify-content-center flex-grow-1 ${location.pathname === '/map' ? 'text-white' : 'text-dark'}`} 
          style={{ 
            backgroundColor: location.pathname === '/map' ? '#18442a' : 'transparent', 
            borderRadius: '40px',
            fontSize: '14px',
            fontWeight: location.pathname === '/map' ? 700 : 400 
          }}
        >
          Карта пунктов приема
        </Link>
        <Link 
          to="/articles" 
          className={`text-decoration-none h-100 d-flex align-items-center justify-content-center flex-grow-1 ${location.pathname === '/articles' ? 'text-white' : 'text-dark'}`} 
          style={{ 
            backgroundColor: location.pathname === '/articles' ? '#18442a' : 'transparent', 
            borderRadius: '40px',
            fontSize: '14px',
            fontWeight: location.pathname === '/articles' ? 700 : 400 
          }}
        >
          Статьи и подкасты
        </Link>
      </div>

      {/* Исправлено: Добавлена логика выделения для кнопки Личный кабинет */}
      <Link 
        to="/profile" 
        className={`text-decoration-none d-flex align-items-center justify-content-center ${location.pathname === '/profile' ? 'text-white' : 'text-dark'}`} 
        style={{ 
          backgroundColor: location.pathname === '/profile' ? '#18442a' : '#F4F6E3', 
          borderRadius: '40px',
          height: '41px',
          paddingLeft: '30px',
          paddingRight: '30px',
          fontSize: '14px',
          fontWeight: location.pathname === '/profile' ? 700 : 400 
        }}
      >
        Личный кабинет
      </Link>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <CustomNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;