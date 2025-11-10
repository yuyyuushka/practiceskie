import React, { useState, useCallback } from 'react';
import { useItems } from './hooks/useItems';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import Notifications from './components/Notifications';
import './App.css';

function App() {
  const { 
    items, 
    loading, 
    error, 
    successMessage,
    createItem, 
    updateItem, 
    deleteItem,
    fetchItems,
    showError 
  } = useItems();
  
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleCreate = async (formData) => {
    try {
      setFormLoading(true);
      await createItem(formData);
      setShowForm(false);
    } catch (err) {
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      setFormLoading(true);
      await updateItem(editingItem.id, formData);
      setEditingItem(null);
      setShowForm(false);
    } catch (err) {
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await deleteItem(id);
      } catch (err) {
      }
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      handleUpdate(formData);
    } else {
      handleCreate(formData);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const handleDismissNotification = (type) => {
    if (type === 'error') {
      showError(null);
    }
  };

  const handleToggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    if (!autoRefresh) {
      fetchItems(); 
    }
  };

  const memoizedItemList = useCallback(
    () => (
      <ItemList
        items={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ),
    [items, loading, handleEdit, handleDelete]
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Менеджер задач</h1>
        <div className="header-actions">
          <div className="auto-refresh-toggle">
            <label>
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={handleToggleAutoRefresh}
              />
              Авто-обновление
            </label>
          </div>
          <button 
            onClick={fetchItems}
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? '⟳' : '⟳'} Обновить
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            + Добавить задачу
          </button>
        </div>
      </header>

      <main className="app-main">
        <Notifications
          error={error}
          success={successMessage}
          onDismiss={handleDismissNotification}
        />

        {showForm ? (
          <div className="form-section">
            <h2>{editingItem ? 'Редактирование задачи' : 'Создание новой задачи'}</h2>
            <ItemForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              initialData={editingItem}
              loading={formLoading}
            />
          </div>
        ) : (
          <div className="list-section">
            <div className="list-header">
              <h2>Список задач ({items.length})</h2>
              {loading && <div className="loading-indicator">Обновление данных...</div>}
            </div>
            {memoizedItemList()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;