exports.seed = async function(knex) {
  await knex('books').del();
  await knex('authors').del();
  await knex('categories').del();

  const categories = await knex('categories').insert([
    { name: 'Художественная литература', description: 'Романы, повести, рассказы' },
    { name: 'Научная литература', description: 'Научные работы и исследования' },
    { name: 'Фантастика', description: 'Научная фантастика и фэнтези' },
    { name: 'Детективы', description: 'Детективные романы и триллеры' }
  ]).returning('id');

  const authors = await knex('authors').insert([
    { name: 'Лев Толстой', bio: 'Русский писатель, философ' },
    { name: 'Фёдор Достоевский', bio: 'Русский писатель, мыслитель' },
    { name: 'Айзек Азимов', bio: 'Американский писатель-фантаст' },
    { name: 'Агата Кристи', bio: 'Английская писательница' }
  ]).returning('id');

  await knex('books').insert([
    {
      title: 'Война и мир',
      author_id: authors[0],
      category_id: categories[0],
      isbn: '978-5-389-00001-1',
      year: 1869
    },
    {
      title: 'Анна Каренина',
      author_id: authors[0],
      category_id: categories[0],
      isbn: '978-5-389-00002-8',
      year: 1877
    },
    {
      title: 'Преступление и наказание',
      author_id: authors[1],
      category_id: categories[0],
      isbn: '978-5-389-00003-5',
      year: 1866
    },
    {
      title: 'Я, робот',
      author_id: authors[2],
      category_id: categories[2],
      isbn: '978-5-389-00004-2',
      year: 1950
    },
    {
      title: 'Убийство в Восточном экспрессе',
      author_id: authors[3],
      category_id: categories[3],
      isbn: '978-5-389-00005-9',
      year: 1934
    }
  ]);
};