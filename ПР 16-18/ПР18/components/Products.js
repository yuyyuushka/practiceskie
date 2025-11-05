import React from 'react';
import { Link } from 'react-router-dom';

const Products = () => {
  const products = [
    { id: 1, name: 'Ноутбук', category: 'electronics' },
    { id: 2, name: 'Смартфон', category: 'electronics' },
    { id: 3, name: 'Книга', category: 'books' },
    { id: 4, name: 'Наушники', category: 'electronics' },
    { id: 5, name: 'Футболка', category: 'clothing' }
  ];

  return (
    <div>
      <h1>Товары</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {products.map(product => (
          <Link key={product.id} to={`/products/${product.id}`}>
            {product.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;