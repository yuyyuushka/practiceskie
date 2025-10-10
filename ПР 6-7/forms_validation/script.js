document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('validationForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    function showError(input, message) {
        const errorElement = input.parentElement.querySelector('.error-message') || 
                            document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        if (!input.parentElement.querySelector('.error-message')) {
            input.parentElement.appendChild(errorElement);
        }
        
        input.classList.add('invalid');
        input.classList.remove('valid');
    }
    
    function clearError(input) {
        const errorElement = input.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        input.classList.remove('invalid');
        input.classList.add('valid');
    }
    
    function validateRequired(input) {
        if (!input.value.trim()) {
            showError(input, 'Это поле обязательно для заполнения');
            return false;
        }
        clearError(input);
        return true;
    }
    
    function validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
            showError(input, 'Введите корректный email адрес');
            return false;
        }
        clearError(input);
        return true;
    }
    
    function validatePassword(input) {
        if (input.value.length < 8) {
            showError(input, 'Пароль должен содержать минимум 8 символов');
            return false;
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(input.value)) {
            showError(input, 'Пароль должен содержать буквы в верхнем и нижнем регистре и цифры');
            return false;
        }
        
        clearError(input);
        return true;
    }
    
    function validateConfirmPassword(confirmInput) {
        const passwordInput = form.querySelector('#password');
        if (confirmInput.value !== passwordInput.value) {
            showError(confirmInput, 'Пароли не совпадают');
            return false;
        }
        clearError(confirmInput);
        return true;
    }
    
    function validatePhone(input) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
            showError(input, 'Введите корректный номер телефона');
            return false;
        }
        clearError(input);
        return true;
    }
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                clearError(this);
            }
        });
    });
    
    function validateField(field) {
        switch(field.type) {
            case 'email':
                return validateEmail(field);
            case 'password':
                if (field.id === 'confirmPassword') {
                    return validateConfirmPassword(field);
                }
                return validatePassword(field);
            case 'tel':
                return validatePhone(field);
            case 'checkbox':
                if (!field.checked) {
                    showError(field, 'Это поле обязательно');
                    return false;
                }
                clearError(field);
                return true;
            default:
                if (field.required) {
                    return validateRequired(field);
                }
                return true;
        }
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            alert('Форма успешно отправлена!');
            form.reset();
            inputs.forEach(input => input.classList.remove('valid'));
        } else {
            alert('Пожалуйста, исправьте ошибки в форме');
        }
    });
    
    const passwordInput = form.querySelector('#password');
    const confirmPasswordInput = form.querySelector('#confirmPassword');
    
    if (passwordInput && confirmPasswordInput) {
        passwordInput.addEventListener('input', function() {
            if (confirmPasswordInput.value) {
                validateConfirmPassword(confirmPasswordInput);
            }
        });
    }
});