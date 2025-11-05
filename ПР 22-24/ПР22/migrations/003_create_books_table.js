exports.up = function(knex) {
  return knex.schema.createTable('books', function(table) {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.integer('author_id').unsigned().notNullable();
    table.integer('category_id').unsigned();
    table.string('isbn').unique();
    table.integer('year');
    table.timestamps(true, true);

    table.foreign('author_id').references('id').inTable('authors').onDelete('CASCADE');
    table.foreign('category_id').references('id').inTable('categories').onDelete('SET NULL');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('books');
};