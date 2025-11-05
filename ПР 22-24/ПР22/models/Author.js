const db = require('../db');

class Author {
  static async findAll() {
    return db('authors').select('*').orderBy('name');
  }

  static async findByIdWithBooks(id) {
    const author = await db('authors').where('id', id).first();
    
    if (!author) return null;

    const books = await db('books')
      .select(
        'books.*',
        'categories.name as category_name'
      )
      .leftJoin('categories', 'books.category_id', 'categories.id')
      .where('books.author_id', id);

    return {
      ...author,
      books
    };
  }

  static async create(authorData) {
    const [id] = await db('authors').insert(authorData);
    return db('authors').where('id', id).first();
  }
}

module.exports = Author;