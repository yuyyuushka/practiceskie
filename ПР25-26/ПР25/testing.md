
# Тестовые сценарии после деплоя

1. Доступность приложения
curl -I https://your-frontend.vercel.app
# Ожидаем: HTTP/2 200

# Проверка бэкенда  
curl https://your-backend.railway.app/api/health
# Ожидаем: {"status":"ok","timestamp":"2025-01-01T10:00:00.000Z"}

2. Работа API endpoints
const endpoints = [
  '/api/health',
  '/api/users/test',
  '/api/posts/public'
];

endpoints.forEach(endpoint => {
  fetch(`https://your-backend.railway.app${endpoint}`)
    .then(res => console.log(`${endpoint}: ${res.status}`))
    .catch(err => console.error(`${endpoint}: ERROR`));
});

3. Обработка ошибок
curl https://your-backend.railway.app/api/nonexistent
# Ожидаем: {"error":"Not found"} с статусом 404

# Тест 500 ошибки
curl -X POST https://your-backend.railway.app/api/trigger-error

4. Производительность
# Проверка времени ответа
time curl -s https://your-backend.railway.app/api/health > /dev/null
# Проверка загрузки фронтенда
curl -w "\nTime: %{time_total}s\n" https://your-frontend.vercel.app