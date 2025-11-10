import { useState, useEffect } from 'react';
import { itemsService } from '../services/api';

export const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setError(null);
  };

  const showError = (message) => {
    setError(message);
    setSuccessMessage(null);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itemsService.getAll();
      setItems(data);
    } catch (err) {
      showError(`Ошибка загрузки: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData) => {
    const tempId = Date.now(); 
    const optimisticItem = {
      ...itemData,
      id: tempId,
      createdAt: new Date().toISOString(),
      _optimistic: true 
    };

    try {
      setError(null);
      setItems(prev => [...prev, optimisticItem]);
      
      const newItem = await itemsService.create(itemData);
      
      setItems(prev => prev.map(item => 
        item.id === tempId ? { ...newItem, _optimistic: undefined } : item
      ));
      
      showSuccess('Задача успешно создана!');
      return newItem;
    } catch (err) {
      setItems(prev => prev.filter(item => item.id !== tempId));
      showError(`Ошибка создания: ${err.message}`);
      throw err;
    }
  };

  const updateItem = async (id, itemData) => {
    const previousItems = [...items]; 
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      throw new Error('Элемент не найден');
    }

    try {
      setError(null);
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...itemData, _optimistic: true } : item
      ));
      
      const updatedItem = await itemsService.update(id, itemData);
      
      setItems(prev => prev.map(item => 
        item.id === id ? { ...updatedItem, _optimistic: undefined } : item
      ));
      
      showSuccess('Задача успешно обновлена!');
      return updatedItem;
    } catch (err) {
      setItems(previousItems);
      showError(`Ошибка обновления: ${err.message}`);
      throw err;
    }
  };

  const deleteItem = async (id) => {
    const itemToDelete = items.find(item => item.id === id);
    if (!itemToDelete) {
      throw new Error('Элемент не найден');
    }

    try {
      setError(null);
      setItems(prev => prev.filter(item => item.id !== id));
      
      await itemsService.delete(id);
      showSuccess('Задача успешно удалена!');
    } catch (err) {
      setItems(prev => [...prev, itemToDelete].sort((a, b) => a.id - b.id));
      showError(`Ошибка удаления: ${err.message}`);
      throw err;
    }
  };

  useEffect(() => {
    fetchItems();
    
    const intervalId = setInterval(fetchItems, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    items,
    loading,
    error,
    successMessage,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    showError,
    showSuccess
  };
};