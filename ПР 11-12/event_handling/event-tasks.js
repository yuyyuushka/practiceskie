function setupBasicEvents() {
    const basicBtn = document.getElementById('basic-btn');
    const basicOutput = document.getElementById('basic-output');
    const colorBox = document.getElementById('color-box');
    const mouseOutput = document.getElementById('mouse-output');
    
    if (basicBtn) {
        basicBtn.addEventListener('click', function() {
            basicOutput.textContent = 'Статус: кнопка нажата!';
            basicOutput.classList.add('success');
        });
    }
    
    if (colorBox) {
        colorBox.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#4CAF50';
            this.textContent = 'Курсор внутри!';
        });
        
        colorBox.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#f0f0f0';
            this.textContent = 'Наведи курсор';
        });
        
        colorBox.addEventListener('mousemove', function(event) {
            mouseOutput.textContent = `Координаты мыши: X=${event.clientX}, Y=${event.clientY}`;
        });
    }
}

function setupKeyboardEvents() {
    const keyInput = document.getElementById('key-input');
    const keyOutput = document.getElementById('key-output');
    
    if (keyInput) {
        keyInput.addEventListener('input', function() {
            keyOutput.textContent = `Введенный текст: ${this.value}`;
        });
        
        keyInput.addEventListener('keydown', function(event) {
            if (event.ctrlKey) {
                if (event.key === 's') {
                    event.preventDefault();
                    alert('Ctrl+S предотвращен!');
                } else if (event.key === 'c') {
                    event.preventDefault();
                    alert('Ctrl+C предотвращен!');
                } else if (event.key === 'v') {
                    event.preventDefault();
                    alert('Ctrl+V предотвращен!');
                }
            }
        });
    }
}

function setupDelegationEvents() {
    const itemList = document.getElementById('item-list');
    const addItemBtn = document.getElementById('add-item-btn');
    const delegationOutput = document.getElementById('delegation-output');
    
    if (itemList) {
        itemList.addEventListener('click', function(event) {
            if (event.target.classList.contains('delete')) {
                event.target.parentElement.remove();
                delegationOutput.textContent = 'Элемент удален';
            } else if (event.target.classList.contains('item')) {
                const itemId = event.target.getAttribute('data-id');
                delegationOutput.textContent = `Выбран элемент: ${itemId}`;
                event.target.classList.toggle('selected');
            }
        });
    }
    
    if (addItemBtn) {
        addItemBtn.addEventListener('click', function() {
            const items = itemList.querySelectorAll('.item');
            const newId = items.length + 1;
            const newItem = document.createElement('div');
            newItem.className = 'item';
            newItem.setAttribute('data-id', newId);
            newItem.innerHTML = `Элемент ${newId} <span class="delete">×</span>`;
            itemList.appendChild(newItem);
        });
    }
}

function setupPreventionEvents() {
    const preventLink = document.getElementById('prevent-link');
    const preventForm = document.getElementById('prevent-form');
    
    if (preventLink) {
        preventLink.addEventListener('click', function(event) {
            event.preventDefault();
            const output = document.getElementById('prevention-output');
            output.textContent = 'Ссылка заблокирована. Стандартное поведение предотвращено.';
            output.classList.add('active');
        });
    }
    
    if (preventForm) {
        preventForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const output = document.getElementById('prevention-output');
            const input = this.querySelector('input[type="text"]');
            
            if (input && !input.value.trim()) {
                output.textContent = 'Ошибка: поле не должно быть пустым!';
                input.classList.add('error');
            } else {
                output.textContent = `Форма заблокирована! Введенный текст: "${input.value}"`;
                input.classList.remove('error');
            }
        });
    }
}

