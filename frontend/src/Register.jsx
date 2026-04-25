import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreement: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.agreement) {
      setError('Необходимо согласие на обработку данных');
      return;
    }

    try {
      console.log('Попытка регистрации с данными:', formData);
      
      // Отправляем данные на бэкенд
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        username: formData.email.split('@')[0], // Генерируем username из email (до @), т.к. Django требует username
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName
      });

      console.log('Успешная регистрация:', response.data);
      
      // Сразу после регистрации перекидываем на страницу входа
      alert("Регистрация прошла успешно! Теперь вы можете войти.");
      navigate('/login');

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        // Если сервер вернул список ошибок (например, "Такой email уже существует")
        const errorMessages = Object.values(err.response.data).flat().join(', ');
        setError(errorMessages || 'Ошибка при регистрации. Проверьте введенные данные.');
      } else {
        setError('Ошибка при подключении к серверу');
      }
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#FFFFFF' }}>
      
      <div className="flex-grow-1 d-flex align-items-center justify-content-center py-4">
        <div 
          className="d-flex shadow-sm" 
          style={{ 
            width: '100%', 
            maxWidth: '1000px', 
            height: '560px', 
            borderRadius: '24px', 
            overflow: 'hidden',
            backgroundColor: '#F4F6E3',
            margin: '0 40px'
          }}
        >
          {/* ЛЕВАЯ ЗЕЛЕНАЯ ЧАСТЬ */}
          <div 
            className="d-flex flex-column justify-content-center p-5" 
            style={{ width: '50%', backgroundColor: '#18442A', color: '#F4F6E3' }} 
          >
            <h2 className="font-russkin mb-4" style={{ fontSize: '42px', lineHeight: '1.1' }}>
              БОЛЬШЕ ВОЗМОЖНОСТЕЙ С АККАУНТОМ:
            </h2>
            <p style={{ fontSize: '15px', lineHeight: '1.5', marginBottom: '30px', opacity: 0.9 }}>
              Создание и редактирование точек, возможность<br/>оставлять комментарии и публиковать статьи.
            </p>
            
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-3">
                <img src="/icons/check_login.png" alt="check" style={{ width: '18px', height: '18px' }} />
                <span style={{ fontSize: '15px' }}>Управление персональными точками</span>
              </div>
              <div className="d-flex align-items-center gap-3">
                <img src="/icons/check_login.png" alt="check" style={{ width: '18px', height: '18px' }} />
                <span style={{ fontSize: '15px' }}>Статьи и сообщество</span>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ СВЕТЛАЯ ЧАСТЬ (ФОРМА) */}
          <div className="d-flex flex-column align-items-center p-4" style={{ width: '50%', height: '100%' }}>
            
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
              <h2 className="font-russkin m-0 mt-3" style={{ fontSize: '42px', color: '#18442A' }}>РЕГИСТРАЦИЯ</h2>
            </div>
            
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '340px' }}>
              
              <div className="mb-2">
                <label style={{ fontSize: '14px', color: '#18442A', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Имя</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Введите ваше имя"
                  required
                  style={{ 
                    width: '100%', padding: '8px 12px', 
                    borderRadius: '4px', border: '1px solid #18442A', 
                    fontSize: '14px', backgroundColor: '#FFFFFF', color: '#18442A'
                  }} 
                />
              </div>

              <div className="mb-2">
                <label style={{ fontSize: '14px', color: '#18442A', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Фамилия</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Введите вашу фамилию"
                  required
                  style={{ 
                    width: '100%', padding: '8px 12px', 
                    borderRadius: '4px', border: '1px solid #18442A', 
                    fontSize: '14px', backgroundColor: '#FFFFFF', color: '#18442A'
                  }} 
                />
              </div>

              <div className="mb-2">
                <label style={{ fontSize: '14px', color: '#18442A', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Введите ваш email"
                  required
                  style={{ 
                    width: '100%', padding: '8px 12px', 
                    borderRadius: '4px', border: '1px solid #18442A', 
                    fontSize: '14px', backgroundColor: '#FFFFFF', color: '#18442A'
                  }} 
                />
              </div>

              <div className="mb-2">
                <label style={{ fontSize: '14px', color: '#18442A', fontWeight: '600', marginBottom: '4px', display: 'block' }}>Пароль</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="***********"
                  required
                  style={{ 
                    width: '100%', padding: '8px 12px', 
                    borderRadius: '4px', border: '1px solid #18442A', 
                    fontSize: '14px', backgroundColor: '#FFFFFF', color: '#18442A'
                  }} 
                />
              </div>

              {/* КАСТОМНЫЙ ЧЕКБОКС С PNG-ГАЛОЧКОЙ */}
              <div className="mb-3 d-flex align-items-center" onClick={() => setFormData({ ...formData, agreement: !formData.agreement })} style={{ cursor: 'pointer' }}>
                <div 
                  className="d-flex justify-content-center align-items-center"
                  style={{ 
                    width: '16px', height: '16px', marginRight: '8px', 
                    border: '1px solid #18442A', borderRadius: '3px',
                    backgroundColor: formData.agreement ? '#18442A' : '#FFFFFF',
                    flexShrink: 0
                  }}
                >
                  {formData.agreement && (
                    <img src="/icons/check_login.png" alt="check" style={{ width: '12px', height: '12px', filter: 'brightness(0) invert(1)' }} />
                  )}
                </div>
                <span style={{ fontSize: '11px', color: '#18442A', margin: 0, userSelect: 'none' }}>
                  Я согласен на обработку персональных данных
                </span>
              </div>

              {error && <div style={{ color: 'red', fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}

              <button 
                type="submit" 
                className="btn w-100 mb-4" 
                style={{ backgroundColor: '#18442A', color: 'white', borderRadius: '8px', padding: '10px', fontWeight: '500', fontSize: '15px' }}
              >
                Зарегистрироваться
              </button>

              <div className="text-center w-100">
                {/* Разделяющая линия */}
                <hr style={{ borderColor: '#6BAD86', margin: '0 0 10px 0', borderWidth: '1px', opacity: 1 }} />
                {/* Текст под линией */}
                <span style={{ fontSize: '12px', color: '#18442A' }}>
                  Уже есть аккаунт? <Link to="/login" style={{ color: '#18442A', textDecoration: 'none', fontWeight: '600' }}>Войти</Link>
                </span>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* ФУТЕР */}
      <footer 
        className="w-100 d-flex justify-content-between align-items-center" 
        style={{ 
          height: '40px', 
          backgroundColor: '#F4F6E3', 
          paddingLeft: '80px',
          paddingRight: '80px',
          color: '#18442a',
          fontSize: '12px',
          fontWeight: 700,
          marginTop: 'auto'
        }}
      >
        <div>«ГдеСдать» © 2026</div>
        <div>Support: <a href="mailto:gdesdat@gmail.com" style={{ color: '#18442a', textDecoration: 'none' }}>gdesdat@gmail.com</a></div>
      </footer>

    </div>
  );
};

export default Register;