
### Authentication
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Логин

### Protected Routes
- `GET /api/protected` - Для аутентифицированных пользователей
- `GET /api/user-data` - Для ролей user/admin
- `GET /api/admin-data` - Только для admin

## Setup
1. `npm install`
2. `npm run migrate`
3. `npm start`

## Testing
node test-auth.js