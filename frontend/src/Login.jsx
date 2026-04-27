import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authService } from './api/services';

// ИСПРАВЛЕНИЕ: Добавили прием пропса setCurrentUser
const Login = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Попытка входа с данными:', formData);
      
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: formData.email.split('@')[0], 
        password: formData.password
      });

      console.log('Токены получены:', response.data);
      
      // Сохраняем токены
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // ИСПРАВЛЕНИЕ: Сразу получаем профиль и обновляем глобальное состояние (шапку)
      try {
        const userProfile = await authService.getProfile();
        setCurrentUser(userProfile);
      } catch (profileErr) {
        console.error("Не удалось подтянуть профиль после входа", profileErr);
      }

      // Перекидываем пользователя в профиль
      navigate('/profile');

    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        setError('Неверный логин или пароль');
      } else {
        setError('Ошибка при подключении к серверу');
      }
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: '#FFFFFF' }}>
      
      {/* ЦЕНТРАЛЬНЫЙ КОНТЕНТ */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div 
          className="d-flex shadow-sm" 
          style={{ 
            width: '100%', 
            maxWidth: '1000px', 
            height: '500px', 
            borderRadius: '24px', 
            overflow: 'hidden',
            backgroundColor: '#F4F6E3',
            margin: '40px'
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
          <div className="d-flex flex-column align-items-center p-5" style={{ width: '50%', height: '100%' }}>
            
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
              <h2 className="font-russkin m-0" style={{ fontSize: '42px', color: '#18442A' }}>АВТОРИЗАЦИЯ</h2>
            </div>
            
            <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '340px', paddingBottom: '10px' }}>
              
              <div className="mb-3">
                <label style={{ fontSize: '16px', color: '#18442A', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="kirkoroff@mail.ru"
                  required
                  style={{ 
                    width: '100%', padding: '12px 16px', 
                    borderRadius: '4px', 
                    border: '1px solid #18442A', 
                    fontSize: '15px', 
                    backgroundColor: '#FFFFFF',
                    color: '#18442A'
                  }} 
                />
              </div>

              <div className="mb-2">
                <label style={{ fontSize: '16px', color: '#18442A', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Пароль</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="***********"
                  required
                  style={{ 
                    width: '100%', padding: '12px 16px', 
                    borderRadius: '4px', 
                    border: '1px solid #18442A', 
                    fontSize: '15px', 
                    backgroundColor: '#FFFFFF',
                    color: '#18442A'
                  }} 
                />
              </div>

              <div className="d-flex justify-content-end mb-4">
                <span 
                  style={{ fontSize: '12px', color: '#18442A', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => alert("Функция восстановления пароля в разработке")}
                >
                  Восстановление пароля
                </span>
              </div>

              {error && <div style={{ color: 'red', fontSize: '13px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

              <button 
                type="submit" 
                className="btn w-100 mb-4" 
                style={{ backgroundColor: '#18442A', color: 'white', borderRadius: '8px', padding: '12px', fontWeight: '500', fontSize: '15px' }}
              >
                Войти
              </button>

              <div className="position-relative text-center mb-4">
                <hr style={{ borderColor: '#6BAD86', margin: '0', borderWidth: '1px', opacity: 1 }} />
                <span 
                  className="d-flex align-items-center justify-content-center"
                  style={{ 
                    position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', 
                    backgroundColor: '#F4F6E3', padding: '0 10px', fontSize: '12px', color: '#18442A' 
                  }}
                >
                  Нет аккаунта?
                </span>
              </div>

              <Link 
                to="/register" 
                className="btn w-100 d-flex align-items-center justify-content-center" 
                style={{ border: '1px solid #18442A', color: '#18442A', borderRadius: '8px', padding: '12px', fontWeight: '500', fontSize: '15px', textDecoration: 'none' }}
              >
                Зарегистрироваться
              </Link>

            </form>
          </div>
        </div>
      </div>

      {/* ОБНОВЛЕННЫЙ ФУТЕР */}
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

export default Login;