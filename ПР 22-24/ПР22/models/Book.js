const db = require('../db');

class Book {
  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const books = await db('books')
      .select(
        'books.*',
        'authors.name as author_name',
        'categories.name as category_name'
      )
      .leftJoin('authors', 'books.author_id', 'authors.id')
      .leftJoin('categories', 'books.category_id', 'categories.id')
      .limit(limit)
      .offset(offset);

    const total = await db('books').count('id as count').first();
    
    return {
      books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
        pages: Math.ceil(total.count / limit)
      }
    };
  }

  static async findById(id) {
    return db('books')
      .select(
        'books.*',
        'authors.name as author_name',
        'authors.bio as author_bio',
        'categories.name as category_name',
        'categories.description as category_description'
      )
      .leftJoin('authors', 'books.author_id', 'authors.id')
      .leftJoin('categories', 'books.category_id', 'categories.id')
      .where('books.id', id)
      .first();
  }

  static async create(bookData) {
    const [id] = await db('books').insert(bookData);
    return this.findById(id);
  }

  static async update(id, bookData) {
    await db('books').where('id', id).update({
      ...bookData,
      updated_at: db.fn.now()
    });
    return this.findById(id);
  }

  static async delete(id) {
    return db('books').where('id', id).del();
  }
}

module.exports = Book;