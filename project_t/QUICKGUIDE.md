# 🚀 Шпаргалка по проекту (Docker + Django + React)

## 🐳 Docker: Управление контейнерами
Запускаются из корня проекта, где лежит `docker-compose.yml`.

* `docker-compose up` — запуск всех сервисов и вывод логов в консоль.
* `docker-compose up -d` — запуск контейнеров в фоновом режиме.
* `docker-compose up --build` — пересборка образов и запуск (нужно при изменении `requirements.txt` или `Dockerfile`).
* `docker-compose stop` — остановка работы контейнеров.
* `docker-compose down` — полная остановка и удаление контейнеров.
* `docker-compose restart backend` — перезапуск только сервера Django (полезно при правке `settings.py`).
* `docker-compose ps` — просмотр статуса запущенных контейнеров.
* `docker-compose exec backend pip freeze > requirements.txt`

---

## 🐍 Django: Бэкенд (внутри Docker)
Команды пробрасываются через `docker-compose exec` в работающий контейнер. Используется файл `manage.py`.

* `docker-compose exec backend python manage.py migrate` — применение миграций к базе данных.
* `docker-compose exec backend python manage.py makemigrations` — создание новых файлов миграций при изменении `models.py`.
* `docker-compose exec backend python manage.py createsuperuser` — создание администратора для входа в панель `/admin/`.
* `docker-compose exec backend python manage.py shell` — запуск интерактивной консоли Python внутри проекта.
* `docker-compose exec backend python --version` — проверка версии Python в контейнере (должна быть 3.12.9).

---

## ⚛️ React: Фронтенд (внутри Docker)
Управление через сервис `frontend`.

* `docker-compose exec frontend npm install axios` — установка библиотеки `axios` прямо в контейнер.
* `docker-compose exec frontend npm run dev` — ручной запуск сервера разработки Vite.

---

## 💻 Локальная разработка (без Docker)
Для работы напрямую в Windows через виртуальное окружение.

* `venv\Scripts\activate` — активация виртуального окружения (Windows).
* `pip install -r requirements.txt` — установка зависимостей бэкенда.
* `python manage.py runserver` — запуск Django локально.
* `cd frontend && npm run dev` — запуск React (Vite) из папки фронтенда.
* `pip freeze > requirements.txt` - обновить или создать файл requirements.txt
* `python manage.py migrate`

---

## 🐙 Git: Командная работа
* `git checkout <branch_name>` — переключение на рабочую ветку.
* `git pull origin <branch_name>` — получение свежего кода от коллег.
* `git add .` — подготовка файлов к сохранению.
* `git commit -m "описание"` — сохранение изменений.
* `git push origin <branch_name>` — отправка кода на GitHub.

---

## 🛠️ Решение проблем (Troubleshooting)
* **Ошибка CORS:** проверьте `CORS_ALLOWED_ORIGINS` в `core/settings.py`. Там должен быть адрес `http://localhost:5174` (или текущий порт React).
* **Ошибка "no such table":** выполните команду `migrate`.
* **Кастомная модель пользователя:** в проекте используется `api.User`, что указано в `AUTH_USER_MODEL`.
* **Очистка Docker:** `docker system prune` — если место на диске закончилось или контейнеры ведут себя странно.