function setupCustomEvents() {
    const triggerBtn = document.getElementById('trigger-custom');
    const multipleBtn = document.getElementById('multiple-listener');
    const output = document.getElementById('custom-output');
    
    if (triggerBtn) {
        triggerBtn.addEventListener('click', function() {
            const customEvent = new CustomEvent('myCustomEvent', {
                detail: {
                    message: 'Это кастомное событие!',
                    timestamp: new Date(),
                    randomId: Math.random().toString(36).substr(2, 9)
                },
                bubbles: true
            });
            
            this.dispatchEvent(customEvent);
        });
        
        triggerBtn.addEventListener('myCustomEvent', function(event) {
            output.innerHTML += `<div>Получено кастомное событие: ${event.detail.message} (${event.detail.timestamp.toLocaleTimeString()})</div>`;
        });
    }
    
    if (multipleBtn) {
        multipleBtn.addEventListener('click', function() {
            for (let i = 1; i <= 3; i++) {
                triggerBtn.addEventListener('myCustomEvent', function(e) {
                    output.innerHTML += `<div>Дополнительный обработчик ${i}: ${e.detail.message}</div>`;
                }, { once: true });
            }
            output.innerHTML += '<div>Добавлено 3 дополнительных обработчика.</div>';
        });
    }
}

function setupLoadingEvents() {
    const loadImageBtn = document.getElementById('load-image');
    const loadErrorBtn = document.getElementById('load-error');
    const imageContainer = document.getElementById('image-container');
    const output = document.getElementById('loading-output');
    
    if (loadImageBtn) {
        loadImageBtn.addEventListener('click', function() {
            output.textContent = 'Загрузка изображения...';
            imageContainer.innerHTML = '';
            imageContainer.className = 'image-container loading';
            
            const img = new Image();
            img.src = 'https://picsum.photos/300/200?' + Date.now();
            
            img.onload = function() {
                output.textContent = 'Изображение успешно загружено';
                imageContainer.className = 'image-container success';
                imageContainer.appendChild(img);
            };
            
            img.onerror = function() {
                output.textContent = 'Ошибка загрузки изображения';
                imageContainer.className = 'image-container error';
                imageContainer.textContent = 'Ошибка загрузки';
            };
        });
    }
    
    if (loadErrorBtn) {
        loadErrorBtn.addEventListener('click', function() {
            output.textContent = 'Симуляция ошибки...';
            imageContainer.innerHTML = '';
            imageContainer.className = 'image-container loading';
            
            const img = new Image();
            img.src = 'https://invalid-url-that-does-not-exist.com/image.jpg';
            
            img.onload = function() {
                output.textContent = 'Изображение загружено';
                imageContainer.className = 'image-container success';
                imageContainer.appendChild(img);
            };
            
            img.onerror = function() {
                output.textContent = 'Ошибка загрузки изображения';
                imageContainer.className = 'image-container error';
                imageContainer.textContent = 'Симулированная ошибка загрузки';
            };
        });
    }
}

function setupTimerEvents() {
    const startTimerBtn = document.getElementById('start-timer');
    const stopTimerBtn = document.getElementById('stop-timer');
    const debounceBtn = document.getElementById('debounce-btn');
    const throttleBtn = document.getElementById('throttle-btn');
    const timerOutput = document.getElementById('timer-output');
    const asyncOutput = document.getElementById('async-output');
    
    let timer = null;
    let counter = 0;
    
    if (startTimerBtn) {
        startTimerBtn.addEventListener('click', function() {
            if (timer) return;
            
            counter = 0;
            timerOutput.textContent = `Таймер: ${counter}`;
            
            timer = setInterval(() => {
                counter++;
                timerOutput.textContent = `Таймер: ${counter}`;
                
                if (counter >= 10) {
                    clearInterval(timer);
                    timer = null;
                    asyncOutput.innerHTML += '<div>Таймер достиг 10 и остановлен</div>';
                }
            }, 1000);
            
            asyncOutput.innerHTML += '<div>Таймер запущен</div>';
        });
    }
    
    if (stopTimerBtn) {
        stopTimerBtn.addEventListener('click', function() {
            if (timer) {
                clearInterval(timer);
                timer = null;
                asyncOutput.innerHTML += `<div>Таймер остановлен на значении: ${counter}</div>`;
            }
        });
    }
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    const debounceTest = debounce(() => {
        asyncOutput.innerHTML += '<div>Debounce: Функция выполнена (последний вызов)</div>';
    }, 1000);
    
    if (debounceBtn) {
        debounceBtn.addEventListener('click', function() {
            asyncOutput.innerHTML += '<div>Debounce: Вызов зарегистрирован</div>';
            debounceTest();
        });
    }
    
    const throttleTest = throttle(() => {
        asyncOutput.innerHTML += '<div>Throttle: Функция выполнена</div>';
    }, 2000);
    
    if (throttleBtn) {
        throttleBtn.addEventListener('click', function() {
            asyncOutput.innerHTML += '<div>Throttle: Вызов зарегистрирован</div>';
            throttleTest();
        });
    }
}

