const express = require('express');
const Book = require('./models/Book');
const Author = require('./models/Author');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.get('/api/books', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await Book.findAll(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get('/api/books/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    next(error);
  }
});

app.post('/api/books', async (req, res, next) => {
  try {
    const { title, author_id, category_id, isbn, year } = req.body;
    
    if (!title || !author_id) {
      return res.status(400).json({ error: 'Title and author_id are required' });
    }

    const book = await Book.create({ title, author_id, category_id, isbn, year });
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
});

app.put('/api/books/:id', async (req, res, next) => {
  try {
    const { title, author_id, category_id, isbn, year } = req.body;
    
    const book = await Book.update(req.params.id, { 
      title, author_id, category_id, isbn, year 
    });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/books/:id', async (req, res, next) => {
  try {
    const deleted = await Book.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/api/authors', async (req, res, next) => {
  try {
    const authors = await Author.findAll();
    res.json(authors);
  } catch (error) {
    next(error);
  }
});

app.get('/api/authors/:id/books', async (req, res, next) => {
  try {
    const authorWithBooks = await Author.findByIdWithBooks(req.params.id);
    if (!authorWithBooks) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(authorWithBooks);
  } catch (error) {
    next(error);
  }
});

app.post('/api/authors', async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const author = await Author.create({ name, bio });
    res.status(201).json(author);
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;