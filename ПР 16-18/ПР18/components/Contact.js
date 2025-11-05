import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        subject: 'general'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Данные формы', formData);

        navigate('/contact/success', {
            state: {
                message: 'Ваше сообщение успешно отправлено!',
                formData: formData
            }
        });
    };

    return (
        <div>
            <h2>Контакты</h2>

            <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
                <div style={{ marginBottom: '15px' }}>
                    <label>
                        Имя:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                        />
                    </label>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>
                        Тема:
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                        >
                            <option value="general">Общий вопрос</option>
                            <option value="support">Техническая поддержка</option>
                            <option value="sales">Вопросы по продажам</option>
                            <option value="feedback">Обратная связь</option>
                        </select>
                    </label>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label>
                        Сообщение:
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="5"
                            style={{ width: '100%', padding: '5px', marginTop: '5px' }}
                        />
                    </label>
                </div>

                <button type="submit" style={{ padding: '10px 20px' }}>
                    Отправить сообщение
                </button>
            </form>
        </div>
    );
};

export default Contact;