const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const runMigrations = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migration1 = 'create_users_table';
    const hasMigration1 = await client.query(
      'SELECT * FROM migrations WHERE name = $1', 
      [migration1]
    );

    if (hasMigration1.rows.length === 0) {
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await client.query('INSERT INTO migrations (name) VALUES ($1)', [migration1]);
      console.log('Migration 1 executed: create_users_table');
    }

    const migration2 = 'create_posts_table';
    const hasMigration2 = await client.query(
      'SELECT * FROM migrations WHERE name = $1', 
      [migration2]
    );

    if (hasMigration2.rows.length === 0) {
      await client.query(`
        CREATE TABLE posts (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT,
          user_id INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      await client.query('INSERT INTO migrations (name) VALUES ($1)', [migration2]);
      console.log('Migration 2 executed: create_posts_table');
    }

    await client.query('COMMIT');
    console.log('All migrations completed successfully');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

runMigrations();