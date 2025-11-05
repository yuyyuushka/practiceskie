import React from 'react';
import UserRegistrationForm from './UserRegistrationForm';
import UserRegistrationFormWithValidation from './UserRegistrationFormWithValidation';
import ContactFormUncontrolled from './ContactFormUncontrolled';

function App() {
  return (
    <div className="App">
      <h1>Формы React</h1>
      
      <h2>Базовая форма регистрации</h2>
      <UserRegistrationForm />
      
      <h2>Форма с валидацией</h2>
      <UserRegistrationFormWithValidation />
      
      <h2>Неуправляемая форма обратной связи</h2>
      <ContactFormUncontrolled />
    </div>
  );
}

export default App;