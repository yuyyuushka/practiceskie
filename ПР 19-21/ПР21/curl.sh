# Создание книги
curl -X POST -H "Content-Type: application/json" -d '{
  "title": "JavaScript для начинающих",
  "author": "Иван Иванов",
  "year": 2023,
  "isbn": "123-456-789",
  "genre": "Программирование"
}' http://localhost:3000/api/books

# Получение всех книг с фильтрацией
curl "http://localhost:3000/api/books?author=Иван&genre=Программирование&page=1&limit=10"

# Полное обновление книги
curl -X PUT -H "Content-Type: application/json" -d '{
  "title": "Обновленное название",
  "author": "Новый автор",
  "year": 2024
}' http://localhost:3000/api/books/1

# Удаление книги
curl -X DELETE http://localhost:3000/api/books/1