import React from 'react';

const ItemList = ({ items, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (items.length === 0) {
    return <div className="empty-state">Элементы не найдены</div>;
  }

  return (
    <div className="item-list">
      {items.map(item => (
        <div key={item.id} className="item-card">
          <div className="item-header">
            <h3 className="item-title">{item.title}</h3>
            <div className="item-actions">
              <button 
                onClick={() => onEdit(item)}
                className="btn btn-edit"
              >
                Редактировать
              </button>
              <button 
                onClick={() => onDelete(item.id)}
                className="btn btn-delete"
              >
                Удалить
              </button>
            </div>
          </div>
          <p className="item-description">{item.description}</p>
          <div className="item-meta">
            <span className={`status ${item.completed ? 'completed' : 'pending'}`}>
              {item.completed ? 'Выполнено' : 'Ожидает'}
            </span>
            <span className="created-at">
              Создано: {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;