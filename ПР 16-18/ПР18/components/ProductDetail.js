import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const products = {
    1: { name: 'Ноутбук', price: 50000, description: 'Мощный игровой ноутбук', category: 'electronics' },
    2: { name: 'Смартфон', price: 30000, description: 'Смартфон с отличной камерой', category: 'electronics' },
    3: { name: 'Книга', price: 500, description: 'Интересная книга о программировании', category: 'books' },
    4: { name: 'Наушники', price: 4000, description: 'Беспроводные наушники', category: 'electronics' },
    5: { name: 'Футболка', price: 1500, description: 'Хлопковая футболка', category: 'clothing' }
  };

  const product = products[id];

  if (!product) {
    return (
      <div>
        <h2>Товар не найден</h2>
        <p>Товара с ID {id} не существует.</p>
        <button onClick={() => navigate('/products')}>Вернуться к товарам</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        Назад
      </button>

      <h2>{product.name}</h2>
      <div style={{ border: '1px solid #ccc', padding: '20px', maxWidth: '500px' }}>
        <p><strong>Цена:</strong> {product.price} руб.</p>
        <p><strong>Описание:</strong> {product.description}</p>
        <p><strong>Категория:</strong> {product.category}</p>
        <p><strong>ID товара:</strong> {id}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Link to="/products">← К списку товаров</Link>
      </div>
    </div>
  );
};

export default ProductDetail;