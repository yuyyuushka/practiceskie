# Library API
RESTful API для системы управления библиотекой, построенное на Express.js и SQLite.

## Структура базы данных

### Таблица `authors`
| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER | Первичный ключ, автоинкремент |
| name | VARCHAR | Имя автора (обязательное) |
| bio | TEXT | Биография автора |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

### Таблица `categories`
| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER | Первичный ключ, автоинкремент |
| name | VARCHAR | Название категории (обязательное) |
| description | TEXT | Описание категории |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

### Таблица `books`
| Поле | Тип | Описание |
|------|-----|----------|
| id | INTEGER | Первичный ключ, автоинкремент |
| title | VARCHAR | Название книги (обязательное) |
| author_id | INTEGER | Внешний ключ к authors(id) |
| category_id | INTEGER | Внешний ключ к categories(id) |
| isbn | VARCHAR | ISBN книги (уникальный) |
| year | INTEGER | Год публикации |
| created_at | TIMESTAMP | Дата создания |
| updated_at | TIMESTAMP | Дата обновления |

## Связи между таблицами
authors (1) ↔ (N) books - Один автор может иметь много книг
categories (1) ↔ (N) books - Одна категория может содержать много книг

## Инструкции по запуску

### Предварительные требования
Node.js (версия 14 или выше)
npm

### Установка и запуск
1. Клонируйте репозиторий и перейдите в папку проекта:
git clone 
cd library-api