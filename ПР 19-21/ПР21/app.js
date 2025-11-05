const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let books = [];
let currentId = 1;

const findBookById = (id) => books.find(book => book.id === parseInt(id));
const findBookIndexById = (id) => books.findIndex(book => book.id === parseInt(id));
const isIsbnUnique = (isbn, excludeId = null) => 
  !books.some(book => book.isbn === isbn && book.id !== excludeId);

const validateBook = (book, isPartial = false) => {
  if (!isPartial) {
    if (!book.title) return 'Название обязательно';
    if (!book.author) return 'Автор обязателен';
  }
  if (book.year && (book.year < 1000 || book.year > new Date().getFullYear())) {
    return 'Некорректный год издания';
  }
  return null;
};

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/api/books', (req, res) => {
  try {
    let filteredBooks = [...books];
    
    if (req.query.author) {
      filteredBooks = filteredBooks.filter(book => 
        book.author.toLowerCase().includes(req.query.author.toLowerCase())
      );
    }
    if (req.query.genre) {
      filteredBooks = filteredBooks.filter(book => 
        book.genre.toLowerCase().includes(req.query.genre.toLowerCase())
      );
    }
    if (req.query.year) {
      filteredBooks = filteredBooks.filter(book => book.year === parseInt(req.query.year));
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const result = {
      page,
      limit,
      total: filteredBooks.length,
      data: filteredBooks.slice(startIndex, endIndex)
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.get('/api/books/:id', (req, res) => {
  const book = findBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Книга не найдена' });
  }
  res.json(book);
});

app.post('/api/books', (req, res) => {
  try {
    const error = validateBook(req.body);
    if (error) return res.status(400).json({ error });

    if (req.body.isbn && !isIsbnUnique(req.body.isbn)) {
      return res.status(400).json({ error: 'ISBN должен быть уникальным' });
    }

    const newBook = {
      id: currentId++,
      title: req.body.title,
      author: req.body.author,
      year: req.body.year || null,
      isbn: req.body.isbn || null,
      genre: req.body.genre || null,
      available: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    books.push(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании книги' });
  }
});

app.put('/api/books/:id', (req, res) => {
  try {
    const bookIndex = findBookIndexById(req.params.id);
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }

    const error = validateBook(req.body);
    if (error) return res.status(400).json({ error });

    if (req.body.isbn && !isIsbnUnique(req.body.isbn, parseInt(req.params.id))) {
      return res.status(400).json({ error: 'ISBN должен быть уникальным' });
    }

    books[bookIndex] = {
      ...books[bookIndex],
      ...req.body,
      id: parseInt(req.params.id),
      updatedAt: new Date().toISOString()
    };

    res.json(books[bookIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении книги' });
  }
});

app.patch('/api/books/:id', (req, res) => {
  try {
    const bookIndex = findBookIndexById(req.params.id);
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }

    const error = validateBook(req.body, true);
    if (error) return res.status(400).json({ error });

    if (req.body.isbn && !isIsbnUnique(req.body.isbn, parseInt(req.params.id))) {
      return res.status(400).json({ error: 'ISBN должен быть уникальным' });
    }

    books[bookIndex] = {
      ...books[bookIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json(books[bookIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении книги' });
  }
});

app.delete('/api/books/:id', (req, res) => {
  try {
    const bookIndex = findBookIndexById(req.params.id);
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }

    const deletedBook = books.splice(bookIndex, 1)[0];
    res.json({ message: 'Книга удалена', book: deletedBook });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении книги' });
  }
});

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});