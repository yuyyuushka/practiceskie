import React, { useRef } from 'react';

const ContactFormUncontrolled = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      message: messageRef.current.value
    };

    console.log('Данные формы (неуправляемый):', formData);
    
    nameRef.current.value = '';
    emailRef.current.value = '';
    messageRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Имя:</label>
        <input
          type="text"
          ref={nameRef}
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          ref={emailRef}
        />
      </div>

      <div>
        <label>Сообщение:</label>
        <textarea
          ref={messageRef}
        />
      </div>

      <button type="submit">Отправить</button>
    </form>
  );
};

export default ContactFormUncontrolled;