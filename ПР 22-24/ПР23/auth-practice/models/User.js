const bcrypt = require('bcryptjs');
const db = require('../db'); 

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return db('users').insert({
      ...userData,
      password_hash: hashedPassword
    });
  }

  static async findByEmail(email) {
    return db('users').where({ email }).first();
  }

  static async checkPassword(candidatePassword, hash) {
    return bcrypt.compare(candidatePassword, hash);
  }

  static async update(userId, updates) {
    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }
    return db('users').where({ id: userId }).update(updates);
  }
}

module.exports = User;