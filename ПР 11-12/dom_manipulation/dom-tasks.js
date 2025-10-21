// Создание и вставка элементов 

function createCard(title, content) {
    const card = document.createElement('div');
    card.className = 'card';
    
    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    
    const contentElement = document.createElement('p');
    contentElement.textContent = content;
    
    card.appendChild(titleElement);
    card.appendChild(contentElement);
    
    const target = document.getElementById('target1');
    target.appendChild(card);
}

function createList(items) {
    const list = document.createElement('ol');
    
    items.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        list.appendChild(listItem);
    });
    
    const target = document.getElementById('target1');
    target.appendChild(list);
}

// Навигация по DOM

function countChildren() {
    const parent = document.getElementById('parent-element');
    return parent.children.length;
}

function findSpecialChild() {
    const parent = document.getElementById('parent-element');
    const specialChild = parent.querySelector('.special');
    return specialChild ? specialChild.textContent : 'Элемент не найден';
}

function getParentBackground() {
    const firstChild = document.querySelector('.child');
    if (firstChild && firstChild.parentElement) {
        const styles = window.getComputedStyle(firstChild.parentElement);
        return styles.backgroundColor;
    }
    return 'Родительский элемент не найден';
}

// Работа с классами и стилями

function setupStyleToggle() {
    const toggleButton = document.getElementById('toggle-style');
    const styleTarget = document.getElementById('style-target');
    
    if (toggleButton && styleTarget) {
        toggleButton.addEventListener('click', function() {
            styleTarget.classList.toggle('active-style');
        });
    }
}

function changeHeaderColor() {
    const header = document.getElementById('main-header');
    
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    
    header.style.background = `linear-gradient(135deg, ${randomColor} 0%, ${randomColor}80 100%)`;
}

function animateElement() {
    const element = document.getElementById('style-target');
    
    if (element) {
        element.classList.add('active-style');
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.transform = 'scale(1.1)';
            element.style.opacity = '0.8';
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.opacity = '1';
            }, 500);
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupStyleToggle();
    
    console.log('Количество дочерних элементов:', countChildren());
    console.log('Особый дочерний элемент:', findSpecialChild());
    console.log('Цвет фона родителя:', getParentBackground());
});

// Обработка событий

function setupEventHandlers() {
    let clickCount = 0;
    const clickButton = document.getElementById('click-button');
    const clickCounter = document.getElementById('click-counter');
    const textInput = document.getElementById('text-input');
    const inputDisplay = document.getElementById('input-display');
    
    if (clickButton && clickCounter) {
        clickButton.addEventListener('click', function() {
            clickCount++;
            clickCounter.textContent = `Кликов: ${clickCount}`;
        });
    }
    
    if (textInput && inputDisplay) {
        textInput.addEventListener('input', function() {
            inputDisplay.textContent = this.value;
        });
    }
}

// Динамический список

function setupListHandlers() {
    const itemInput = document.getElementById('item-input');
    const addButton = document.getElementById('add-item');
    const clearButton = document.getElementById('clear-list');
    const dynamicList = document.getElementById('dynamic-list');
    
    function addListItem() {
        if (itemInput.value.trim() !== '') {
            const listItem = document.createElement('li');
            listItem.className = 'list-item';
            
            const itemText = document.createElement('span');
            itemText.textContent = itemInput.value;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', function() {
                listItem.remove();
            });
            
            listItem.appendChild(itemText);
            listItem.appendChild(deleteButton);
            dynamicList.appendChild(listItem);
            
            itemInput.value = '';
        }
    }
    
    function clearList() {
        dynamicList.innerHTML = '';
    }
    
    if (addButton) {
        addButton.addEventListener('click', addListItem);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearList);
    }
    
    if (itemInput) {
        itemInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addListItem();
            }
        });
    }
}

// Работа с формами