function preventLinkDefault(event) {

    event.preventDefault();
    
    const output = document.getElementById('prevention-output');
    output.textContent = 'Переход по ссылке предотвращен! Ссылка была заблокирована.';
    output.classList.add('pulse');
    

    const link = event.target;
    link.classList.add('shake');
    
    setTimeout(() => {
        link.classList.remove('shake');
        output.classList.remove('pulse');
    }, 300);
}

function preventFormSubmit(event) {

    event.preventDefault();
    
    const input = event.target.querySelector('input[type="text"]');
    const output = document.getElementById('prevention-output');
    
    if (!input.value.trim()) {
        output.textContent = 'Ошибка: поле не должно быть пустым!';
        output.classList.add('error');
        input.classList.add('shake');
        
        setTimeout(() => {
            input.classList.remove('shake');
        }, 300);
        return;
    }
    
    output.textContent = `Форма заблокирована! Введенный текст: "${input.value}"`;
    output.classList.remove('error');

    const form = event.target;
    form.classList.add('pulse');
    
    setTimeout(() => {
        form.classList.remove('pulse');
    }, 500);
}

function setupPreventionEvents() {
    
    const preventLink = document.getElementById('prevent-link');
    const preventForm = document.getElementById('prevent-form');
    
    if (preventLink) {
        preventLink.addEventListener('click', preventLinkDefault);
    }
    
    if (preventForm) {
        preventForm.addEventListener('submit', preventFormSubmit);
    }
}

function triggerCustomEvent() {
    
    const customEvent = new CustomEvent('customAction', {
        detail: {
            message: "Привет от кастомного события!",
            timestamp: new Date(),
            randomId: Math.random().toString(36).substr(2, 9)
        },
        bubbles: true,
        cancelable: true
    });
    
    document.dispatchEvent(customEvent);
    
    const triggerBtn = document.getElementById('trigger-custom');
    if (triggerBtn) {
        triggerBtn.dispatchEvent(customEvent);
    }
}

function handleCustomEvent(event) {
    
    const output = document.getElementById('custom-output');
    const detail = event.detail;
    
    const message = `
        <div class="test-result">
            <strong>Кастомное событие получено!</strong><br>
            Сообщение: ${detail.message}<br>
            Время: ${detail.timestamp.toLocaleTimeString()}<br>
            ID: ${detail.randomId}
        </div>
    `;
    
    output.innerHTML += message;
    
    const triggerBtn = document.getElementById('trigger-custom');
    if (triggerBtn) {
        triggerBtn.classList.add('pulse');
        setTimeout(() => {
            triggerBtn.classList.remove('pulse');
        }, 500);
    }
}

function setupMultipleListeners() {
    
    const output = document.getElementById('custom-output');
    
    const handler1 = function(event) {
        output.innerHTML += `<div class="test-result test-success">Обработчик 1: Событие обработано успешно!</div>`;
    };
    
    const handler2 = function(event) {
        output.innerHTML += `<div class="test-result">Обработчик 2: Получены данные: ${event.detail.randomId}</div>`;
    };
    
    const handler3 = function(event) {
        output.innerHTML += `<div class="test-result test-success">Обработчик 3: Время события: ${event.detail.timestamp.toLocaleTimeString()}</div>`;
    };
    
    document.addEventListener('customAction', handler1);
    document.addEventListener('customAction', handler2);
    document.addEventListener('customAction', handler3);
    
    output.innerHTML += `<div class="test-result">Добавлено 3 дополнительных обработчика для кастомного события!</div>`;
    
    setTimeout(() => {
        document.removeEventListener('customAction', handler1);
        document.removeEventListener('customAction', handler2);
        document.removeEventListener('customAction', handler3);
        output.innerHTML += `<div class="test-result test-failure">Дополнительные обработчики удалены (работали только один раз)</div>`;
    }, 5000);
}

