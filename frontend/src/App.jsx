import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Временные заглушки для страниц (позже мы вынесем их в отдельные файлы)
const Home = () => (
  <>
    {/* Главный баннер */}
    <div 
      className="container-fluid py-5 text-center text-dark" 
      style={{ background: 'linear-gradient(to bottom, #f8f9fa, #d4edda)', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
    >
      <div className="container">
        <h1 className="display-4 fw-bold mb-4">Найдите ближайший пункт приема вторсырья</h1>
        <p className="lead mb-4">Сделайте свой вклад в экологию. Сдавайте перерабатываемые отходы быстро и удобно.</p>
        <Link to="/map" className="btn btn-success btn-lg px-5 rounded-pill shadow-sm">
          Найти пункты приема <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </div>

    {/* Блок статистики */}
    <div className="container my-5">
      <div className="row text-center border-bottom pb-4 mb-4">
        <div className="col-md-3">
          <h2 className="fw-bold">66%</h2>
          <p className="text-muted">перерабатывается</p>
        </div>
        <div className="col-md-3">
          <h2 className="fw-bold">200+</h2>
          <p className="text-muted">пунктов приема</p>
        </div>
        <div className="col-md-3">
          <h2 className="fw-bold">120 000+</h2>
          <p className="text-muted">пользователей</p>
        </div>
        <div className="col-md-3">
          <h2 className="fw-bold">15 млрд</h2>
          <p className="text-muted">спасенных деревьев</p>
        </div>
      </div>
    </div>

    {/* Блок Популярное */}
    <div className="container my-5">
      <h3 className="mb-4">Популярные статьи</h3>
      <div className="row">
        {[1, 2, 3].map((item) => (
          <div className="col-md-4 mb-4" key={item}>
            <div className="card h-100 border-0 shadow-sm bg-light">
              <div className="card-body" style={{ minHeight: '150px' }}>
                <h5 className="card-title text-secondary">Название статьи {item}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

const MapPage = () => <div className="container mt-5"><h1>Карта</h1></div>;
const Login = () => <div className="container mt-5"><h1>Вход</h1></div>;
const Profile = () => <div className="container mt-5"><h1>Личный кабинет</h1></div>;

function App() {
  return (
    <Router>
      {/* Временное меню (Navbar) на базе Bootstrap */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Эко-Проект</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/">Главная</Link>
            <Link className="nav-link" to="/map">Карта</Link>
            <Link className="nav-link" to="/profile">ЛК</Link>
            <Link className="nav-link" to="/login">Войти</Link>
          </div>
        </div>
      </nav>

      {/* Сами маршруты */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}


export default App;