function setupFormHandler() {
    const userForm = document.getElementById('user-form');
    const formOutput = document.getElementById('form-output');
    
    if (userForm && formOutput) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('user-name').value;
            const email = document.getElementById('user-email').value;
            const age = document.getElementById('user-age').value;
            
            if (name && email) {
                formOutput.innerHTML = `
                    <div class="success-message">
                        <h4>Данные успешно отправлены!</h4>
                        <p><strong>Имя:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        ${age ? `<p><strong>Возраст:</strong> ${age}</p>` : ''}
                    </div>
                `;
                
                userForm.reset();
            } else {
                formOutput.innerHTML = `
                    <div class="error-message">
                        <p>Пожалуйста, заполните обязательные поля (Имя и Email)</p>
                    </div>
                `;
            }
        });
    }
}

// Обработка событий

function setupClickCounter() {
    let count = 0;
    const clickButton = document.getElementById('click-button');
    const clickCounter = document.getElementById('click-counter');
    
    if (clickButton && clickCounter) {
        clickButton.addEventListener('click', function() {
            count++;
            clickCounter.textContent = `Кликов: ${count}`;
            
            clickButton.style.transform = 'scale(0.95)';
            setTimeout(() => {
                clickButton.style.transform = 'scale(1)';
            }, 100);
        });
    }
}

function setupInputDisplay() {
    const textInput = document.getElementById('text-input');
    const inputDisplay = document.getElementById('input-display');
    
    if (textInput && inputDisplay) {
        textInput.addEventListener('input', function() {
            inputDisplay.textContent = this.value;
            inputDisplay.style.color = this.value ? '#333' : '#999';
        });
        
        inputDisplay.style.color = '#999';
        inputDisplay.textContent = 'Здесь будет отображаться ваш текст...';
    }
}