function setupCustomEvents() {
    
    const triggerBtn = document.getElementById('trigger-custom');
    const multipleBtn = document.getElementById('multiple-listeners');
    
    document.addEventListener('customAction', handleCustomEvent);
    
    if (triggerBtn) {
        triggerBtn.addEventListener('click', triggerCustomEvent);
    }
    
    if (multipleBtn) {
        multipleBtn.addEventListener('click', setupMultipleListeners);
    }
}

function loadImageWithEvents() {
    
    const output = document.getElementById('loading-output');
    const container = document.getElementById('image-container');
    
    container.innerHTML = '';
    output.textContent = 'Начинается загрузка изображения...';
    container.className = 'image-container loading';

    const img = new Image();
    img.src = 'https://picsum.photos/300/200?' + Date.now();
    
    img.addEventListener('loadstart', function() {
        output.textContent = 'Загрузка началась...';
        container.className = 'image-container loading';
    });

    img.addEventListener('load', function() {
        output.textContent = 'Изображение успешно загружено!';
        container.className = 'image-container success';
        container.appendChild(img);
    });

    img.addEventListener('error', function() {
        output.textContent = 'Ошибка загрузки изображения!';
        container.className = 'image-container error';
        container.innerHTML = '<div style="text-align: center; padding: 20px;">Ошибка загрузки изображения</div>';
    });

    img.addEventListener('loadend', function() {
        setTimeout(() => {
            output.textContent += ' (Загрузка завершена)';
        }, 1000);
    });

    img.addEventListener('progress', function(event) {
        if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            output.textContent = `Загрузка: ${Math.round(percent)}%`;
        }
    });
    
    container.appendChild(img);
}

