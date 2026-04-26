import { YMaps, Map, Placemark, ZoomControl, GeolocationControl } from '@pbe/react-yandex-maps';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import { authService } from './api/services';
import Login from './Login';
import Register from './Register'; 

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
        {/* ИСПРАВЛЕННЫЙ ХОВЕР С ПЛАВНОЙ СТРЕЛОЧКОЙ */}
        <style>
          {`
            .articles-link {
              display: inline-flex;
              align-items: center;
              transition: all 0.3s ease;
            }
            .articles-link img {
              max-width: 0;
              opacity: 0;
              margin-left: 0;
              transition: all 0.3s ease;
              overflow: hidden;
            }
            .articles-link:hover img {
              max-width: 24px;
              opacity: 1;
              margin-left: 8px;
            }
          `}
        </style>
        <div className="text-center mt-4 mb-5">
          <Link 
            to="/articles" 
            className="text-decoration-none articles-link" 
            style={{ cursor: 'pointer', color: '#18442a', fontSize: '1.1rem', fontWeight: 500 }}
          >
            <span>Перейти ко всем статьям и подкастам</span>
            <img src="/icons/arrow-right.png" alt="->" style={{ height: '16px' }} />
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
          «ГдеСдать» © 2026
        </div>
        <div style={{ color: '#18442a', fontSize: '12px', fontWeight: 700, fontFamily: 'Actay, sans-serif' }}>
          Support: <a href="mailto:gdesdat@gmail.com" style={{ color: '#18442a', textDecoration: 'none' }}>gdesdat@gmail.com</a>
        </div>
      </footer>

    </div>
  );
};

// ----------------------------------------------------
// Компонент одного комментария (без лайков)
// ----------------------------------------------------
const CommentItem = ({ comment }) => {
  return (
    <div className="d-flex flex-column gap-2 mb-3">
      <div className="d-flex align-items-center gap-2 mb-1">
        <div className="rounded-circle" style={{ width: '28px', height: '28px', backgroundColor: '#F4F6E3' }}></div>
        <div>
          <div style={{ fontSize: '13px', color: '#18442a', fontWeight: '600' }}>{comment.authorName}</div>
          <div style={{ fontSize: '10px', color: '#18442A' }}>{comment.date}</div>
        </div>
      </div>
      <p style={{ fontSize: '13px', color: '#18442A', margin: 0, paddingLeft: '36px' }}>
        {comment.text}
      </p>
    </div>
  );
};

// ----------------------------------------------------
// Кэш для сохранения данных формы при закрытии панели
// ----------------------------------------------------
let addPointCache = {
  formData: { name: '', address: '', description: '', moderatorEmail: '', site: '', phone: '', links: '', scheduleType: 'everyday' },
  selectedTypes: [],
  prices: {},
  scheduleBlocks: [{ id: Date.now(), days: [], openTime: '', closeTime: '', hasBreak: false, breakStart: '', breakEnd: '', isDropdownOpen: false }],
  selectedFiles: []
};

