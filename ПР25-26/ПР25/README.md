
## Ссылки на задеплоенные приложения

- Frontend URL: `https://your-app.vercel.app`
- Backend URL: `https://your-api.railway.app`

## Описание процесса деплоя

### Backend
1. Подготовка: Настройка production конфигурации, миграций БД
2. Деплой: Автоматический деплой через GitHub integration
3. База данных: PostgreSQL с автоматическим provisioning
4. Переменные: Настройка environment variables в Railway dashboard

### Frontend
1. Сборка: Production build с оптимизацией
2. Деплой: Continuous deployment из main ветки
3. Настройка: SPA routing, environment variables, headers

## Используемые платформы и настройки

### Backend Stack
- Платформа: Railway
- База данных: PostgreSQL

### Frontend Stack
- Платформа: Vercel
- Фреймворк: React + Vite