function simulateLoadError() {

    const output = document.getElementById('loading-output');
    const container = document.getElementById('image-container');

    container.innerHTML = '';
    output.textContent = 'Симуляция ошибки загрузки...';
    container.className = 'image-container loading';

    const img = new Image();
    img.src = 'https://invalid-url-that-definitely-does-not-exist.com/nonexistent-image.jpg?' + Date.now();
    
    img.addEventListener('load', function() {
        output.textContent = 'Неожиданно: изображение загружено!';
        container.className = 'image-container success';
        container.appendChild(img);
    });

    img.addEventListener('error', function() {
        output.textContent = 'Ошибка загрузки симулирована успешно! Изображение не найдено.';
        container.className = 'image-container error';
        container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                СИМУЛИРОВАННАЯ ОШИБКА<br>
                <small>Изображение по указанному URL не существует</small>
            </div>
        `;
        
        container.classList.add('shake');
        setTimeout(() => {
            container.classList.remove('shake');
        }, 300);
    });
    
    container.appendChild(img);
}

function setupLoadingEvents() {

    const loadImageBtn = document.getElementById('load-image');
    const loadErrorBtn = document.getElementById('load-error');
    
    if (loadImageBtn) {
        loadImageBtn.addEventListener('click', loadImageWithEvents);
    }
    
    if (loadErrorBtn) {
        loadErrorBtn.addEventListener('click', simulateLoadError);
    }
}

let timerInterval;
let timerValue = 0;
let isTimerRunning = false;


function startTimer() {

    if (isTimerRunning) {
        console.log('Таймер уже запущен!');
        return;
    }
    
    isTimerRunning = true;
    const timerOutput = document.getElementById('timer-output');
    const asyncOutput = document.getElementById('async-output');

    timerValue = 0;
    timerOutput.textContent = `Таймер: ${timerValue}`;
    asyncOutput.innerHTML += '<div>Таймер запущен</div>';
    
    timerInterval = setInterval(() => {
        timerValue++;
        timerOutput.textContent = `Таймер: ${timerValue}`;

        if (timerValue === 5) {
            asyncOutput.innerHTML += '<div class="test-result">Таймер достиг 5 секунд!</div>';
        }
        
        if (timerValue === 10) {
            asyncOutput.innerHTML += '<div class="test-result test-success">Таймер достиг 10 секунд! Автоостановка.</div>';
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {

    if (!isTimerRunning) {
        console.log('Таймер не запущен!');
        return;
    }
    
    clearInterval(timerInterval);
    isTimerRunning = false;
    
    const asyncOutput = document.getElementById('async-output');
    asyncOutput.innerHTML += `<div class="test-result test-failure">Таймер остановлен на ${timerValue} секунде</div>`;

    setTimeout(() => {
        if (!isTimerRunning) {
            timerValue = 0;
            document.getElementById('timer-output').textContent = `Таймер: ${timerValue}`;
        }
    }, 2000);
}

function createDebounce(func, delay) {
    
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function createThrottle(func, interval) {
    
    let lastExecTime = 0;
    let timeoutId;
    
    return function(...args) {
        const currentTime = Date.now();
        const timeSinceLastExec = currentTime - lastExecTime;
        
        if (timeSinceLastExec >= interval) {
            func.apply(this, args);
            lastExecTime = currentTime;
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                lastExecTime = Date.now();
            }, interval - timeSinceLastExec);
        }
    };
}

function testDebounce() {
    
    const asyncOutput = document.getElementById('async-output');

    function normalFunction() {
        asyncOutput.innerHTML += '<div>Обычный вызов: выполнен сразу</div>';
    }

    const debouncedFunction = createDebounce(() => {
        asyncOutput.innerHTML += '<div class="test-result test-success">Debounce: выполнен после задержки (последний вызов)</div>';
    }, 1000);

    asyncOutput.innerHTML += '<div class="test-result"><strong>Тест Debounce:</strong></div>';
    asyncOutput.innerHTML += '<div>Быстро нажали кнопку 3 раза:</div>';
    
    normalFunction();
    debouncedFunction();
    
    setTimeout(() => {
        debouncedFunction();
    }, 300);
    
    setTimeout(() => {
        debouncedFunction();
    }, 600);
}

function testThrottle() {
    
    const asyncOutput = document.getElementById('async-output');
    let normalCallCount = 0;
    let throttleCallCount = 0;
    
    function normalFunction() {
        normalCallCount++;
        asyncOutput.innerHTML += `<div>Обычный вызов ${normalCallCount}: выполнен</div>`;
    }
    
    const throttledFunction = createThrottle(() => {
        throttleCallCount++;
        asyncOutput.innerHTML += `<div class="test-result test-success">Throttle вызов ${throttleCallCount}: выполнен с ограничением</div>`;
    }, 2000);
    
    asyncOutput.innerHTML += '<div class="test-result"><strong>Тест Throttle:</strong></div>';
    asyncOutput.innerHTML += '<div>Быстро нажимаем кнопку несколько раз:</div>';
    
    const testInterval = setInterval(() => {
        normalFunction();
        throttledFunction();
    }, 500);
    
    setTimeout(() => {
        clearInterval(testInterval);
        asyncOutput.innerHTML += '<div class="test-result">Тест завершен. Throttle ограничил количество вызовов.</div>';
    }, 3000);
}

function setupTimerEvents() {
    
    const startBtn = document.getElementById('start-timer');
    const stopBtn = document.getElementById('stop-timer');
    const debounceBtn = document.getElementById('debounce-btn');
    const throttleBtn = document.getElementById('throttle-btn');
    
    if (startBtn) {
        startBtn.addEventListener('click', startTimer);
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', stopTimer);
    }
    
    if (debounceBtn) {
        debounceBtn.addEventListener('click', testDebounce);
    }
    
    if (throttleBtn) {
        throttleBtn.addEventListener('click', testThrottle);
    }
}

function initializeEventHandlers() {
    setupBasicEvents();        
    setupKeyboardEvents();     
    setupDelegationEvents();   
    setupPreventionEvents();   
    setupCustomEvents();       
    setupLoadingEvents();      
    setupTimerEvents();       

    console.log('Все обработчики событий инициализированы!');
}

document.addEventListener('DOMContentLoaded', initializeEventHandlers);