// ----------------------------------------------------
// Компонент формы добавления новой точки
// ----------------------------------------------------
const AddPointPanel = ({ onClose, wasteCategories = [], reduceCategories = [], allCategories = [] }) => {
  const categoriesSafe = allCategories.length > 0 ? allCategories : [...wasteCategories, ...reduceCategories];

  const [activeTab, setActiveTab] = useState('waste');
  
  // Инициализируем состояния из нашего вечного кэша
  const [formData, setFormData] = useState(addPointCache.formData);
  const [selectedTypes, setSelectedTypes] = useState(addPointCache.selectedTypes);
  const [prices, setPrices] = useState(addPointCache.prices);
  const [scheduleBlocks, setScheduleBlocks] = useState(addPointCache.scheduleBlocks);
  const [selectedFiles, setSelectedFiles] = useState(addPointCache.selectedFiles);

  const [errors, setErrors] = useState({});
  const nameRef = React.useRef(null);
  const addressRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const daysOfWeek = ['Ежедневно', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

  // Сохраняем любое изменение в кэш
  useEffect(() => {
    addPointCache = { formData, selectedTypes, prices, scheduleBlocks, selectedFiles };
  }, [formData, selectedTypes, prices, scheduleBlocks, selectedFiles]);

  // Функция для полной очистки формы
  const clearCacheAndClose = () => {
    addPointCache = {
      formData: { name: '', address: '', description: '', moderatorEmail: '', site: '', phone: '', links: '', scheduleType: 'everyday' },
      selectedTypes: [],
      prices: {},
      scheduleBlocks: [{ id: Date.now(), days: [], openTime: '', closeTime: '', hasBreak: false, breakStart: '', breakEnd: '', isDropdownOpen: false }],
      selectedFiles: []
    };
    onClose();
  };

  const handleFileClick = () => { if (fileInputRef.current) fileInputRef.current.click(); };
  const handleFileChange = (e) => { if (e.target.files?.length > 0) setSelectedFiles(Array.from(e.target.files)); };

  const handleTypeToggle = (name) => {
    setSelectedTypes(prev => {
      const isSelected = prev.includes(name);
      const newSelected = isSelected ? prev.filter(t => t !== name) : [...prev, name];
      if (!isSelected) setPrices(p => ({ ...p, [name]: p[name] || [{ label: '', price: '' }] }));
      return newSelected;
    });
  };

  const addPriceRow = (type) => {
    setPrices(p => ({ ...p, [type]: [...(p[type] || []), { label: '', price: '' }] }));
  };

  const removePriceRow = (type, indexToRemove) => {
    setPrices(p => {
      const newPrices = { ...p };
      newPrices[type] = newPrices[type].filter((_, i) => i !== indexToRemove);
      return newPrices;
    });
  };

  const handlePriceChange = (type, index, field, value) => {
    setPrices(p => {
      const newPrices = { ...p };
      newPrices[type][index][field] = value;
      return newPrices;
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: false }));
  };

  const toggleDaysDropdown = (blockId) => {
    setScheduleBlocks(prev => prev.map(b => b.id === blockId ? { ...b, isDropdownOpen: !b.isDropdownOpen } : b));
  };

  const toggleDaySelection = (blockId, day) => {
    setScheduleBlocks(prev => prev.map(b => {
      if (b.id === blockId) {
        if (day === 'Ежедневно') return { ...b, days: b.days.includes('Ежедневно') ? [] : ['Ежедневно'] };
        let newDays = b.days.includes('Ежедневно') ? [] : [...b.days];
        newDays = newDays.includes(day) ? newDays.filter(d => d !== day) : [...newDays, day];
        return { ...b, days: newDays };
      }
      return b;
    }));
  };

  const updateScheduleBlock = (blockId, field, value) => {
    setScheduleBlocks(prev => prev.map(b => b.id === blockId ? { ...b, [field]: value } : b));
  };

  const addScheduleBlock = () => {
    setScheduleBlocks(prev => [...prev, { id: Date.now(), days: [], openTime: '', closeTime: '', hasBreak: false, breakStart: '', breakEnd: '', isDropdownOpen: false }]);
  };

  const removeLastScheduleBlock = () => {
    setScheduleBlocks(prev => prev.slice(0, -1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.address.trim()) newErrors.address = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.name && nameRef.current) nameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else if (newErrors.address && addressRef.current) addressRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    console.log("Данные отправлены:", { formData, selectedTypes, prices, scheduleBlocks, selectedFiles });
    setIsSubmitted(true);
    setTimeout(() => clearCacheAndClose(), 2000); 
  };

  const currentCategories = activeTab === 'waste' ? wasteCategories : reduceCategories;

  if (isSubmitted) {
    return (
      <div className="bg-white d-flex flex-column align-items-center justify-content-center h-100 px-4 text-center" style={{ width: '480px', minWidth: '480px', zIndex: 1005 }}>
        <h3 className="font-russkin mb-2" style={{ color: '#18442a', fontSize: '32px', textTransform: 'uppercase' }}>СПАСИБО ЗА ЗАЯВКУ!</h3>
        <p style={{ fontSize: '14px', color: '#18442a' }}>В скором времени мы её рассмотрим.</p>
      </div>
    );
  }

  return (
    <div className="bg-white d-flex flex-column h-100" style={{ width: '480px', minWidth: '480px', zIndex: 1005 }}>
      <div className="px-4 py-3" style={{ borderBottom: '1px solid #E7EFE8' }}>
        <div className="d-flex align-items-center gap-2 mb-2" style={{ cursor: 'pointer', color: '#18442a', fontSize: '13px', fontWeight: '500', fontFamily: 'Bounded, sans-serif' }} onClick={onClose}>
          <i className="bi bi-arrow-left"></i> На главную
        </div>
        <h3 className="font-russkin m-0" style={{ color: '#18442a', fontSize: '28px', textTransform: 'uppercase' }}>ДОБАВЛЕНИЕ НОВОЙ ТОЧКИ</h3>
      </div>

      <div className="d-flex px-4 pt-2" style={{ borderBottom: '1px solid #E7EFE8' }}>
        <div className="pb-2 me-4" style={{ cursor: 'pointer', fontSize: '13px', color: activeTab === 'waste' ? '#18442a' : '#A0A0A0', borderBottom: activeTab === 'waste' ? '2px solid #18442a' : '2px solid transparent', fontWeight: activeTab === 'waste' ? '600' : '400' }} onClick={() => setActiveTab('waste')}>Прием вторсырья</div>
        <div className="pb-2" style={{ cursor: 'pointer', fontSize: '13px', color: activeTab === 'reduce' ? '#18442a' : '#A0A0A0', borderBottom: activeTab === 'reduce' ? '2px solid #18442a' : '2px solid transparent', fontWeight: activeTab === 'reduce' ? '600' : '400' }} onClick={() => setActiveTab('reduce')}>Сокращение отходов</div>
      </div>

      <div className="flex-grow-1 px-4 py-4" style={{ overflowY: 'auto' }}>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
          
          <div ref={nameRef}>
            <label style={{ fontSize: '13px', color: '#18442a', fontWeight: '600', marginBottom: '6px' }}>Название</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-control" placeholder="Введите название точки" style={{ fontSize: '13px', fontFamily: 'Actay, sans-serif', borderRadius: '8px', borderColor: errors.name ? '#FF8A8A' : '#18442A', color: '#18442A' }} />
            {errors.name && <div style={{ color: '#FF8A8A', fontSize: '11px', marginTop: '4px' }}>Поле обязательно для заполнения</div>}
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#18442a', fontWeight: '600', marginBottom: '6px' }}>Фотография точки</label>
            <div onClick={handleFileClick} className="d-flex align-items-center justify-content-center text-center" style={{ height: '100px', border: '1px dashed #18442A', borderRadius: '8px', backgroundColor: '#FFFFFF', cursor: 'pointer' }}>
              <span style={{ fontSize: '12px', color: '#6BAD86' }}>{selectedFiles.length > 0 ? `Выбрано файлов: ${selectedFiles.length}` : <>Перетащите фотографии сюда<br/>или выберите на компьютере</>}</span>
            </div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple accept="image/*" onChange={handleFileChange} />
          </div>

          <div ref={addressRef}>
            <label style={{ fontSize: '13px', color: '#18442a', fontWeight: '600', marginBottom: '6px' }}>Адрес</label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="form-control" placeholder="Введите адрес точки" style={{ fontSize: '13px', fontFamily: 'Actay, sans-serif', borderRadius: '8px', borderColor: errors.address ? '#FF8A8A' : '#18442A', color: '#18442A' }} />
            {errors.address && <div style={{ color: '#FF8A8A', fontSize: '11px', marginTop: '4px' }}>Поле обязательно для заполнения</div>}
          </div>
          
          {/* Первая разделительная линия */}
          <hr style={{ margin: '0 -24px', border: 'none', borderTop: '1px solid #E7EFE8', opacity: 1 }} />

          <div>
            <label style={{ fontSize: '13px', color: '#18442a', fontWeight: '600', marginBottom: '10px' }}>Принимаемые типы отходов</label>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {currentCategories.map(cat => {
                const isSelected = selectedTypes.includes(cat.name);
                return (
                  <div key={cat.id} onClick={() => handleTypeToggle(cat.name)} className="d-flex align-items-center gap-2 px-2 py-1" style={{ backgroundColor: isSelected ? cat.color : '#F4F6E3', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: isSelected ? '#18442a' : 'transparent', border: isSelected ? 'none' : '1px solid #18442a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isSelected && <i className="bi bi-check" style={{ color: 'white', fontSize: '12px', lineHeight: 0, marginTop: '1px' }}></i>}
                    </div>
                    <span style={{ fontSize: '12px', color: '#18442A' }}>{cat.name}</span>
                  </div>
                )
              })}
            </div>
            <div style={{ fontSize: '13px', color: '#18442a', fontWeight: '600', marginTop: '16px' }}>Цены (руб./кг)</div>
            {selectedTypes.length === 0 && <div style={{ fontSize: '11px', color: '#A0A0A0', marginTop: '4px' }}>Типы отходов не выбраны</div>}
          </div>

          {selectedTypes.length > 0 && (
            <div className="d-flex flex-column gap-3 mt-1">
              {selectedTypes.map(type => {
                const catColor = categoriesSafe.find(c => c.name === type)?.color || '#F4F6E3';
                const typePrices = prices[type] || [{ label: '', price: '' }];
                return (
                  <div key={type} className="d-flex flex-column gap-2 mb-2">
                    <span style={{ backgroundColor: catColor, color: '#18442A', fontSize: '12px', padding: '4px 12px', borderRadius: '6px', alignSelf: 'flex-start' }}>{type}</span>
                    {typePrices.map((tp, idx) => (
                      <div key={idx} className="d-flex align-items-center gap-2">
                        <input type="text" className="form-control" placeholder="Тип, маркировка" value={tp.label} onChange={(e) => handlePriceChange(type, idx, 'label', e.target.value)} style={{ fontSize: '12px', fontFamily: 'Actay, sans-serif', color: '#18442A', borderRadius: '6px', borderColor: '#18442A' }} />
                        <span style={{ fontWeight: '600', color: '#18442A' }}>:</span>
                        <div className="position-relative flex-shrink-0" style={{ width: '80px' }}>
                          <input type="number" className="form-control" placeholder="Руб./кг" value={tp.price} onChange={(e) => handlePriceChange(type, idx, 'price', e.target.value)} style={{ fontSize: '12px', fontFamily: 'Actay, sans-serif', color: '#18442A', borderRadius: '6px', borderColor: '#18442A', paddingRight: '10px' }} />
                        </div>
                      </div>
                    ))}
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <span style={{ fontSize: '12px', color: '#18442a', cursor: 'pointer', fontWeight: '600', alignSelf: 'flex-start' }} onClick={() => addPriceRow(type)}>Добавить +</span>
                      {typePrices.length > 1 && (
                        <span style={{ fontSize: '12px', color: '#FF8A8A', cursor: 'pointer', fontWeight: '600' }} onClick={() => removePriceRow(type, typePrices.length - 1)}>Удалить</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Вторая разделительная линия */}
          <hr style={{ margin: '0 -24px', border: 'none', borderTop: '1px solid #E7EFE8', opacity: 1 }} />

          <div>
            <label style={{ fontSize: '13px', color: '#18442a', fontWeight: '600', marginBottom: '8px' }}>Время работы</label>
            <div className="d-flex flex-column gap-2">
              <label className="d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#18442A', cursor: 'pointer' }}>
                <input type="radio" name="scheduleType" value="everyday" checked={formData.scheduleType === 'everyday'} onChange={handleInputChange} /> Круглосуточно каждый день
              </label>
              <label className="d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#18442A', cursor: 'pointer' }}>
                <input type="radio" name="scheduleType" value="custom" checked={formData.scheduleType === 'custom'} onChange={handleInputChange} /> По расписанию
              </label>
            </div>
            
            {formData.scheduleType === 'custom' && (
              <div className="mt-3 ps-3 d-flex flex-column gap-4" style={{ borderLeft: '2px solid #6BAD86' }}>
                {scheduleBlocks.map((block, index) => (
                  <div key={block.id} className={index > 0 ? "pt-3 border-top" : ""}>
                    <label style={{ fontSize: '12px', color: '#18442a', fontWeight: '600' }}>Дни работы</label>
                    <div className="position-relative mb-3">
                      <div className="form-control d-flex justify-content-between align-items-center" onClick={() => toggleDaysDropdown(block.id)} style={{ fontSize: '13px', fontFamily: 'Actay, sans-serif', color: '#18442A', borderRadius: '6px', borderColor: '#18442A', cursor: 'pointer', backgroundColor: 'white' }}>
                        {block.days.length === 0 ? 'Выберите дни работы' : block.days.join(', ')}
                        <i className="bi bi-chevron-down"></i>
                      </div>
                      {block.isDropdownOpen && (
                        <div className="position-absolute w-100 shadow-sm mt-1" style={{ top: '100%', zIndex: 10, backgroundColor: 'white', border: '1px solid #E7EFE8', borderRadius: '8px', overflow: 'hidden' }}>
                          {daysOfWeek.map(day => (
                            <div key={day} onClick={() => toggleDaySelection(block.id, day)} className="d-flex align-items-center justify-content-between px-3 py-2" style={{ fontSize: '13px', cursor: 'pointer', backgroundColor: block.days.includes(day) ? '#F4F6E3' : 'white', transition: '0.1s' }} onMouseEnter={(e) => { if(!block.days.includes(day)) e.currentTarget.style.backgroundColor = '#f9f9f9' }} onMouseLeave={(e) => { if(!block.days.includes(day)) e.currentTarget.style.backgroundColor = 'white' }}>
                              <span style={{ color: '#18442A' }}>{day}</span>
                              {block.days.includes(day) && <i className="bi bi-check2" style={{ color: '#18442a', fontSize: '16px' }}></i>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="d-flex gap-3 mb-3">
                      <div className="flex-grow-1">
                        <label style={{ fontSize: '12px', color: '#18442a' }}>Время открытия</label>
                        <input type="time" className="form-control" value={block.openTime} onChange={(e) => updateScheduleBlock(block.id, 'openTime', e.target.value)} style={{ fontSize: '13px', fontFamily: 'Actay, sans-serif', color: '#18442A', borderRadius: '6px', borderColor: '#18442A' }} />
                      </div>
                      <div className="flex-grow-1">
                        <label style={{ fontSize: '12px', color: '#18442a' }}>Время закрытия</label>
                        <input type="time" className="form-control" value={block.closeTime} onChange={(e) => updateScheduleBlock(block.id, 'closeTime', e.target.value)} style={{ fontSize: '13px', fontFamily: 'Actay, sans-serif', color: '#18442A', borderRadius: '6px', borderColor: '#18442A' }} />
                      </div>
                    </div>
                    
                    <label style={{ fontSize: '12px', color: '#18442a', fontWeight: '600' }}>Перерыв</label>
                    <div className="d-flex flex-column gap-2 mb-3">
                      <label className="d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#18442A' }}><input type="radio" checked={!block.hasBreak} onChange={() => updateScheduleBlock(block.id, 'hasBreak', false)} /> Без перерыва</label>
                      <label className="d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#18442A' }}><input type="radio" checked={block.hasBreak} onChange={() => updateScheduleBlock(block.id, 'hasBreak', true)} /> С перерывом</label>
                    </div>
                    
                    {block.hasBreak && (
                      <div className="d-flex gap-3 mb-3">
                        <div>
                          <label style={{ fontSize: '12px', color: '#18442a' }}>С</label>
                          <input type="time" className="form-control" value={block.breakStart} onChange={(e) => updateScheduleBlock(block.id, 'breakStart', e.target.value)} style={{ fontSize: '13px', fontFamily: 'Actay, sans-serif', color: '#18442A', borderRadius: '6px', borderColor: '#18442A' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', color: '#18442a' }}>До</label>
                          <input type="time" className="form-control" value={block.breakEnd} onChange={(e) => updateScheduleBlock(block.id, 'breakEnd', e.target.value)} style={{ fontSize: '13px', fontFamily: 'Actay, sans-serif', color: '#18442A', borderRadius: '6px', borderColor: '#18442A' }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <span style={{ fontSize: '12px', color: '#18442a', cursor: 'pointer', fontWeight: '600' }} onClick={addScheduleBlock}>Добавить дни работы +</span>
                  {scheduleBlocks.length > 1 && (
                    <span style={{ fontSize: '12px', color: '#FF8A8A', cursor: 'pointer', fontWeight: '600' }} onClick={removeLastScheduleBlock}>Удалить</span>
                  )}
                </div>

              </div>
            )}
          </div>
          
          {/* Третья разделительная линия */}
          <hr style={{ margin: '0 -24px', border: 'none', borderTop: '1px solid #E7EFE8', opacity: 1 }} />

          <div>
            <label style={{ fontSize: '13px', color: '#18442a', fontWeight: '600', marginBottom: '6px' }}>Описание точки</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control" rows="4" placeholder="Опишите подробнее, как выглядит точка приёма вторсырья, как его найти, какие типы вторсырья принимаются и что указано на информационной табличке. Это поможет модераторам быстрее нанести точку на карту, а другим людям - найти и воспользоваться." style={{ fontSize: '11px', fontFamily: 'Actay, sans-serif', borderRadius: '8px', borderColor: '#18442A', color: '#18442A' }}></textarea>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#18442a', fontWeight: '600', marginBottom: '6px' }}>Контакт модератора точки</label>
            <input type="email" name="moderatorEmail" value={formData.moderatorEmail} onChange={handleInputChange} className="form-control" placeholder="Введите email" style={{ fontSize: '13px', fontFamily: 'Actay, sans-serif', borderRadius: '8px', borderColor: '#18442A', color: '#18442A' }} />
          </div>

          <div>
            <label style={{ fontSize: '15px', color: '#6BAD86', fontWeight: '600', marginBottom: '16px' }}>Контактные данные об организации точки</label>
            <div className="d-flex flex-column gap-3">
              <div>
                <div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '13px', color: '#6BAD86' }}>Сайт</span><span style={{ fontSize: '11px', color: '#6BAD86' }}>Не обязательно</span></div>
                <input type="text" name="site" value={formData.site} onChange={handleInputChange} className="form-control" placeholder="Введите адрес сайта" style={{ fontSize: '13px', fontFamily: 'Actay, sans-serif', borderRadius: '8px', borderColor: '#6BAD86', color: '#18442A' }} />
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '13px', color: '#6BAD86' }}>Телефон</span><span style={{ fontSize: '11px', color: '#6BAD86' }}>Не обязательно</span></div>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="form-control" placeholder="Введите номер телефона" style={{ fontSize: '13px', fontFamily: 'Actay, sans-serif', borderRadius: '8px', borderColor: '#6BAD86', color: '#18442A' }} />
              </div>
              <div>
                <div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '13px', color: '#6BAD86' }}>Полезные ссылки</span><span style={{ fontSize: '11px', color: '#6BAD86' }}>Не обязательно</span></div>
                <input type="text" name="links" value={formData.links} onChange={handleInputChange} className="form-control" placeholder="Например, введите ссылку в социальных сетях" style={{ fontSize: '13px', fontFamily: 'Actay, sans-serif', borderRadius: '8px', borderColor: '#6BAD86', color: '#18442A' }} />
              </div>
            </div>
          </div>

          {showDeleteConfirm ? (
            <div className="p-3" style={{ border: '1px solid #E7EFE8', borderRadius: '8px' }}>
              <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '13px', color: '#18442A', fontWeight: '600' }}>
                <i className="bi bi-exclamation-circle" style={{ fontSize: '16px' }}></i> Удаление формы
              </div>
              <p style={{ fontSize: '11px', color: '#6BAD86', marginBottom: '12px' }}>Вы уверены? Введённые данные не сохранятся</p>
              <div className="d-flex justify-content-between align-items-center">
                <button type="button" className="btn px-4 py-1" style={{ backgroundColor: '#FFC8C8', color: '#18442A', fontSize: '12px', borderRadius: '6px' }} onClick={clearCacheAndClose}>Удалить</button>
                <span style={{ fontSize: '12px', color: '#18442A', cursor: 'pointer' }} onClick={() => setShowDeleteConfirm(false)}>Отменить</span>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3 mt-2 pb-4 text-center">
              <button type="submit" className="btn w-100 rounded-pill shadow-sm py-2" style={{ backgroundColor: '#18442a', color: 'white', fontSize: '14px', fontWeight: '600' }}>Подтвердить и отправить на модерацию</button>
              <span style={{ cursor: 'pointer', color: '#6BAD86', fontSize: '14px', fontWeight: '600' }} onClick={() => setShowDeleteConfirm(true)}>Отменить</span>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Главная страница Карты
// ----------------------------------------------------
const MapPage = () => {
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const mapRef = useRef(null);
  const [isPanelScrolled, setIsPanelScrolled] = useState(false);
  // --- ЛОГИКА ЛАЙКОВ ДЛЯ ПУНКТА ---
  const [pointLikes, setPointLikes] = useState(122);
  const [pointDislikes, setPointDislikes] = useState(0);
  const [userPointReaction, setUserPointReaction] = useState(null);

  const handlePointReaction = async (type) => {
    if (!selectedPointData) return;
    
    // Оптимистичное обновление UI
    if (type === 'like') {
      setPointLikes(prev => userPointReaction === 'like' ? prev - 1 : prev + 1);
      if (userPointReaction === 'dislike') setPointDislikes(prev => prev - 1);
      setUserPointReaction(userPointReaction === 'like' ? null : 'like');
    } else {
      setPointDislikes(prev => userPointReaction === 'dislike' ? prev - 1 : prev + 1);
      if (userPointReaction === 'like') setPointLikes(prev => prev - 1);
      setUserPointReaction(userPointReaction === 'dislike' ? null : 'dislike');
    }

    try {
      const token = localStorage.getItem('token');
      // Отправляем лайк к конкретной ТОЧКЕ
      await axios.post(
        `http://127.0.0.1:8000/api/points/${selectedPointData.id}/reaction`,
        { reaction: type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Ошибка при отправке реакции на пункт:', error);
    }
  };

  const [isEditingPoint, setIsEditingPoint] = useState(false);
  const [editSuggestion, setEditSuggestion] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeFilters, setActiveFilters] = useState([]); 
  const [appliedFilters, setAppliedFilters] = useState([]);
  
  const [selectedPointData, setSelectedPointData] = useState(null); 
  
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
      .then(data => { 
        // ВРЕМЕННЫЙ ЛОГ ДЛЯ ДЕБАГА
        console.log("👉 СТРУКТУРА ПУНКТА С БЭКЕНДА:", data[0]); 
        setPoints(data); 
        setLoading(false); 
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isMapLoaded) {
        setMapError(true);
      }
    }, 5000);
    return () => clearTimeout(timeout);
  }, [isMapLoaded]); 

  const handleRetryMap = () => {
    window.location.reload();
  };

  const toggleFilter = (id) => {
    setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredPoints = appliedFilters.length > 0 
    ? points.filter(point => {
        const activeNames = appliedFilters.map(id => allCategories.find(c => c.id === id)?.name);
        
        // Универсальная проверка для accepted_waste (может быть массив объектов или массив строк)
        const wasteArray = point.accepted_waste || point.materials || point.wastes || [];
        
        return activeNames.some(name => {
          return wasteArray.some(w => {
            // Если w - это объект, проверяем w.name
            if (w && typeof w === 'object' && w.name) {
              return w.name === name;
            }
            // Если w - это строка (название категории)
            if (typeof w === 'string') {
              return w === name;
            }
            return false;
          });
        });
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
    if (selectedPointData && selectedPointData.id === point.id) {
      setSelectedPointData(null);
    } else {
      setSelectedPointData(point);
      setIsPanelScrolled(false); // Сбрасываем стиль крестика при новой точке

      // Получаем координаты точки
      const lat = point.coordinates?.lat || point.latitude || point.coordinates?.[0];
      const lng = point.coordinates?.lng || point.longitude || point.coordinates?.[1];

      // Если координаты есть и карта загрузилась — летим к точке!
      if (lat && lng && mapRef.current) {
        mapRef.current.setCenter(
          [parseFloat(lat), parseFloat(lng)], 
          15, // Уровень приближения (зум). Можешь поменять, если нужно ближе/дальше
          { duration: 400, timingFunction: 'ease-in-out' } // Плавная анимация на 400 миллисекунд
        );
      }
    }
  };

  return (
    <div className="d-flex flex-column" style={{ height: 'calc(100vh - 80px)', backgroundColor: '#f1f4e9' }}>
      <div className="d-flex flex-grow-1" style={{ borderTop: '1px solid #E7EFE8', overflow: 'hidden' }}>
        
        {/* ЕСЛИ НАЖАЛИ "ДОБАВИТЬ ТОЧКУ +" -> РЕНДЕРИМ ФОРМУ, ИНАЧЕ -> ЛЕВЫЙ САЙДБАР С ФИЛЬТРАМИ */}
        {isAddingPoint ? (
          <AddPointPanel 
            onClose={() => setIsAddingPoint(false)} 
            wasteCategories={wasteCategories} 
            reduceCategories={reduceCategories}
            allCategories={allCategories}
          />
        ) : (
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

            {/* Выпадающие списки "Цена" и "Время работы" */}
            <div className="d-flex gap-3 mb-3 mt-2">
              <div className="flex-grow-1 position-relative">
                <div 
                  className="d-flex justify-content-between align-items-center rounded-pill px-3" 
                  onClick={() => { setIsPriceOpen(!isPriceOpen); setIsTimeOpen(false); }}
                  style={{ height: '35px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', backgroundColor: '#F4F6E3', color: '#18442a' }}
                >
                  <span>
                    {priceFilter ? priceFilter : 'Цена'}
                    {priceFilter && (
                      <i className="bi bi-x-lg" style={{ fontSize: '10px', marginLeft: '6px' }} onClick={(e) => { e.stopPropagation(); setPriceFilter(''); }}></i>
                    )}
                  </span>
                  <i className={`bi bi-chevron-${isPriceOpen ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
                </div>
                
                {isPriceOpen && (
                  <div className="position-absolute w-100 shadow-sm" style={{ top: '40px', zIndex: 10, backgroundColor: '#F4F6E3', borderRadius: '8px', overflow: 'hidden' }}>
                    {['Бесплатно', 'Платно'].map(option => {
                      const isSelected = priceFilter === option;
                      return (
                        <div 
                          key={option} 
                          onClick={() => { setPriceFilter(option); setIsPriceOpen(false); }}
                          onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#EBEDDD' }}
                          onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#F4F6E3' }}
                          className="position-relative"
                          style={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer', transition: '0.1s', backgroundColor: isSelected ? '#18442a' : '#F4F6E3', color: isSelected ? '#ffffff' : '#18442a', textAlign: 'center' }}
                        >
                          {option}
                          {isSelected && <i className="bi bi-check2 position-absolute" style={{ fontSize: '16px', right: '12px', top: '50%', transform: 'translateY(-50%)', marginTop: '2px' }}></i>}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="flex-grow-1 position-relative">
                <div 
                  className="d-flex justify-content-between align-items-center rounded-pill px-3" 
                  onClick={() => { setIsTimeOpen(!isTimeOpen); setIsPriceOpen(false); }}
                  style={{ height: '35px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', backgroundColor: '#F4F6E3', color: '#18442a' }}
                >
                  <span>
                    {timeFilter ? timeFilter : 'Время работы'}
                    {timeFilter && (
                      <i className="bi bi-x-lg" style={{ fontSize: '10px', marginLeft: '6px' }} onClick={(e) => { e.stopPropagation(); setTimeFilter(''); }}></i>
                    )}
                  </span>
                  <i className={`bi bi-chevron-${isTimeOpen ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
                </div>
                
                {isTimeOpen && (
                  <div className="position-absolute w-100 shadow-sm" style={{ top: '40px', zIndex: 10, backgroundColor: '#F4F6E3', borderRadius: '8px', overflow: 'hidden' }}>
                    {['Круглосуточно', 'Сейчас открыто'].map(option => {
                      const isSelected = timeFilter === option;
                      return (
                        <div 
                          key={option} 
                          onClick={() => { setTimeFilter(option); setIsTimeOpen(false); }}
                          onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#EBEDDD' }}
                          onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = '#F4F6E3' }}
                          className="position-relative"
                          style={{ padding: '8px 16px', fontSize: '13px', cursor: 'pointer', transition: '0.1s', backgroundColor: isSelected ? '#18442a' : '#F4F6E3', color: isSelected ? '#ffffff' : '#18442a', textAlign: 'center' }}
                        >
                          {option}
                          {isSelected && <i className="bi bi-check2 position-absolute" style={{ fontSize: '16px', right: '12px', top: '50%', transform: 'translateY(-50%)', marginTop: '2px' }}></i>}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <button 
              className="btn w-100 rounded-pill mb-4 mt-2" 
              style={{ backgroundColor: '#18442a', color: 'white', fontWeight: '500' }}
              onClick={() => setAppliedFilters(activeFilters)}
            >
              Применить
            </button>

            {/* СПИСОК ПУНКТОВ */}
            <h4 className="font-russkin mb-3" style={{ color: '#18442a', fontSize: '37px', textTransform: 'uppercase', marginLeft: '8px' }}>
              {filteredPoints.length === 0 ? 'Ничего не найдено' : 
               filteredPoints.length === 1 ? 'НАЙДЕНА 1 ТОЧКА' :
               filteredPoints.length > 1 && filteredPoints.length < 5 ? `НАЙДЕНО ${filteredPoints.length} ТОЧКИ` :
               `НАЙДЕНО ${filteredPoints.length} ТОЧЕК`}
            </h4>
            <hr style={{ margin: '0 -32px 16px -32px', border: 'none', borderTop: '1px solid #E7EFE8', opacity: 1 }} />

            <div className="d-flex flex-column">
              {filteredPoints.length === 0 ? (
                <p style={{ color: '#666', fontSize: '13px', marginLeft: '8px' }}>Нет подходящих точек. Попробуйте изменить фильтры.</p>
              ) : (
                filteredPoints.map((point, index) => (
                  <div key={point.id}>
                    <div 
                      onClick={() => handlePointClick(point)}
                      style={{ 
                        cursor: 'pointer', 
                        opacity: (selectedPointData?.id && selectedPointData.id !== point.id) ? 0.6 : 1,
                        paddingBottom: '16px',
                        paddingTop: index === 0 ? '0' : '16px'
                      }}
                    >
                      <div className="d-flex gap-2 mb-2 flex-wrap">
                        {/* Универсальный рендер тегов категорий для сайдбара (с прошлой задачи) */}
                        {(point.accepted_waste || point.materials || point.wastes || []).map((w, i) => {
                          const wasteName = typeof w === 'string' ? w : (w?.name || '');
                          if (!wasteName) return null;
                          const catData = allCategories.find(c => c.name === wasteName);
                          return (
                            <span key={w?.id || i} style={{ backgroundColor: catData ? catData.color : '#f1f4e9', color: '#18442A', fontSize: '11px', padding: '4px 12px', borderRadius: '12px' }}>
                              {wasteName}
                            </span>
                          )
                        })}
                      </div>
                      <h6 className="mb-1 font-russkin" style={{ color: '#18442a', fontSize: '20px', margin: 0 }}>{point.name}</h6>
                      <p className="mb-1 mt-1" style={{ fontSize: '13px', color: '#A0A0A0' }}>{point.address || 'Адрес не указан'}</p>
                      <span style={{ fontSize: '12px', color: '#FF9797' }}>Закрыто</span>
                    </div>
                    <hr style={{ margin: '0 -32px', border: 'none', borderTop: '1px solid #E7EFE8', opacity: 1 }} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ПРАВАЯ ЧАСТЬ - КОНТЕЙНЕР КАРТЫ */}
        <div className="flex-grow-1 position-relative d-flex" style={{ backgroundColor: '#F4F6E3' }}>

          {/* ВЫЕЗЖАЮЩАЯ ДЕТАЛЬНАЯ ПАНЕЛЬ ПУНКТА */}
          {selectedPointData && (
            // Внешняя обёртка без overflow — крестик будет жить здесь
            <div
              className="bg-white shadow"
              style={{
                position: 'absolute', left: 0, top: 0,
                width: '480px', height: '100%',
                zIndex: 1000,
              }}
            >
              {/* ПЛАВАЮЩИЙ КРЕСТИК — всегда поверх скролла и фото */}
              <div
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  zIndex: 1100,
                  cursor: 'pointer',
                  backgroundColor: isPanelScrolled ? 'white' : 'transparent',
                  borderRadius: '50%',
                  width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isPanelScrolled ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
                  transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onClick={() => { setSelectedPointData(null); setIsPanelScrolled(false); }}
              >
                <i className="bi bi-x-lg" style={{ fontSize: '16px', color: '#18442a', lineHeight: 0, margin: 0, padding: 0, marginTop: '2px' }}></i>
              </div>
              
              {/* ВНУТРЕННИЙ СКРОЛЛЯЩИЙСЯ КОНТЕНТ */}
              <div
                style={{ overflowY: 'auto', height: '100%', padding: '32px' }}
                onScroll={(e) => setIsPanelScrolled(e.target.scrollTop > 10)}
              >
                {/* Заголовок — старый крестик УБИРАЕМ, paddingRight чтобы текст не лез под крестик */}
                <div className="mb-3">
                  <h3
                    className="font-russkin m-0"
                    style={{ color: '#18442a', fontSize: '28px', textTransform: 'uppercase', paddingRight: '40px' }}
                  >
                    {selectedPointData.name}
                  </h3>
                </div>
              
                {/* ВСЁ ОСТАЛЬНОЕ СОДЕРЖИМОЕ ПАНЕЛИ БЕЗ ИЗМЕНЕНИЙ */}
                {/* (теги категорий, фото, лайки, адрес, режим работы, контакты, описание, цены, комментарии, футер) */}

                <div className="d-flex gap-2 mb-3 flex-wrap">
                  {(selectedPointData.accepted_waste || selectedPointData.materials || selectedPointData.wastes || []).map((w, i) => {
                    const wasteName = typeof w === 'string' ? w : (w?.name || '');
                    if (!wasteName) return null;
                    const catData = allCategories.find(c => c.name === wasteName);
                    return (
                      <span key={w?.id || i} style={{ backgroundColor: catData ? catData.color : '#f1f4e9', color: '#18442A', fontSize: '12px', padding: '6px 14px', borderRadius: '12px' }}>{wasteName}</span>
                    )
                  })}
                </div>
                
                <div className="w-100 mb-2 rounded" style={{ height: '220px', backgroundColor: '#e9ecef', backgroundImage: 'url(https://via.placeholder.com/480x220?text=Фото+пункта)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

              {/* Лайки и дизлайки пункта под фото */}
              <div className="d-flex gap-3 mt-3 mb-2" style={{ fontSize: '13px', color: '#18442A' }}>
                <span 
                  className="d-flex align-items-center" 
                  onClick={() => handlePointReaction('like')}
                  style={{ cursor: 'pointer', transition: '0.2s' }}
                >
                  <img 
                    src={userPointReaction === 'like' ? "/icons/like_filled.png" : "/icons/like.png"} 
                    alt="Like" 
                    style={{ width: '15px', height: '15px', marginRight: '6px' }} 
                  /> 
                  {pointLikes}
                </span>
                <span 
                  className="d-flex align-items-center" 
                  onClick={() => handlePointReaction('dislike')}
                  style={{ cursor: 'pointer', transition: '0.2s' }}
                >
                  <img 
                    src={userPointReaction === 'dislike' ? "/icons/dislike_filled.png" : "/icons/dislike.png"} 
                    alt="Dislike" 
                    style={{ width: '15px', height: '15px', marginRight: '6px' }} 
                  /> 
                  {pointDislikes > 0 ? pointDislikes : 0}
                </span>
              </div>
                
                <div className="d-flex flex-column gap-3 mb-4 mt-3">
                  <div>
                    <h6 className="font-russkin" style={{ color: '#18442a', fontSize: '23px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}><img src="/icons/marker.png" alt="Address" style={{ width: '12px', height: '12px' }} /> АДРЕС</h6>
                    <p className="mb-0 ms-4 mt-1" style={{ fontSize: '13px', color: '#18442A' }}>{selectedPointData.address || 'ул. Чайковского, 82а'}</p>
                  </div>
                  <div>
                    <h6 className="font-russkin" style={{ color: '#18442a', fontSize: '23px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}><img src="/icons/clock.png" alt="Time" style={{ width: '12px', height: '12px' }} /> РЕЖИМ РАБОТЫ</h6>
                    <div className="ms-4 mt-1" style={{ fontSize: '13px', color: '#18442A', lineHeight: '1.4' }}>понедельник: 16:00 - 19:00<br/>вторник: 16:00 - 19:00<br/>среда: 16:00 - 19:00<br/>воскресенье: 10:00 - 16:00</div>
                  </div>
                  <div className="mt-2 d-flex flex-column gap-2">
                    <div className="d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#18442A' }}>
                      <img src="/icons/planet.png" alt="Website" style={{ width: '10px', height: '10px', marginLeft: '1px' }} /> 
                      <a href="https://uralvtorma.ru" target="_blank" rel="noopener noreferrer" style={{ color: '#18442A', textDecoration: 'none' }}>uralvtorma.ru</a>
                    </div>
                    <div className="d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#18442A' }}>
                      <img src="/icons/plane.png" alt="VK" style={{ width: '10px', height: '10px', marginLeft: '1px' }} /> 
                      <a href="https://vk.com/club206427178" target="_blank" rel="noopener noreferrer" style={{ color: '#18442A', textDecoration: 'none' }}>vk.com/club206427178</a>
                    </div>
                    <div className="d-flex align-items-center gap-2" style={{ fontSize: '13px', color: '#18442A' }}>
                      <img src="/icons/phone.png" alt="Phone" style={{ width: '10px', height: '10px', marginLeft: '1px' }} /> 
                      <a href="tel:+79043823130" style={{ color: '#18442A', textDecoration: 'none' }}>+7 904 382-31-30</a>
                    </div>
                  </div>
                </div>
                
                <h6 className="font-russkin" style={{ color: '#18442a', fontSize: '23px', textTransform: 'uppercase', margin: '0 0 8px 0' }}>ОПИСАНИЕ</h6>
                <p style={{ fontSize: '13px', color: '#18442A', lineHeight: '1.5', marginBottom: '32px' }}>Наша компания принимает макулатуру, пластик и плёнку на самых выгодных условиях. Наша компания осуществляет: - Прием макулатуры в Екатеринбурге - Вывоз макулатуры в Екатеринбурге - Уничтожение макулатуры путем переработки.</p>
                
                <hr style={{ margin: '0 -32px 32px -32px', border: 'none', borderTop: '1px solid #E7EFE8', opacity: 1 }} />
                
                <h6 className="font-russkin" style={{ color: '#18442a', fontSize: '23px', textTransform: 'uppercase', margin: '0 0 12px 0' }}>ЦЕНЫ</h6>
                <div className="row g-3 mb-4">
                   <div className="col-6">
                      <span style={{ backgroundColor: '#CDE5FD', color: '#18442A', fontSize: '12px', padding: '4px 12px', borderRadius: '12px' }}>Пластик</span>
                      <div className="mt-2" style={{ fontSize: '11px', color: '#18442A', lineHeight: '1.3' }}>Ящик для фруктов б/у - от 3 руб./кг;<br/>ПВД, прозрачная - от 15 руб./кг;<br/>Стрейч, прозрачная - от 17 руб./кг;<br/>Микс (ПВД + стрейч), прозрачная - от 12 руб./кг;</div>
                      <div className="mt-3"><span style={{ backgroundColor: '#FFC8C8', color: '#18442A', fontSize: '12px', padding: '4px 12px', borderRadius: '12px' }}>Бумага</span></div>
                      <div className="mt-2" style={{ fontSize: '11px', color: '#18442A', lineHeight: '1.3' }}>МН-7Б (книги, журналы, тетради) - от 7 руб./кг<br/>МН-8В (газеты, газетная бумага) - от 11 руб./кг<br/>МН-5Б (картон) - от 4 руб./кг<br/>МН-6Б (хром-эрзац) - от 4 руб./кг<br/>МН-7Б/1 (архивы) - от 10 руб./кг<br/>МН-13В (смешанная) - от 2 руб./кг</div>
                   </div>
                   <div className="col-6">
                      <span style={{ backgroundColor: '#F8F6B7', color: '#18442A', fontSize: '12px', padding: '4px 12px', borderRadius: '12px' }}>Крышки</span>
                      <div className="mt-2 mb-3" style={{ fontSize: '11px', color: '#18442A', lineHeight: '1.3' }}>HDPE, PE-HD, PE - 20 руб./кг</div>
                      <div className="mt-3"><span style={{ backgroundColor: '#C4C2FF', color: '#18442A', fontSize: '12px', padding: '4px 12px', borderRadius: '12px' }}>Металл</span></div>
                      <div className="mt-2" style={{ fontSize: '11px', color: '#18442A', lineHeight: '1.3' }}>Чугун - 17 руб./кг<br/>Оцинковка - 17 руб./кг<br/>Дюраль - 100 руб./кг<br/>Сталь 5А - 17 руб./кг</div>
                   </div>
                </div>
                
                <hr style={{ margin: '32px -32px 32px -32px', border: 'none', borderTop: '1px solid #E7EFE8', opacity: 1 }} />
                
                <h6 className="font-russkin" style={{ color: '#18442a', fontSize: '23px', textTransform: 'uppercase', margin: '0 0 24px 0' }}>КОММЕНТАРИИ</h6>
                
                <div className="d-flex flex-column gap-4 mb-3">
                  {[
                    { id: 1, authorName: 'Брэд Питт', date: '11 апреля 2026', text: 'Правило номер один: не говорить о приёме вторсырья. Правило номер два: НИКОГДА НЕ ГОВОРИТЬ О ПРИЕМЕ ВТОРСЫРЬЯ.', likesCount: 122, dislikesCount: 0 },
                    { id: 2, authorName: 'Дональд Трамп', date: '1 февраля 2026', text: 'Make вторсырье great again!', likesCount: 0, dislikesCount: 0 },
                    { id: 3, authorName: 'Eminem', date: '13 ноября 2025', text: 'Заплатили копейки, но хоть не потерял себя. Мама, я сдал мусор.', likesCount: 0, dislikesCount: 0 },
                    { id: 4, authorName: 'Тайлер Дерден', date: '10 мая 2025', text: 'Лишь утратив всё до конца, мы обретаем свободу сортировать мусор.', likesCount: 50, dislikesCount: 2 }
                  ]
                  .slice(0, showAllComments ? undefined : 3)
                  .map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </div>
                
                {!showAllComments && (
                  <div className="text-center mb-4 mt-4">
                    <span 
                      style={{ fontSize: '12px', color: '#6BAD86', cursor: 'pointer', fontWeight: '500' }}
                      onClick={() => setShowAllComments(true)}
                    >
                      Показать все комментарии (4)
                    </span>
                  </div>
                )}

                {isAddingComment ? (
                  <div className="mb-4 mt-2">
                    <textarea 
                      className="form-control mb-3" 
                      rows="3" 
                      placeholder="Напишите ваш отзыв..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      style={{ fontSize: '13px', borderRadius: '12px', borderColor: '#E7EFE8' }}
                    ></textarea>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn flex-grow-1 rounded-pill shadow-sm" 
                        style={{ backgroundColor: '#18442a', color: 'white', fontSize: '13px' }}
                        onClick={() => {
                          console.log("Отправка:", newCommentText);
                          setIsAddingComment(false);
                          setNewCommentText('');
                        }}
                      >
                        Отправить
                      </button>
                      <button 
                        className="btn flex-grow-1 rounded-pill" 
                        style={{ backgroundColor: '#F4F6E3', color: '#18442a', fontSize: '13px' }}
                        onClick={() => setIsAddingComment(false)}
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="btn w-100 rounded-pill mb-4 mt-2" 
                    style={{ backgroundColor: '#F4F6E3', color: '#18442a', fontSize: '13px', fontWeight: '500' }}
                    onClick={() => setIsAddingComment(true)}
                  >
                    Оставить комментарий
                  </button>
                )}

                <hr style={{ margin: '32px -32px 0 -32px', border: 'none', borderTop: '1px solid #E7EFE8', opacity: 1 }} />
              
                {isEditingPoint ? (
                  <div className="pt-4 pb-2">
                    <textarea 
                      className="form-control mb-3" 
                      rows="2" 
                      placeholder="Опишите, что нужно исправить..."
                      value={editSuggestion}
                      onChange={(e) => setEditSuggestion(e.target.value)}
                      style={{ fontSize: '12px', borderRadius: '8px', borderColor: '#E7EFE8' }}
                    ></textarea>
                    <div className="d-flex justify-content-end gap-3 align-items-center">
                      <span 
                        style={{ fontSize: '12px', color: '#666', cursor: 'pointer' }}
                        onClick={() => setIsEditingPoint(false)}
                      >Отмена</span>
                      <button 
                        className="btn rounded-pill px-4 py-1"
                        style={{ fontSize: '12px', backgroundColor: '#6BAD86', color: 'white', fontWeight: '600' }}
                        onClick={() => {
                          console.log("Исправление отправлено:", editSuggestion);
                          setIsEditingPoint(false);
                          setEditSuggestion('');
                        }}
                      >Отправить</button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between align-items-center pt-4 pb-2">
                    <div className="d-flex flex-column gap-2" style={{ fontSize: '12px', color: '#18442A' }}>
                      <img src="/icons/person.png" alt="Moderator" style={{ width: '12px', height: '12px' }} />
                      <span style={{ color: '#666' }}>Модератор точки:</span> 
                      <a href="mailto:kolyakorobov@gmail.com" style={{ color: '#18442A', textDecoration: 'none', fontWeight: 500 }}>kolyakorobov@gmail.com</a>
                    </div>
                    <div 
                      className="d-flex flex-column gap-2" 
                      style={{ fontSize: '12px', color: '#6BAD86', cursor: 'pointer', fontWeight: '500' }}
                      onClick={() => setIsEditingPoint(true)}
                    >
                      <span>Предложить исправление</span>
                      <img src="/icons/pencil.png" alt="Edit" style={{ width: '12px', height: '12px' }} />
                    </div>
                  </div>
                )}

              </div>{/* конец скроллящегося div */}
            </div>
          )}

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
              instanceRef={mapRef}
              defaultState={{ center: [56.838011, 60.597474], zoom: 12, controls: [] }} 
              width="100%" 
              height="100%" 
              onLoad={() => {
                setIsMapLoaded(true); 
                setMapError(false);
              }}
            >
              <ZoomControl options={{ position: { right: 20, top: 80 } }} />
              <GeolocationControl options={{ position: { right: 20, top: 40 } }} />

              <div style={{ position: 'fixed', top: '100px', right: '70px', zIndex: 1000 }}>
                <button 
                  className="btn rounded-pill px-4 shadow" 
                  style={{ backgroundColor: '#18442a', color: 'white', fontSize: '14px' }}
                  onClick={() => { setIsAddingPoint(true); setSelectedPointData(null); }}
                >
                  Добавить точку +
                </button>
              </div>

              {filteredPoints.map((point) => {
                const lat = point.coordinates?.lat || point.latitude || point.coordinates?.[0];
                const lng = point.coordinates?.lng || point.longitude || point.coordinates?.[1];
                if (!lat || !lng) return null;

                const isSelected = selectedPointData && selectedPointData.id === point.id;
                
                const textWidth = Math.max(120, point.name.length * 9 + 32); 
                const mid = textWidth / 2;
                
                const svgLabel = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="${textWidth}" height="45" viewBox="0 0 ${textWidth} 45">
                    <path d="
                      M 8 1 
                      L ${textWidth - 8} 1 
                      Q ${textWidth - 1} 1 ${textWidth - 1} 8 
                      L ${textWidth - 1} 28 
                      Q ${textWidth - 1} 35 ${textWidth - 8} 35 
                      L ${mid + 6} 35 
                      L ${mid} 41 
                      L ${mid - 6} 35 
                      L 8 35 
                      Q 1 35 1 28 
                      L 1 8 
                      Q 1 1 8 1 Z
                    " fill="white" stroke="#18442a" stroke-width="1"/>
                    <text x="50%" y="23" font-family="Actay, sans-serif" font-size="15" font-weight="500" fill="#18442a" text-anchor="middle">${point.name}</text>
                  </svg>
                `;
                
                const encodedSvg = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgLabel);

                return (
                  <React.Fragment key={point.id}>
                    <Placemark 
                      geometry={[parseFloat(lat), parseFloat(lng)]}
                      options={{ 
                        iconLayout: 'default#image',
                        iconImageHref: isSelected ? '/icons/marker-filled.png' : '/icons/marker-outline.png',
                        iconImageSize: [40, 40],
                        iconImageOffset: [-20, -40], 
                        zIndex: isSelected ? 1000 : 1
                      }}
                      onClick={() => handlePointClick(point)}
                    />
                    
                    {isSelected && (
                      <Placemark 
                        geometry={[parseFloat(lat), parseFloat(lng)]}
                        options={{ 
                          iconLayout: 'default#image',
                          iconImageHref: encodedSvg,
                          iconImageSize: [textWidth, 50],
                          iconImageOffset: [-(textWidth / 2), -90], 
                          interactive: false,
                          zIndex: 1001
                        }}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </Map>
          </YMaps>
        </div>
      </div>

      <footer className="w-100 d-flex justify-content-between align-items-center" style={{ height: '40px', backgroundColor: '#F4F6E3', paddingLeft: '80px', paddingRight: '80px', flexShrink: 0 }}>
        <div style={{ color: '#18442a', fontSize: '12px', fontWeight: 700, fontFamily: 'Actay, sans-serif' }}>«ГдеСдать» © 2026</div>
        <div style={{ color: '#18442a', fontSize: '12px', fontWeight: 700, fontFamily: 'Actay, sans-serif' }}>Support: <a href="mailto:gdesdat@gmail.com" style={{ color: '#18442a', textDecoration: 'none' }}>gdesdat@gmail.com</a></div>
      </footer>
    </div>
  );
};

const Articles = () => <div className="container-fluid mt-5 text-center"><h1>Статьи и подкасты</h1></div>;

// ---- НАВИГАЦИЯ (ШАПКА) ----
const CustomNavbar = () => {
  const location = useLocation();

  const navLinkStyle = (path) => ({
    color: location.pathname === path ? 'white' : '#18442a',
    backgroundColor: location.pathname === path ? '#18442a' : 'transparent',
    borderRadius: '40px',
    fontSize: '14px',
    fontWeight: 700,
  });

  const rightButtonStyle = (path, isFilled = false) => ({
    color: location.pathname === path ? 'white' : (isFilled ? 'white' : '#18442a'),
    backgroundColor: location.pathname === path
      ? '#18442a'
      : (isFilled ? '#18442a' : 'transparent'),
    border: isFilled ? 'none' : '1px solid #18442a',
    borderRadius: '40px',
    height: '41px',
    paddingLeft: '24px',
    paddingRight: '24px',
    fontSize: '14px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  });

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
      {/* ЛОГОТИП */}
      <div className="d-flex align-items-center" style={{ width: '220px' }}>
        <img
          src="/logo.jpg"
          alt="Логотип"
          style={{ width: '51px', height: '55px', objectFit: 'contain' }}
        />
      </div>

      {/* ЦЕНТРАЛЬНОЕ МЕНЮ */}
      <div
        className="d-flex align-items-center justify-content-between"
        style={{
          width: '503px',
          height: '40px',
          backgroundColor: '#F4F6E3',
          borderRadius: '40px',
          padding: '4px',
        }}
      >
        <Link
          to="/"
          className={`text-decoration-none h-100 d-flex align-items-center justify-content-center flex-grow-1 ${location.pathname === '/' ? 'text-white' : ''}`}
          style={navLinkStyle('/')}
        >
          Главная
        </Link>

        <Link
          to="/map"
          className={`text-decoration-none h-100 d-flex align-items-center justify-content-center flex-grow-1 ${location.pathname === '/map' ? 'text-white' : ''}`}
          style={navLinkStyle('/map')}
        >
          Карта пунктов приема
        </Link>

        <Link
          to="/articles"
          className={`text-decoration-none h-100 d-flex align-items-center justify-content-center flex-grow-1 ${location.pathname === '/articles' ? 'text-white' : ''}`}
          style={navLinkStyle('/articles')}
        >
          Статьи и подкасты
        </Link>
      </div>

      {/* ПРАВАЯ ЧАСТЬ */}
      <div
        className="d-flex justify-content-end align-items-center gap-3"
        style={{ width: '220px' }}
      >
        <Link
          to="/login"
          className="text-decoration-none d-flex align-items-center justify-content-center"
          style={rightButtonStyle('/login', false)}
        >
          Войти
        </Link>

        <Link
          to="/profile"
          className="text-decoration-none d-flex align-items-center justify-content-center"
          style={rightButtonStyle('/profile', true)}
        >
          Личный кабинет
        </Link>
      </div>
    </nav>
  );
};

// ----------------------------------------------------
// Компонент Личного кабинета (Профиль)
// ----------------------------------------------------
const Profile = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('contacts');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    phone: '',
    about: '',
    avatar: null
  });

  const fileInputRef = useRef(null);

  // 1. Загрузка реальных данных профиля с бэкенда
  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        console.warn('Токена нет! Запрос к профилю отменен.');
        return; 
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        
        console.log('✅ Данные профиля получены:', response.data);
        
        setFormData( prev => ({
          ...prev,
          firstName: response.data.first_name || '',
          lastName: response.data.last_name || '',
          email: response.data.email || '',
          city: response.data.city || '',
          phone: response.data.phone || '',
          about: response.data.about || '',
          avatar: response.data.avatar || null
        }));

      } catch (err) {
        console.error('❌ Ошибка загрузки профиля:', err);
      }
    };

    fetchProfileData();
  }, []);

  // 2. Функция загрузки аватарки 
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Для файлов нужен специальный формат FormData
    const uploadData = new FormData();
    uploadData.append('avatar', file);

    try {
      const response = await authService.updateProfile(uploadData);
      // Сразу обновляем картинку на экране
      setFormData(prev => ({ ...prev, avatar: response.avatar }));
      setNotification({ show: true, title: 'Успешно!', message: 'Аватар обновлен.' });
      setTimeout(() => setNotification({ show: false, title: '', message: '' }), 3000);
    } catch (error) {
      console.error("Ошибка загрузки аватара:", error);
      alert("Не удалось загрузить аватар.");
    }
  };

  const [isPasswordEditMode, setIsPasswordEditMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [notification, setNotification] = useState({ show: false, title: '', message: '' });

  // Моковые данные для точек
  const [expandedPointId, setExpandedPointId] = useState(null);
  const mockPoints = [
    {
      id: 1,
      name: 'Пункт сбора «Добрый лес»',
      address: 'г. Березовский, ул. Красных Героев, 3',
      role: 'Модератор',
      types: ['Пластик', 'Бумага', 'Крышки', 'Металл'],
      schedule: 'понедельник-пятница: 16:00 - 19:00;\nсуббота-воскресенье: 10:00 - 16:00.'
    },
    {
      id: 2,
      name: 'Пункт сбора «Уралвторма»',
      address: 'г. Екатеринбург, ул. Чайковского, 82а',
      role: 'Модератор',
      types: ['Пластик', 'Бумага', 'Крышки', 'Металл'],
      schedule: 'понедельник-пятница: 16:00 - 19:00;\nсуббота-воскресенье: 10:00 - 16:00.'
    }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'Пластик': return '#BDE1F8';
      case 'Бумага': return '#FFC4C4';
      case 'Крышки': return '#FFF1A8';
      case 'Металл': return '#C5B4FF';
      default: return '#E0E0E0';
    }
  };

  const togglePoint = (id) => {
    setExpandedPointId(expandedPointId === id ? null : id);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        city: formData.city,
        phone: formData.phone,
        about: formData.about
      };
      await authService.updateProfile(payload); // Реальный вызов API
      setNotification({ show: true, title: 'Готово!', message: 'Изменения сохранены.' });
      setTimeout(() => setNotification({ show: false, title: '', message: '' }), 3000);
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
    }
  };

  // 3. НОВАЯ ФУНКЦИЯ СОХРАНЕНИЯ ПАРОЛЯ
  const handleSavePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.new !== passwordData.confirm) {
      alert("Новые пароли не совпадают!");
      return;
    }

    try {
      await authService.changePassword({
        old_password: passwordData.current,
        new_password: passwordData.new
      });

      setIsPasswordEditMode(false);
      setPasswordData({ current: '', new: '', confirm: '' });
      setNotification({ show: true, title: 'Готово!', message: 'Пароль успешно изменен.' });
      setTimeout(() => setNotification({ show: false, title: '', message: '' }), 3000);
    } catch (error) {
      console.error("Ошибка при смене пароля:", error);
      if (error.response && error.response.data && error.response.data.old_password) {
        alert(error.response.data.old_password[0]);
      } else {
        alert("Не удалось изменить пароль. Проверьте введенные данные.");
      }
    }
  };

  // Общий стиль для всех карточек (без обводки, с тенью)
  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
  };

    // Стейты для уведомлений
  const [notificationTab, setNotificationTab] = useState('incoming'); // 'incoming' или 'outgoing'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNotifId, setExpandedNotifId] = useState(null);

  // НОВЫЙ СТЕЙТ: Открыто ли окно создания уведомления
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Моковые данные уведомлений
  const [mockNotifications, setMockNotifications] = useState([
    {
      id: 1,
      type: 'incoming',
      pointName: 'Пункт сбора «Добрый лес»',
      address: 'г. Березовский, ул. Красных Героев, 3 • Модератор',
      category: 'Предложение по изменению данных',
      isNew: true, 
      date: '24 апреля, 14:20',
      text: 'Пользователь предложил добавить приём пластиковых бутылок 05 (PP) и изменить время работы на выходных до 20:00.'
    },
    {
      id: 2,
      type: 'incoming',
      pointName: 'Пункт сбора «Уралвторма»',
      address: 'г. Екатеринбург, ул. Чайковского, 82а • Модератор',
      category: 'Предложение по изменению данных',
      isNew: false, // Это уже прочитано (без точки)
      date: '22 апреля, 10:55',
      text: 'Пользователь предложил добавить приём пластиковых бутылок 05 (PP) и изменить время работы на выходных до 20:00.'
    }
  ]);

  const markAllAsRead = () => {
    setMockNotifications(prev => prev.map(notif => ({ ...notif, isNew: false })));
  };

  const toggleNotification = (id) => {
    setExpandedNotifId(expandedNotifId === id ? null : id);
  };

  return (
    // ИСПРАВЛЕНИЕ 1: Фон чисто белый
    <div className="d-flex flex-column" style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#FFFFFF' }}>
      
      {/* ИСПРАВЛЕНИЕ 4: Линия под шапкой цвета #E7EFE8 */}
      <div style={{ borderBottom: '2px solid #E7EFE8', backgroundColor: '#FFFFFF', padding: '0 80px' }}>
        <div className="d-flex gap-5">
          <div 
            onClick={() => setActiveTab('contacts')}
            style={{ 
              padding: '24px 0', cursor: 'pointer', fontSize: '15px', 
              color: activeTab === 'contacts' ? '#18442A' : '#6BAD86', 
              borderBottom: activeTab === 'contacts' ? '2px solid #18442A' : '2px solid transparent',
              fontWeight: activeTab === 'contacts' ? '500' : '400', transition: '0.2s',
              marginBottom: '-2px' /* Чтобы зеленая полоса перекрывала серую линию */
            }}
          >
            Контактная информация
          </div>
          <div 
            onClick={() => setActiveTab('points')}
            style={{ 
              padding: '24px 0', cursor: 'pointer', fontSize: '15px', 
              color: activeTab === 'points' ? '#18442A' : '#6BAD86', 
              borderBottom: activeTab === 'points' ? '2px solid #18442A' : '2px solid transparent',
              fontWeight: activeTab === 'points' ? '500' : '400', transition: '0.2s',
              marginBottom: '-2px'
            }}
          >
            Список модерируемых точек
          </div>
          <div 
            onClick={() => setActiveTab('notifications')}
            style={{ 
              padding: '24px 0', cursor: 'pointer', fontSize: '15px', 
              color: activeTab === 'notifications' ? '#18442A' : '#6BAD86', 
              borderBottom: activeTab === 'notifications' ? '2px solid #18442A' : '2px solid transparent',
              fontWeight: activeTab === 'notifications' ? '500' : '400', transition: '0.2s',
              marginBottom: '-2px'
            }}
          >
            Уведомления
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-grow-1" style={{ padding: '40px 80px', position: 'relative' }}>
        
        {activeTab === 'contacts' && (
          <div className="d-flex gap-4 align-items-start">
            
            {/* ЛЕВАЯ КОЛОНКА */}
            <div className="d-flex flex-column gap-4" style={{ width: '320px', flexShrink: 0 }}>
              
              {/* ИСПРАВЛЕНИЕ 2: Карточка профиля с тенью */}
              {/* Карточка профиля с тенью */}
              <div className="p-4 text-center position-relative" style={cardStyle}>
                <div 
                  className="mx-auto rounded-circle d-flex justify-content-center align-items-center position-relative" 
                  style={{ 
                    width: '120px', height: '120px', 
                    background: '#F4F6E3',
                    border: '3px solid transparent',
                    // Убираем градиентную обводку, если аватар уже загружен, чтобы было красивее
                    backgroundImage: formData.avatar ? 'none' : 'linear-gradient(#F4F6E3, #F4F6E3), linear-gradient(180deg, #18442A 0%, #417858 50%, #6BAD86 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'content-box, border-box'
                  }}
                >
                  {/* ЕСЛИ ЕСТЬ АВАТАР - ПОКАЗЫВАЕМ ЕГО, ИНАЧЕ - СМАЙЛИК */}
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar.startsWith('http') ? formData.avatar : `http://127.0.0.1:8000${formData.avatar}`} 
                      alt="avatar" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                    />
                  ) : (
                    <i className="bi bi-person-fill position-relative" style={{ fontSize: '60px', color: '#6BAD86', top: '4px' }}></i>
                  )}
                  
                  {/* СКРЫТЫЙ ИНПУТ ДЛЯ ФАЙЛА */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    style={{ display: 'none' }} 
                    accept="image/*"
                  />

                  {/* КНОПКА РЕДАКТИРОВАНИЯ (КАРАНДАШ) */}
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="position-absolute d-flex justify-content-center align-items-center shadow-sm" 
                    style={{ 
                      width: '32px', height: '32px', 
                      backgroundColor: '#FFCCAB', 
                      borderRadius: '50%', 
                      bottom: '-2px', right: '-2px', 
                      cursor: 'pointer',
                      border: '3px solid #FFFFFF',
                      zIndex: 2
                    }}
                  >
                    <img src="/icons/pencil_filled.png" alt="edit" style={{ width: '14px', height: '14px' }} />
                  </div>
                </div>
                
                <h5 className="mt-3 mb-3" style={{ color: '#18442A', fontWeight: '700', fontSize: '18px' }}>
                  {formData.firstName || formData.lastName ? `${formData.firstName} ${formData.lastName}`.trim() : 'Имя Фамилия'}
                </h5>
                
                {/* ИСПРАВЛЕНИЕ 3: Полоса цвета #F4F6E3 и не прилипает к краям (убран margin: '0 -24px') */}
                <div style={{ borderTop: '2px solid #F4F6E3', marginTop: '16px', paddingTop: '16px' }}>
                  <h4 style={{ color: '#18442A', margin: 0, fontWeight: '700' }}>6</h4>
                  <span style={{ fontSize: '13px', color: '#18442A' }}>модерируемых пунктов</span>
                </div>
              </div>

              {/* ИСПРАВЛЕНИЕ 2: Блок безопасности с тенью */}
              <div className="p-4" style={cardStyle}>
                <h6 className="d-flex align-items-center" style={{ color: '#18442A', fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>
                  <img src="/icons/lock.png" alt="lock" style={{ width: '16px', marginRight: '8px' }} />
                  Безопасность
                </h6>
                
                {isPasswordEditMode ? (
                  <div>
                    <div className="mb-3">
                      <label style={{ fontSize: '13px', color: '#18442A', marginBottom: '6px', display: 'block' }}>Пароль</label>
                      <input type="password" name="current" placeholder="Текущий пароль" value={passwordData.current} onChange={handlePasswordChange} className="form-control" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #18442A', padding: '8px 12px' }} />
                    </div>
                    <div className="mb-3">
                      <label style={{ fontSize: '13px', color: '#18442A', marginBottom: '6px', display: 'block' }}>Новый пароль</label>
                      <input type="password" name="new" placeholder="Новый пароль" value={passwordData.new} onChange={handlePasswordChange} className="form-control" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #18442A', padding: '8px 12px' }} />
                    </div>
                    <div className="mb-3">
                      <label style={{ fontSize: '13px', color: '#18442A', marginBottom: '6px', display: 'block' }}>Подтвердите новый пароль</label>
                      <input type="password" name="confirm" placeholder="Повторно введите новый пароль" value={passwordData.confirm} onChange={handlePasswordChange} className="form-control" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #18442A', padding: '8px 12px' }} />
                    </div>
                    <button onClick={handleSavePassword} className="btn w-100 mt-2" style={{ backgroundColor: '#18442A', color: '#FFFFFF', fontSize: '13px', fontWeight: '500', borderRadius: '8px', padding: '10px' }}>Сохранить пароль</button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-3">
                      <label style={{ fontSize: '13px', color: '#18442A', marginBottom: '6px', display: 'block' }}>Пароль</label>
                      <input type="password" placeholder="*********" disabled className="form-control" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #18442A', padding: '8px 12px', backgroundColor: '#fff' }} />
                    </div>
                    <button onClick={(e) => { e.preventDefault(); setIsPasswordEditMode(true); }} className="btn w-100" style={{ backgroundColor: '#18442A', color: '#FFFFFF', fontSize: '13px', fontWeight: '500', borderRadius: '8px', padding: '10px' }}>Изменить пароль</button>
                  </div>
                )}
              </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА */}
            <div className="d-flex flex-column" style={{ maxWidth: '1100px', flexGrow: 1 }}>
              
              {/* ИСПРАВЛЕНИЕ 2: Настройки профиля с тенью */}
              <div className="p-5 mb-4" style={cardStyle}>
                <h4 style={{ color: '#18442A', fontWeight: '700', marginBottom: '32px' }}>Настройки профиля</h4>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 style={{ color: '#18442A', fontWeight: '700', fontSize: '14px', marginBottom: '20px' }}>Личные данные</h6>
                    <div className="mb-3">
                      <label style={{ fontSize: '13px', color: '#18442A', marginBottom: '6px', display: 'block' }}>Имя*</label>
                      {/* ДОБАВЛЕНО value и onChange */}
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Введите ваше имя" className="form-control" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #18442A', padding: '10px 12px' }} />
                    </div>
                    <div className="mb-3">
                      <label style={{ fontSize: '13px', color: '#18442A', marginBottom: '6px', display: 'block' }}>Фамилия*</label>
                      {/* ДОБАВЛЕНО value и onChange */}
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Введите вашу фамилию" className="form-control" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #18442A', padding: '10px 12px' }} />
                    </div>
                    <div className="mb-3">
                      <label style={{ fontSize: '13px', color: '#18442A', marginBottom: '6px', display: 'block' }}>Город проживания</label>
                      {/* ДОБАВЛЕНО value и onChange */}
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Начните вводить..." className="form-control" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #18442A', padding: '10px 12px' }} />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h6 style={{ color: '#18442A', fontWeight: '700', fontSize: '14px', marginBottom: '20px' }}>Контактная информация</h6>
                    <div className="mb-3">
                      <label style={{ fontSize: '13px', color: '#18442A', marginBottom: '6px', display: 'block' }}>Email*</label>
                      <div className="position-relative">
                        <img src="/icons/mail.png" alt="mail" style={{ width: '16px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        {/* ДОБАВЛЕНО value и onChange. Сделали disabled, так как email обычно меняют по-другому */}
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled placeholder="Введите ваш email" className="form-control" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #18442A', padding: '10px 12px 10px 38px', backgroundColor: '#f9f9f9' }} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label style={{ fontSize: '13px', color: '#18442A', marginBottom: '6px', display: 'block' }}>Номер телефона</label>
                      {/* ДОБАВЛЕНО value и onChange */}
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+ 7 (___) - ___ - __ - __" className="form-control" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #18442A', padding: '10px 12px' }} />
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <label style={{ fontSize: '13px', color: '#18442A', marginBottom: '6px', display: 'block' }}>Обо мне</label>
                  {/* ДОБАВЛЕНО value и onChange в textarea */}
                  <textarea name="about" value={formData.about} onChange={handleInputChange} placeholder="Расскажите о себе" className="form-control" style={{ fontSize: '14px', borderRadius: '8px', border: '1px solid #18442A', padding: '12px', minHeight: '100px', resize: 'none' }}></textarea>
                </div>

                <div className="d-flex align-items-center gap-4">
                  <button onClick={handleSaveProfile} className="btn px-5 py-2" style={{ backgroundColor: '#18442A', color: '#FFFFFF', fontSize: '14px', fontWeight: '500', borderRadius: '8px' }}>Сохранить изменения</button>
                  <span onClick={onLogout} style={{ fontSize: '14px', color: '#18442A', cursor: 'pointer', fontWeight: '500' }}>Выйти</span>
                  <span className="ms-auto" style={{ fontSize: '13px', color: '#FF8A8A', cursor: 'pointer' }}>Удалить аккаунт</span>
                </div>
              </div>

              {/* ИСПРАВЛЕНИЕ 2: Блок со смайликом с тенью */}
              <div className="d-flex align-items-center" style={{ ...cardStyle, padding: '16px 24px' }}>
                <img src="/icons/smile.png" alt="smile" style={{ width: '28px', height: '28px', marginRight: '16px' }} />
                <span style={{ fontSize: '13px', color: '#18442A', lineHeight: '1.4', fontWeight: '500' }}>
                  Заполненный профиль помогает нам делать сервис удобнее именно для вас. Мы гарантируем абсолютную конфиденциальность и защиту ваших персональных данных.
                </span>
              </div>
              
            </div>
          </div>
        )}

        {/* СПИСОК МОДЕРИРУЕМЫХ ТОЧЕК */}
        {activeTab === 'points' && (
          <div className="d-flex flex-column gap-3" style={{ maxWidth: '800px' }}>
            {mockPoints.map(point => {
              const isExpanded = expandedPointId === point.id;
              return (
                // ИСПРАВЛЕНИЕ 2: Карточка точки с тенью
                <div key={point.id} style={{ ...cardStyle, overflow: 'hidden', transition: 'all 0.3s ease' }}>
                  
                  <div 
                    onClick={() => togglePoint(point.id)}
                    className="d-flex justify-content-between align-items-center p-4" 
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="d-flex justify-content-center align-items-center" 
                        style={{ width: '48px', height: '48px', backgroundColor: '#F4F6E3', borderRadius: '12px' }}
                      >
                        {/* ИСПРАВЛЕНИЕ 5: Картинка маркера в формате PNG */}
                        <img src="/icons/marker-outline.png" alt="marker" style={{ width: '24px' }} />
                      </div>
                      <div>
                        <h6 style={{ margin: 0, color: '#18442A', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                          {point.name}
                        </h6>
                        <span style={{ color: '#6BAD86', fontSize: '13px' }}>
                          {point.address} • {point.role}
                        </span>
                      </div>
                    </div>
                    <i 
                      className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`} 
                      style={{ color: '#18442A', fontSize: '18px', transition: 'transform 0.3s' }}
                    ></i>
                  </div>

                  {isExpanded && (
                    <div className="p-4 pt-0" style={{ borderTop: '1px solid #E7EFE8' }}>
                      <div className="row mt-4">
                        <div className="col-md-6 mb-4 mb-md-0">
                          <span style={{ fontSize: '13px', color: '#18442A', fontWeight: '600', display: 'block', marginBottom: '12px' }}>
                            Принимаемые типы отходов:
                          </span>
                          <div className="d-flex flex-wrap gap-2 mb-4">
                            {point.types.map(type => (
                              <span 
                                key={type} 
                                style={{ 
                                  backgroundColor: getTypeColor(type), 
                                  color: '#18442A', 
                                  fontSize: '13px', 
                                  padding: '6px 12px', 
                                  borderRadius: '8px', /* ИСПРАВЛЕНИЕ 6: Скругление 8px как у кнопок */
                                  fontWeight: '500'
                                }}
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                          
                          <div className="d-flex gap-3">
                            {/* ИСПРАВЛЕНИЕ 7: Кнопка Редактировать теперь ссылка-роут <Link> */}
                            <Link 
                              to={`/edit-point/${point.id}`} 
                              className="btn d-inline-flex align-items-center justify-content-center" 
                              style={{ backgroundColor: '#18442A', color: 'white', fontSize: '13px', fontWeight: '500', borderRadius: '8px', padding: '8px 20px', textDecoration: 'none' }}
                            >
                              Редактировать
                            </Link>
                            <button 
                              className="btn" 
                              style={{ backgroundColor: '#F4F6E3', color: '#18442A', fontSize: '13px', fontWeight: '500', borderRadius: '8px', padding: '8px 20px' }}
                            >
                              Подробнее
                            </button>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <span style={{ fontSize: '13px', color: '#18442A', fontWeight: '600', display: 'block', marginBottom: '12px' }}>
                            Режим работы:
                          </span>
                          <div style={{ fontSize: '13px', color: '#18442A', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                            {point.schedule}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* УНИВЕРСАЛЬНОЕ УВЕДОМЛЕНИЕ */}
        {notification.show && (
          <div className="d-flex align-items-center gap-3 shadow p-3" style={{ position: 'fixed', bottom: '40px', right: '40px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E7EFE8', minWidth: '320px', zIndex: 9999 }}>
            <div className="d-flex justify-content-center align-items-center" style={{ width: '44px', height: '44px', backgroundColor: '#6BAD86', borderRadius: '50% 50% 8px 50%' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9.5 17.5L19 6.5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-grow-1">
              <h6 style={{ margin: 0, color: '#18442A', fontWeight: '700', fontSize: '14px' }}>{notification.title}</h6>
              <span style={{ fontSize: '13px', color: '#18442A' }}>{notification.message}</span>
            </div>
            <i className="bi bi-x-lg" style={{ color: '#18442A', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }} onClick={() => setNotification({ show: false, title: '', message: '' })}></i>
          </div>
        )}

        {/* ВКЛАДКА УВЕДОМЛЕНИЙ */}
        {activeTab === 'notifications' && (
          <div className="d-flex flex-column gap-4" style={{ maxWidth: '800px' }}>
            
            {/* Панель управления: Входящие/Исходящие и "Пометить всё" */}
            <div className="d-flex justify-content-between align-items-center">
              
              {/* Переключатель */}
              <div 
                className="d-flex p-1" 
                style={{ border: '1px solid #E7EFE8', borderRadius: '40px', backgroundColor: '#FFFFFF' }}
              >
                <button 
                  onClick={() => setNotificationTab('incoming')}
                  className="btn rounded-pill border-0" 
                  style={{ 
                    padding: '8px 24px', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    backgroundColor: notificationTab === 'incoming' ? '#18442A' : 'transparent',
                    color: notificationTab === 'incoming' ? '#FFFFFF' : '#18442A'
                  }}
                >
                  Входящие
                </button>
                <button 
                  onClick={() => setNotificationTab('outgoing')}
                  className="btn rounded-pill border-0" 
                  style={{ 
                    padding: '8px 24px', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    backgroundColor: notificationTab === 'outgoing' ? '#18442A' : 'transparent',
                    color: notificationTab === 'outgoing' ? '#FFFFFF' : '#18442A'
                  }}
                >
                  Исходящие
                </button>
              </div>

              {/* Кнопка Пометить прочитанным (показываем только для входящих) */}
              {notificationTab === 'incoming' && (
                <span 
                  onClick={markAllAsRead}
                  style={{ 
                    color: '#18442A', // ИСПРАВЛЕНИЕ: Цвет #18442A
                    fontSize: '14px', 
                    textDecoration: 'underline', 
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Пометить все прочитанным
                </span>
              )}
            </div>

            {/* Список уведомлений */}
            <div className="d-flex flex-column gap-3 mt-2">
              {mockNotifications
                .filter(n => n.type === notificationTab)
                .map(notif => {
                  const isExpanded = expandedNotifId === notif.id;
                  return (
                    <div 
                      key={notif.id} 
                      style={{ 
                        backgroundColor: '#FFFFFF', 
                        borderRadius: '16px', 
                        border: '1px solid #E7EFE8', 
                        boxShadow: '0 4px 24px rgba(0,0,0,0.02)',
                        transition: 'all 0.3s ease' 
                      }}
                    >
                      <div 
                        onClick={() => toggleNotification(notif.id)}
                        className="p-4 d-flex justify-content-between align-items-center" 
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex flex-column gap-2 w-100">
                          
                          {/* ИСПРАВЛЕНИЕ: Дата-плашка внутри карточки над текстом */}
                          <div 
                            style={{ 
                              backgroundColor: '#F4F6E3', 
                              color: '#A0A0A0', 
                              fontSize: '12px', 
                              padding: '4px 12px', 
                              borderRadius: '8px',
                              alignSelf: 'flex-start',
                              marginLeft: '28px' // Отступ, чтобы плашка была на уровне текста
                            }}
                          >
                            {notif.date}
                          </div>

                          <div className="d-flex align-items-start gap-3">
                            {/* Зеленая точка-индикатор для новых */}
                            <div className="pt-2" style={{ width: '12px', flexShrink: 0 }}>
                              {notif.isNew && (
                                <div style={{ width: '12px', height: '12px', backgroundColor: '#6BAD86', borderRadius: '50%' }}></div>
                              )}
                            </div>
                            
                            <div>
                              <h6 style={{ margin: 0, color: '#18442A', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                                {notif.pointName}
                              </h6>
                              <div style={{ color: '#A0A0A0', fontSize: '14px', marginBottom: '8px' }}>
                                {notif.address}
                              </div>
                              <div style={{ color: '#6BAD86', fontSize: '15px', fontWeight: '500' }}>
                                {notif.category}
                              </div>
                            </div>
                          </div>

                        </div>
                        
                        <i 
                          className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`} 
                          style={{ color: '#18442A', fontSize: '18px', transition: 'transform 0.3s', flexShrink: 0, marginTop: 'auto', marginBottom: 'auto' }}
                        ></i>
                      </div>

                      {/* Развернутый текст */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1" style={{ paddingLeft: '60px' }}> {/* Отступ слева чтобы текст шел вровень с заголовком */}
                          <hr style={{ borderColor: '#E7EFE8', margin: '0 0 16px 0' }} />
                          <p style={{ color: '#18442A', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                            {notif.text}
                          </p>
                        </div>
                      )}
                    </div>
                  );
              })}
              
              {/* Пустое состояние */}
              {mockNotifications.filter(n => n.type === notificationTab).length === 0 && (
                <div className="text-center py-5" style={{ color: '#A0A0A0' }}>
                  Здесь пока нет уведомлений
                </div>
              )}
            </div>
          </div>
        )}

      {/* --------------------------------------------------- */}
      {/* МОДАЛЬНОЕ ОКНО "СОЗДАТЬ УВЕДОМЛЕНИЕ" */}
      {/* --------------------------------------------------- */}
      {isCreateModalOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.4)', 
            backdropFilter: 'blur(8px)',                  
            WebkitBackdropFilter: 'blur(8px)',            
            zIndex: 9999                                  
          }}
        >
          <div 
            className="bg-white d-flex flex-column" 
            style={{ 
              width: '401px',       // Точная ширина из Фигмы
              height: '290px',      // Точная высота из Фигмы
              padding: '24px 32px', // Уменьшил паддинги, чтобы всё влезло
              borderRadius: '16px', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              border: '1px solid #E7EFE8'
            }}
          >
            {/* ИСПРАВЛЕНИЕ 1: Шрифт Actay Wide */}
            <h5 
              className="mb-3" 
              style={{ 
                color: '#18442A', 
                fontSize: '18px', 
                fontFamily: '"Actay", sans-serif', // Подключение шрифта
                fontWeight: '700'
              }}
            >
              Новое уведомление
            </h5>

            {/* Выбор точки */}
            <div className="mb-3">
              <label style={{ fontSize: '12px', color: '#18442A', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                Выберите точку
              </label>
              <div className="position-relative">
                <select 
                  className="form-select w-100 shadow-none" 
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '8px', 
                    border: '1px solid #18442A', 
                    fontSize: '13px', 
                    color: '#18442A',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    /* ВАЖНО: три строчки ниже убирают стрелку на всех браузерах */
                    WebkitAppearance: 'none', 
                    MozAppearance: 'none',
                    appearance: 'none',
                    backgroundImage: 'none' /* Убирает дефолтную стрелку от form-select из Bootstrap */
                  }}
                  defaultValue=""
                >
                  <option value="" disabled hidden>Пункт приема</option>
                  <option value="1">Пункт сбора «Добрый лес»</option>
                  <option value="2">Пункт сбора «Уралвторма»</option>
                </select>
                <i 
                  className="bi bi-chevron-down position-absolute" 
                  style={{ right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#18442A', fontSize: '12px', pointerEvents: 'none' }}
                ></i>
              </div>
            </div>

            {/* Текст акции/уведомления */}
            <div className="mb-auto">
              <label style={{ fontSize: '12px', color: '#18442A', fontWeight: '500', display: 'block', marginBottom: '6px' }}>
                Текст акции
              </label>
              <textarea 
                placeholder="Например: Скидка 20% на прием макулатуры..." 
                className="form-control w-100 shadow-none" 
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: '8px', 
                  border: '1px solid #18442A', // ИСПРАВЛЕНИЕ 2: Зеленая рамка
                  fontSize: '13px', 
                  height: '60px',              // Ограничил высоту, чтобы влезло в 290px
                  resize: 'none' 
                }}
              ></textarea>
            </div>

            {/* Кнопки "Отмена" и "Опубликовать" */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span 
                onClick={() => setIsCreateModalOpen(false)}
                style={{ fontSize: '13px', color: '#18442A', cursor: 'pointer', fontWeight: '500' }}
              >
                Отмена
              </span>
              <button 
                className="btn border-0" 
                onClick={() => {
                  alert("Уведомление опубликовано!");
                  setIsCreateModalOpen(false);
                }}
                style={{ 
                  backgroundColor: '#18442A', 
                  color: 'white', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  borderRadius: '8px', 
                  padding: '8px 20px' 
                }}
              >
                Опубликовать
              </button>
            </div>
            
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

// ----------------------------------------------------
// Компонент Редактирования точки (Заглушка)
// ----------------------------------------------------
const EditPoint = () => {
  return (
    <div className="d-flex flex-column" style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#FFFFFF' }}>
      <div style={{ padding: '40px 80px' }}>
        <h4 style={{ color: '#18442A', fontWeight: '700', marginBottom: '32px' }}>РЕДАКТИРОВАНИЕ ТОЧКИ</h4>
        <div className="bg-white p-5" style={{ borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <p style={{ color: '#18442A' }}>Здесь будет форма редактирования выбранной точки (такая же, как при добавлении).</p>
          <Link to="/profile" className="btn" style={{ backgroundColor: '#18442A', color: 'white', marginTop: '20px' }}>
            Вернуться в профиль
          </Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // При первой загрузке сайта проверяем, вошел ли пользователь ранее
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoadingAuth(false);
        return;
      }
      try {
        const userProfile = await authService.getProfile();
        setCurrentUser(userProfile);
      } catch (error) {
        // Токен невалидный или протух — разлогиниваем
        authService.logout();
        setCurrentUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkAuth();

    // Слушаем событие, когда оба токена протухли (из axios.js)
    const handleAuthExpired = () => setCurrentUser(null);
    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Пока идет проверка токена, можно показать спиннер или пустой экран
  if (isLoadingAuth) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        <div className="spinner-border" style={{ color: '#18442a' }} role="status"></div>
      </div>
    );
  }

  return (
    <Router>
      {/* Передаем данные о юзере в шапку сайта */}
      <CustomNavbar currentUser={currentUser} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Передаем currentUser в MapPage, чтобы там проверять, можно ли добавить точку */}
        <Route path="/map" element={<MapPage currentUser={currentUser} />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/profile" element={<Profile currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/edit-point/:id" element={<EditPoint />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;