function setupKeyboardEvents() {
    document.addEventListener('keydown', function(event) {
        console.log(`Key DOWN: Код: ${event.code}, Клавиша: ${event.key}`);
        
        if (event.code === 'Enter' || event.code === 'Escape') {
            const indicator = document.createElement('div');
            indicator.textContent = `Нажата клавиша: ${event.key}`;
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #B88E2F;
                color: white;
                padding: 10px;
                border-radius: 4px;
                z-index: 1000;
                font-size: 14px;
            `;
            document.body.appendChild(indicator);
            
            setTimeout(() => {
                indicator.remove();
            }, 2000);
        }
    });
    
    document.addEventListener('keyup', function(event) {
        console.log(`Key UP: Код: ${event.code}, Клавиша: ${event.key}`);
    });
}

// Динамические списки

function addListItem() {
    const itemInput = document.getElementById('item-input');
    const dynamicList = document.getElementById('dynamic-list');
    
    if (itemInput && dynamicList && itemInput.value.trim() !== '') {
        const listItem = document.createElement('li');
        listItem.className = 'list-item';
        
        const itemText = document.createElement('span');
        itemText.textContent = itemInput.value;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', function() {
            listItem.style.transform = 'translateX(100%)';
            listItem.style.opacity = '0';
            setTimeout(() => {
                listItem.remove();
            }, 300);
        });
        
        listItem.appendChild(itemText);
        listItem.appendChild(deleteButton);
        
        listItem.style.opacity = '0';
        listItem.style.transform = 'translateY(-10px)';
        dynamicList.appendChild(listItem);
        
        setTimeout(() => {
            listItem.style.transition = 'all 0.3s ease';
            listItem.style.opacity = '1';
            listItem.style.transform = 'translateY(0)';
        }, 10);
        
        itemInput.value = '';
        itemInput.focus();
    }
}

function removeListItem(event) {
    if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Удалить') {
        const listItem = event.target.closest('.list-item');
        if (listItem) {
            listItem.style.transform = 'translateX(100%)';
            listItem.style.opacity = '0';
            setTimeout(() => {
                listItem.remove();
            }, 300);
        }
    }
}

function clearList() {
    const dynamicList = document.getElementById('dynamic-list');
    const items = dynamicList.querySelectorAll('.list-item');
    
    if (items.length > 0) {
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(-100%)';
                item.style.opacity = '0';
                setTimeout(() => {
                    item.remove();
                }, 300);
            }, index * 100);
        });
        
        setTimeout(() => {
            dynamicList.innerHTML = '';
        }, items.length * 100 + 300);
    }
}

function setupListEvents() {
    const addButton = document.getElementById('add-item');
    const clearButton = document.getElementById('clear-list');
    const itemInput = document.getElementById('item-input');
    const dynamicList = document.getElementById('dynamic-list');
    
    if (addButton) {
        addButton.addEventListener('click', addListItem);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearList);
    }
    
    if (itemInput) {
        itemInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addListItem();
            }
        });
    }
    
    if (dynamicList) {
        dynamicList.addEventListener('click', removeListItem);
    }
}

// Работа с формами

function validateForm(formData) {
    const errors = {};
    
    if (!formData.name.trim()) {
        errors.name = 'Имя обязательно для заполнения';
    } else if (formData.name.trim().length < 2) {
        errors.name = 'Имя должно содержать минимум 2 символа';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
        errors.email = 'Email обязателен для заполнения';
    } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Введите корректный email адрес';
    }
    
    if (formData.age) {
        const age = parseInt(formData.age);
        if (isNaN(age) || age < 1 || age > 120) {
            errors.age = 'Возраст должен быть числом от 1 до 120';
        }
    }
    
    return Object.keys(errors).length === 0 ? null : errors;
}

function displayFormErrors(errors) {
    const formOutput = document.getElementById('form-output');
    
    let errorsHTML = '<div class="error-message"><h4>Обнаружены ошибки:</h4><ul>';
    
    for (const field in errors) {
        errorsHTML += `<li><strong>${getFieldLabel(field)}:</strong> ${errors[field]}</li>`;
    }
    
    errorsHTML += '</ul></div>';
    formOutput.innerHTML = errorsHTML;
    
    highlightErrorFields(errors);
}

function getFieldLabel(field) {
    const labels = {
        name: 'Имя',
        email: 'Email',
        age: 'Возраст'
    };
    return labels[field] || field;
}

function highlightErrorFields(errors) {
    const fields = ['user-name', 'user-email', 'user-age'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '#333';
        }
    });
    
    for (const field in errors) {
        const fieldId = `user-${field}`;
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
            fieldElement.style.borderColor = '#e74c3c';
            fieldElement.focus();
        }
    }
}

function displayFormSuccess(userData) {
    const formOutput = document.getElementById('form-output');
    
    let successHTML = '<div class="success-message"><h4>✅ Форма успешно отправлена!</h4>';
    successHTML += `<p><strong>Имя:</strong> ${userData.name}</p>`;
    successHTML += `<p><strong>Email:</strong> ${userData.email}</p>`;
    
    if (userData.age) {
        successHTML += `<p><strong>Возраст:</strong> ${userData.age}</p>`;
    }
    
    successHTML += `<p class="timestamp">Отправлено: ${new Date().toLocaleString()}</p>`;
    successHTML += '</div>';
    
    formOutput.innerHTML = successHTML;
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        age: document.getElementById('user-age').value
    };
    
    const errors = validateForm(formData);
    
    if (errors) {
        displayFormErrors(errors);
    } else {
        displayFormSuccess(formData);
        console.log('Данные формы:', formData);
        
        event.target.reset();
        
        highlightErrorFields({});
    }
}

function setupForm() {
    const userForm = document.getElementById('user-form');
    
    if (userForm) {
        userForm.addEventListener('submit', handleFormSubmit);
        
        const inputs = userForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '#333';
            });
        });
    }
}

// ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ

function initializeApp() {
    setupStyleToggle();
    setupClickCounter();
    setupInputDisplay();
    setupKeyboardEvents();
    setupListEvents();
    setupForm();

    createCard('Пример карточки', 'Это содержимое демонстрационной карточки, созданной при инициализации приложения.');
    createList(['Первый элемент списка', 'Второй элемент списка', 'Третий элемент списка']);

    console.log('Приложение инициализировано!');
    console.log('Доступные функции: createCard(), createList(), changeHeaderColor(), animateElement()');
}

document.addEventListener('DOMContentLoaded', initializeApp);