import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import axios from 'axios';

const Home = () => (
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

    {/* ---- БЛОК СТАТИСТИКИ (ВЫРОВНЯН ПОД КАРТОЧКИ ПОПУЛЯРНОГО) ---- */}
    <div 
      className="container-fluid" 
      style={{ 
        backgroundColor: '#ffffff', 
        marginTop: '60px', 
        paddingLeft: '8%', // Точно как у "ПОПУЛЯРНОЕ"
        paddingRight: '8%' // Точно как у "ПОПУЛЯРНОЕ"
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
      
      {/* ИСПРАВЛЕННЫЙ ТЕКСТ (теперь ровно 3 строки) */}
      <div className="text-center mt-4 mb-5">
        <p className="mb-3 mx-auto" style={{ fontSize: '1.1rem', color: '#18442a', maxWidth: '1000px', lineHeight: '1.6' }}>
          «ГдеСдать» — это сервис, который помогает найти ближайший пункт приема вторсырья.<br/>
          У нас есть отзывы, рейтинги, часы работы, а также статьи и подкасты об экологии.<br/>
          Всё, чтобы осознанная утилизация отходов стала простой привычкой.
        </p>
        <span style={{ cursor: 'pointer', color: '#18442a', fontWeight: 700, fontSize: '1.1rem' }}>
          Читать подробнее <i className="bi bi-chevron-right ms-1"></i>
        </span>
      </div>
    </div>

    {/* ---- БЛОК ПОПУЛЯРНОЕ (ДОБАВЛЕНА ПОЛОСА #E7EFE8) ---- */}
    <div 
      className="container-fluid py-5" 
      style={{ 
        paddingLeft: '8%', 
        paddingRight: '8%', 
        backgroundColor: '#ffffff',
        borderTop: '1px solid #E7EFE8' // Добавлена линия цвета #E7EFE8
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
              <button className="btn bg-white rounded-pill align-self-start mt-3 px-3 py-1 shadow-sm" style={{ fontSize: '0.85rem', color: '#18442a', fontWeight: 400 }}>Читать &gt;</button>
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
              <button className="btn bg-white rounded-pill align-self-start mt-3 px-3 py-1 shadow-sm" style={{ fontSize: '0.85rem', color: '#18442a', fontWeight: 400 }}>Слушать подкаст &gt;</button>
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
              <button className="btn bg-white rounded-pill align-self-start mt-3 px-3 py-1 shadow-sm" style={{ fontSize: '0.85rem', color: '#18442a', fontWeight: 400 }}>Читать &gt;</button>
            </div>
          </div>
        </div>

      </div>
      <div className="text-center mt-4 mb-5">
        <span style={{ cursor: 'pointer', color: '#18442a', fontSize: '1.1rem' }}>Перейти ко всем статьям и подкастам</span>
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

const MapPage = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Используем axios вместо fetch
    axios.get('http://127.0.0.1:8000/api/points/')
      .then(response => {
        console.log('Данные от бэкенда:', response.data);
        setPoints(response.data); // В axios данные лежат в свойстве .data
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
        // Красиво выводим текст ошибки
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container-fluid mt-5 text-center" style={{ minHeight: '60vh' }}>
      <h2 className="font-russkin mb-4" style={{ color: '#18442a' }}>ПУНКТЫ ПРИЕМА (ТЕСТ API)</h2>
      
      {loading && <div className="spinner-border text-success" role="status"><span className="visually-hidden">Загрузка...</span></div>}
      
      {error && (
        <div className="alert alert-danger mx-auto" style={{ maxWidth: '600px' }}>
          <strong>Ошибка связи с бэкендом:</strong> {error}
          <br/>Убедитесь, что сервер Django запущен на порту 8000.
        </div>
      )}
      
      {!loading && !error && (
        <div className="d-flex flex-wrap justify-content-center gap-4 mt-4">
          {points.length === 0 ? (
            <p>Пунктов пока нет. Добавьте их через админку Django!</p>
          ) : (
            points.map((point) => (
              <div key={point.id} className="card p-4 shadow-sm border-0" style={{ width: '350px', textAlign: 'left', borderRadius: '20px', backgroundColor: '#f1f4e9' }}>
                <h5 className="font-russkin" style={{ color: '#18442a', fontSize: '1.2rem' }}>
                  {point.name || 'Название пункта'}
                </h5>
                <p className="mb-2" style={{ fontSize: '0.9rem', color: '#18442a' }}>
                  <strong>Адрес:</strong> {point.address || 'Адрес не указан'}
                </p>
                {point.latitude && point.longitude && (
                  <p className="mb-3" style={{ fontSize: '0.8rem', color: '#666' }}>
                    Координаты: {point.latitude}, {point.longitude}
                  </p>
                )}
                
                <div className="mt-auto p-2" style={{ backgroundColor: '#e8eedf', borderRadius: '10px', fontSize: '0.75rem', overflowX: 'auto' }}>
                  <pre className="m-0" style={{ color: '#18442a' }}>
                    {JSON.stringify(point, null, 2)}
                  </pre>
                </div>
              </div>
            ))
          )}
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

      <Link 
        to="/profile" 
        className="text-decoration-none text-dark d-flex align-items-center justify-content-center" 
        style={{ 
          backgroundColor: '#F4F6E3', 
          borderRadius: '40px',
          height: '41px',
          paddingLeft: '30px',
          paddingRight: '30px',
          fontSize: '14px',
          fontWeight: 400 
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