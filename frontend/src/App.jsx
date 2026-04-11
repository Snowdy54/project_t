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
        <div style={{ color: '#18442a', fontSize: '12px', fontWeight: 700, fontFamily: 'Actay, sans-serif' }}>
          © 2026 «ГдеСдать»
        </div>
        <div style={{ color: '#18442a', fontSize: '12px', fontWeight: 700, fontFamily: 'Actay, sans-serif' }}>
          Support: <a href="mailto:gdesdat@gmail.com" style={{ color: '#18442a', textDecoration: 'none' }}>gdesdat@gmail.com</a>
        </div>
      </footer>

    </div>
  );
};

const MapPage = () => {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeFilters, setActiveFilters] = useState([]); 
  const [appliedFilters, setAppliedFilters] = useState([]);
  
  const [selectedPointData, setSelectedPointData] = useState(null); 
  
  // Состояния для обработки ошибки загрузки карты
  const [mapError, setMapError] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const [priceFilter, setPriceFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const wasteCategories = [
    { id: 'plastic', name: 'Пластик', icon: '/icons/plastic.png', color: '#CDE5FD' },
    { id: 'paper', name: 'Бумага', icon: '/icons/paper.png', color: '#FFC8C8' },
    { id: 'glass', name: 'Стекло', icon: '/icons/glass.png', color: '#BDE4C2' },
    { id: 'caps', name: 'Крышки', icon: '/icons/caps.png', color: '#F8F6B7' },
    { id: 'metal', name: 'Металл', icon: '/icons/metall.png', color: '#C4C2FF' },
    { id: 'electro', name: 'Электроника', icon: '/icons/electronics.png', color: '#F1E6C7' },
    { id: 'lamps', name: 'Лампочки', icon: '/icons/bulb.png', color: '#C5F2EC' },
    { id: 'textile', name: 'Текстиль', icon: '/icons/textiles.png', color: '#FDD8DF' },
    { id: 'danger', name: 'Опасные отходы', icon: '/icons/toxic waste.png', color: '#FF9797' },
    { id: 'battery', name: 'Батарейки', icon: '/icons/batteries.png', color: '#CAFC92' },
    { id: 'other_waste', name: 'Другое', icon: '/icons/another.png', color: '#E4D5FF' },
  ];

  const reduceCategories = [
    { id: 'food', name: 'Еда', icon: '/icons/foods.png', color: '#C7F8C4' },
    { id: 'drinks', name: 'Напитки', icon: '/icons/drinks.png', color: '#C4EDFF' },
    { id: 'products', name: 'Продукты', icon: '/icons/products.png', color: '#FFCCAB' },
    { id: 'clothes', name: 'Одежда', icon: '/icons/clothes.png', color: '#FFBCDD' },
    { id: 'books', name: 'Книги', icon: '/icons/books.png', color: '#FFF695' },
    { id: 'other_reduce', name: 'Другое', icon: '/icons/another.png', color: '#D0CAFC' },
  ];

  const allCategories = [...wasteCategories, ...reduceCategories];

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/points/')
      .then(res => res.json())
      .then(data => { setPoints(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  // ГАРАНТИРОВАННАЯ ПРОВЕРКА ЗАГРУЗКИ КАРТЫ
  useEffect(() => {
    // Ждем ровно 5 секунд. Если isMapLoaded все еще false - значит скрипт не загрузился
    const timeout = setTimeout(() => {
      if (!isMapLoaded) {
        setMapError(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isMapLoaded]); 

  const handleRetryMap = () => {
    // Принудительно перезагружаем страницу при клике на "Повторить попытку"
    window.location.reload();
  };

  const toggleFilter = (id) => {
    setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredPoints = appliedFilters.length > 0 
    ? points.filter(point => {
        const activeNames = appliedFilters.map(id => allCategories.find(c => c.id === id)?.name);
        return activeNames.some(name => point.accepted_waste?.some(w => w.name === name));
      })
    : points;

  const getPointsWord = (number) => {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "ТОЧЕК";
    if (lastDigit === 1) return "ТОЧКА";
    if (lastDigit >= 2 && lastDigit <= 4) return "ТОЧКИ";
    return "ТОЧЕК"; 
  };

  const getFoundWord = (number) => {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return "НАЙДЕНО";
    if (lastDigit === 1) return "НАЙДЕНА";
    return "НАЙДЕНО";
  };

  const handlePointClick = (point) => {
    setSelectedPointData(point);
  };

  return (
    <div className="d-flex flex-column" style={{ height: 'calc(100vh - 80px)', backgroundColor: '#f1f4e9' }}>
      
      <div className="d-flex flex-grow-1" style={{ borderTop: '1px solid #E7EFE8', overflow: 'hidden' }}>
        
        {/* ЛЕВЫЙ САЙДБАР */}
        <div className="bg-white d-flex flex-column" style={{ width: '400px', minWidth: '400px', height: '100%', overflowY: 'auto', padding: '24px 32px', zIndex: 2 }}>
          
          <div className="position-relative mb-4 mt-2">
            <input type="text" className="form-control rounded-pill pe-5" placeholder="Поиск пунктов приема" style={{ borderColor: '#ccc', fontSize: '14px' }} />
            <i className="bi bi-search position-absolute" style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}></i>
          </div>

          <h4 className="font-russkin mb-3 mt-1" style={{ color: '#18442a', fontSize: '37px', marginLeft: '8px' }}>СДАТЬ ВТОРСЫРЬЕ</h4>
          <div className="row g-3 mb-4">
            {wasteCategories.map(cat => (
              <div className="col-3 text-center px-1 d-flex flex-column align-items-center" key={cat.id}>
                <div 
                  onClick={() => toggleFilter(cat.id)}
                  className="d-flex align-items-center justify-content-center mx-auto mb-1"
                  style={{ width: '56px', height: '56px', backgroundColor: activeFilters.includes(cat.id) ? cat.color : '#F4F6E3', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }}
                >
                  <img src={cat.icon} alt={cat.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#18442a', lineHeight: '1.2', textAlign: 'center', width: '100%' }}>{cat.name}</span>
              </div>
            ))}
          </div>

          <h4 className="font-russkin mb-3" style={{ color: '#18442a', fontSize: '37px', marginLeft: '8px' }}>СНИЗИТЬ ОТХОДЫ</h4>
          <div className="row g-3 mb-4">
            {reduceCategories.map(cat => (
              <div className="col-3 text-center px-1 d-flex flex-column align-items-center" key={cat.id}>
                <div 
                  onClick={() => toggleFilter(cat.id)}
                  className="d-flex align-items-center justify-content-center mx-auto mb-1"
                  style={{ width: '56px', height: '56px', backgroundColor: activeFilters.includes(cat.id) ? cat.color : '#F4F6E3', border: 'none', borderRadius: '12px', cursor: 'pointer', transition: '0.2s' }}
                >
                  <img src={cat.icon} alt={cat.name} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#18442a', lineHeight: '1.2', textAlign: 'center', width: '100%' }}>{cat.name}</span>
              </div>
            ))}
          </div>

          {/* НОВЫЙ ДИЗАЙН СЕЛЕКТОВ С Идеально выровненной галочкой */}
          <div className="d-flex gap-3 mb-3 mt-2">
            
            {/* СЕЛЕКТ "ЦЕНА" */}
            <div className="flex-grow-1 position-relative">
              <div 
                className="d-flex justify-content-between align-items-center rounded-pill px-3"
                onClick={() => { setIsPriceOpen(!isPriceOpen); setIsTimeOpen(false); }}
                style={{
                  height: '35px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  backgroundColor: '#F4F6E3', color: '#18442a'
                }}
              >
                <span>Цена</span>
                {priceFilter && priceFilter !== 'Без выбора' ? (
                  <i className="bi bi-x-lg" style={{ fontSize: '10px' }} onClick={(e) => { e.stopPropagation(); setPriceFilter(''); }}></i>
                ) : (
                  <i className={`bi bi-chevron-${isPriceOpen ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
                )}
              </div>
              
              {isPriceOpen && (
                <div className="position-absolute w-100 shadow-sm" style={{ top: '40px', zIndex: 10, backgroundColor: '#F4F6E3', borderRadius: '8px', overflow: 'hidden' }}>
                  {['Без выбора', 'Лучшая цена'].map(option => {
                    const isSelected = priceFilter === option;
                    return (
                      <div 
                        key={option} 
                        onClick={() => { setPriceFilter(option); setIsPriceOpen(false); }}
                        onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#EBEDDD' }}
                        onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#F4F6E3' }}
                        className="position-relative"
                        style={{ 
                          padding: '8px 16px', fontSize: '13px', cursor: 'pointer', transition: '0.1s',
                          backgroundColor: isSelected ? '#18442a' : '#F4F6E3',
                          color: isSelected ? '#ffffff' : '#18442a',
                          textAlign: 'center'
                        }}
                      >
                        {option}
                        {isSelected && (
                          <i className="bi bi-check2 position-absolute" style={{ fontSize: '16px', right: '12px', top: '50%', transform: 'translateY(-50%)', marginTop: '2px' }}></i>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* СЕЛЕКТ "ВРЕМЯ РАБОТЫ" */}
            <div className="flex-grow-1 position-relative">
              <div 
                className="d-flex justify-content-between align-items-center rounded-pill px-3"
                onClick={() => { setIsTimeOpen(!isTimeOpen); setIsPriceOpen(false); }}
                style={{
                  height: '35px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  backgroundColor: '#F4F6E3', color: '#18442a'
                }}
              >
                <span>Время работы</span>
                {timeFilter && timeFilter !== 'Без выбора' ? (
                  <i className="bi bi-x-lg" style={{ fontSize: '10px' }} onClick={(e) => { e.stopPropagation(); setTimeFilter(''); }}></i>
                ) : (
                  <i className={`bi bi-chevron-${isTimeOpen ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
                )}
              </div>
              
              {isTimeOpen && (
                <div className="position-absolute w-100 shadow-sm" style={{ top: '40px', zIndex: 10, backgroundColor: '#F4F6E3', borderRadius: '8px', overflow: 'hidden' }}>
                  {['Без выбора', 'Круглосуточно', 'Открыто'].map(option => {
                    const isSelected = timeFilter === option;
                    return (
                      <div 
                        key={option} 
                        onClick={() => { setTimeFilter(option); setIsTimeOpen(false); }}
                        onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#EBEDDD' }}
                        onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#F4F6E3' }}
                        className="position-relative"
                        style={{ 
                          padding: '8px 16px', fontSize: '13px', cursor: 'pointer', transition: '0.1s',
                          backgroundColor: isSelected ? '#18442a' : '#F4F6E3',
                          color: isSelected ? '#ffffff' : '#18442a',
                          textAlign: 'center'
                        }}
                      >
                        {option}
                        {isSelected && (
                          <i className="bi bi-check2 position-absolute" style={{ fontSize: '16px', right: '12px', top: '50%', transform: 'translateY(-50%)', marginTop: '2px' }}></i>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>

          <button className="btn w-100 rounded-pill mb-4 mt-2" style={{ backgroundColor: '#18442a', color: 'white', fontWeight: 500 }} onClick={() => setAppliedFilters(activeFilters)}>
            Применить
          </button>

          <h4 className="font-russkin mb-3" style={{ color: '#18442a', fontSize: '37px', textTransform: 'uppercase', marginLeft: '8px' }}>
            {filteredPoints.length === 0 ? "ТОЧКИ НЕ НАЙДЕНЫ" : `${getFoundWord(filteredPoints.length)} ${filteredPoints.length} ${getPointsWord(filteredPoints.length)}`}
          </h4>
          
          <div style={{ borderBottom: '1px solid #dee2e6', marginBottom: '16px' }}></div>
          
          <div className="d-flex flex-column gap-3">
            {filteredPoints.length === 0 ? (
              <p style={{ color: '#666', fontSize: '13px', marginLeft: '8px' }}>Нет подходящих точек. Попробуйте изменить фильтры.</p>
            ) : (
              filteredPoints.map(point => (
                <div 
                  key={point.id} className="border-bottom pb-3" onClick={() => handlePointClick(point)} 
                  style={{ cursor: 'pointer', opacity: selectedPointData?.id && selectedPointData.id !== point.id ? 0.6 : 1 }}
                >
                  <div className="d-flex gap-2 mb-2 flex-wrap">
                    {point.accepted_waste?.map(w => {
                      const catData = allCategories.find(c => c.name === w.name);
                      return (
                        <span key={w.id} style={{ backgroundColor: catData ? catData.color : '#f1f4e9', color: '#666', fontSize: '11px', padding: '4px 12px', borderRadius: '12px' }}>
                          {w.name}
                        </span>
                      )
                    })}
                  </div>
                  <h6 className="mb-1" style={{ color: '#18442a', fontSize: '15px', fontWeight: 700 }}>{point.name}</h6>
                  <p className="mb-1" style={{ fontSize: '12px', color: '#A0A0A0' }}>{point.address || 'Адрес не указан'}</p>
                  <span style={{ fontSize: '11px', color: '#FF9797' }}>Закрыто</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ - КОНТЕЙНЕР КАРТЫ */}
        <div className="flex-grow-1 position-relative d-flex" style={{ backgroundColor: '#F4F6E3' }}>
          
          {/* ВЫЕЗЖАЮЩАЯ ДЕТАЛЬНАЯ ПАНЕЛЬ ПУНКТА */}
          {selectedPointData && (
            <div className="bg-white position-absolute h-100 shadow" style={{ left: 0, top: 0, width: '480px', zIndex: 1000, overflowY: 'auto', padding: '32px' }}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h3 className="font-russkin m-0" style={{ color: '#18442a', fontSize: '28px', textTransform: 'uppercase' }}>ПУНКТ ПРИЕМА: {selectedPointData.name}</h3>
                <i className="bi bi-x-lg" style={{ cursor: 'pointer', fontSize: '24px', color: '#18442a' }} onClick={() => setSelectedPointData(null)}></i>
              </div>
              <div className="d-flex gap-2 mb-3 flex-wrap">
                {selectedPointData.accepted_waste?.map(w => {
                  const catData = allCategories.find(c => c.name === w.name);
                  return (
                    <span key={w.id} style={{ backgroundColor: catData ? catData.color : '#f1f4e9', color: '#666', fontSize: '12px', padding: '6px 14px', borderRadius: '12px' }}>{w.name}</span>
                  )
                })}
              </div>
              <div className="w-100 mb-2 rounded" style={{ height: '220px', backgroundColor: '#e9ecef', backgroundImage: 'url(https://via.placeholder.com/480x220?text=Фото+пункта)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div className="d-flex gap-3 mb-4" style={{ fontSize: '13px', color: '#666' }}>
                <span><i className="bi bi-hand-thumbs-up me-1"></i> 122</span>
                <span><i className="bi bi-hand-thumbs-down me-1"></i> 0</span>
              </div>
              <div className="d-flex flex-column gap-3 mb-4">
                <div>
                  <h6 style={{ color: '#18442a', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="bi bi-geo-alt-fill"></i> АДРЕС</h6>
                  <p className="mb-0 ms-4" style={{ fontSize: '13px', color: '#666' }}>{selectedPointData.address || 'ул. Чайковского, 82а'}</p>
                </div>
                <div>
                  <h6 style={{ color: '#18442a', fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="bi bi-clock-fill"></i> РЕЖИМ РАБОТЫ</h6>
                  <div className="ms-4" style={{ fontSize: '13px', color: '#666', lineHeight: '1.4' }}>понедельник: 16:00 - 19:00<br/>вторник: 16:00 - 19:00<br/>среда: 16:00 - 19:00<br/>воскресенье: 10:00 - 16:00</div>
                </div>
              </div>
              <h6 style={{ color: '#18442a', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase' }}>ОПИСАНИЕ</h6>
              <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '24px' }}>Наша компания принимает макулатуру, пластик и плёнку на самых выгодных условиях. Вывоз макулатуры в Екатеринбурге. Сохраним экологию вместе.</p>
              <h6 style={{ color: '#18442a', fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', marginBottom: '16px' }}>КОММЕНТАРИИ</h6>
              <div className="d-flex flex-column gap-3 mb-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <div className="rounded-circle" style={{ width: '28px', height: '28px', backgroundColor: '#F4F6E3' }}></div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#18442a', fontWeight: 600 }}>Брэд Питт</div>
                      <div style={{ fontSize: '10px', color: '#A0A0A0' }}>11 апреля 2026</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#666', margin: 0, paddingLeft: '36px' }}>Правило номер один: не говорить о приёме вторсырья.</p>
                </div>
              </div>
              <button className="btn w-100 rounded-pill" style={{ backgroundColor: '#F4F6E3', color: '#18442a', fontSize: '13px', fontWeight: 500 }}>Оставить комментарий</button>
            </div>
          )}

          {/* ЭКРАН ОШИБКИ */}
          {mapError ? (
            <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100 position-absolute" style={{ zIndex: 10, backgroundColor: '#EFEFEF' }}>
              <p className="text-center" style={{ color: '#000000', fontSize: '16px', fontWeight: 500 }}>
                Не удалось загрузить карту.<br/>Проверьте соединение.
              </p>
              <button 
                className="btn rounded-pill mt-2 px-4 shadow-sm" 
                style={{ backgroundColor: '#18442a', color: 'white', fontSize: '14px' }} 
                onClick={handleRetryMap}
              >
                Повторить попытку
              </button>
            </div>
          ) : null}

          {/* КОМПОНЕНТ КАРТЫ */}
          <YMaps query={{ apikey: "cd6e05b5-779b-4303-b21c-f9534e4a4a39" }}>
            <Map 
              defaultState={{ center: [55.751574, 37.573856], zoom: 10, controls: [] }} 
              width="100%" 
              height="100%" 
              onLoad={() => {
                setIsMapLoaded(true); 
                setMapError(false);
              }}
            >
              <ZoomControl options={{ position: { right: 20, top: 80 } }} />
              <GeolocationControl options={{ position: { right: 20, top: 40 } }} />

              <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000 }}>
                <button className="btn rounded-pill px-4 shadow" style={{ backgroundColor: '#18442a', color: 'white', fontSize: '14px' }}>Добавить точку +</button>
              </div>

              {filteredPoints.map((point) => {
                const lat = point.coordinates?.lat || point.latitude || point.coordinates?.[0];
                const lng = point.coordinates?.lng || point.longitude || point.coordinates?.[1];
                if (!lat || !lng) return null;

                const isSelected = selectedPointData && selectedPointData.id === point.id;
                
                return (
                  <Placemark 
                    key={point.id}
                    geometry={[parseFloat(lat), parseFloat(lng)]}
                    properties={{ 
                      balloonContentHeader: point.name,
                      iconCaption: isSelected ? point.name : ''
                    }}
                    options={{ 
                      iconLayout: 'default#image',
                      iconImageHref: isSelected ? '/icons/marker-filled.png' : '/icons/marker-outline.png',
                      iconImageSize: [40, 40],
                      iconImageOffset: [-20, -40], 
                    }}
                    onClick={() => handlePointClick(point)}
                    modules={['geoObject.addon.balloon']}
                  />
                );
              })}
            </Map>
          </YMaps>
        </div>
      </div>

      <footer className="w-100 d-flex justify-content-between align-items-center" style={{ height: '40px', backgroundColor: '#F4F6E3', paddingLeft: '80px', paddingRight: '80px', flexShrink: 0 }}>
        <div style={{ color: '#18442a', fontSize: '12px', fontWeight: 700, fontFamily: 'Actay, sans-serif' }}>© 2026 «ГдеСдать»</div>
        <div style={{ color: '#18442a', fontSize: '12px', fontWeight: 700, fontFamily: 'Actay, sans-serif' }}>Support: <a href="mailto:gdesdat@gmail.com" style={{ color: '#18442a', textDecoration: 'none' }}>gdesdat@gmail.com</a></div>
      </footer>
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