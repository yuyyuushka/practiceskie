import React, { useState, useEffect } from 'react';

const ItemForm = ({ onSubmit, onCancel, initialData, loading, errors = {} }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Название должно содержать минимум 3 символа';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Название не должно превышать 100 символов';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Описание не должно превышать 500 символов';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        completed: initialData.completed || false
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      title: true,
      description: true
    });

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getFieldError = (fieldName) => {
    return touched[fieldName] ? (formErrors[fieldName] || errors[fieldName]) : null;
  };

  return (
    <form onSubmit={handleSubmit} className="item-form" noValidate>
      <div className="form-group">
        <label htmlFor="title">Название *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          disabled={loading}
          className={getFieldError('title') ? 'error' : ''}
          aria-describedby={getFieldError('title') ? 'title-error' : undefined}
        />
        {getFieldError('title') && (
          <div id="title-error" className="error-text">
            {getFieldError('title')}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="4"
          disabled={loading}
          className={getFieldError('description') ? 'error' : ''}
          aria-describedby={getFieldError('description') ? 'description-error' : undefined}
        />
        <div className="character-count">
          {formData.description.length}/500
        </div>
        {getFieldError('description') && (
          <div id="description-error" className="error-text">
            {getFieldError('description')}
          </div>
        )}
      </div>

      <div className="form-group checkbox-group">
        <label htmlFor="completed">
          <input
            type="checkbox"
            id="completed"
            name="completed"
            checked={formData.completed}
            onChange={handleChange}
            disabled={loading}
          />
          Выполнено
        </label>
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          disabled={loading || Object.keys(formErrors).length > 0}
          className="btn btn-primary"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              {initialData ? 'Обновление...' : 'Создание...'}
            </>
          ) : (
            initialData ? 'Обновить' : 'Создать'
          )}
        </button>
        
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            disabled={loading}
            className="btn btn-secondary"
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default ItemForm;