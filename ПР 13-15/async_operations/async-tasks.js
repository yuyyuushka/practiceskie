
function createBasicPromise(shouldResolve = true) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldResolve) {
                resolve("Успех! Промис выполнен успешно");
            } else {
                reject("Ошибка! Промис завершился с ошибкой");
            }
        }, 1000);
    });
}

function handleBasicPromise() {
    const output = document.getElementById('promise-output');
    output.textContent = "Ожидание выполнения промиса...";
    output.className = "output loading";
    
    createBasicPromise(true)
        .then(result => {
            output.textContent = `Результат: ${result}`;
            output.className = "output success";
        })
        .catch(error => {
            output.textContent = `Ошибка: ${error}`;
            output.className = "output error";
        });
}

function createPromiseChain() {
    const output = document.getElementById('promise-output');
    output.textContent = "Запуск цепочки промисов...";
    output.className = "output loading";
    
    createBasicPromise(true)
        .then(result1 => {
            output.textContent += `\nШаг 1: ${result1}`;
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(`${result1} -> Обработано в шаге 2`);
                }, 500);
            });
        })
        .then(result2 => {
            output.textContent += `\nШаг 2: ${result2}`;
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(`${result2} -> Завершено в шаге 3`);
                }, 500);
            });
        })
        .then(result3 => {
            output.textContent += `\nШаг 3: ${result3}`;
            output.textContent += "\nЦепочка промисов завершена!";
            output.className = "output success";
        })
        .catch(error => {
            output.textContent = `Ошибка в цепочке: ${error}`;
            output.className = "output error";
        });
}

function handlePromiseError() {
    const output = document.getElementById('promise-output');
    output.textContent = "Тестирование обработки ошибок...";
    output.className = "output loading";
    
    createBasicPromise(false)
        .then(result => {
            output.textContent = `Успех: ${result}`;
            output.className = "output success";
        })
        .catch(error => {
            output.textContent = `Поймана ошибка: ${error}`;
            output.className = "output error";
        });
}

function setupPromiseEvents() {
    document.getElementById('basic-promise').addEventListener('click', handleBasicPromise);
    document.getElementById('promise-chain').addEventListener('click', createPromiseChain);
    document.getElementById('promise-error').addEventListener('click', handlePromiseError);
}

async function basicAsyncAwait() {
    const output = document.getElementById('async-output');
    output.textContent = "Запуск async/await...";
    output.className = "output loading";
    
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const result = await createBasicPromise(true);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        output.textContent = `Async/await результат: ${result}`;
        output.className = "output success";
    } catch (error) {
        output.textContent = `Async/await ошибка: ${error}`;
        output.className = "output error";
    }
}

async function handleAsyncError() {
    const output = document.getElementById('async-output');
    output.textContent = "Тестирование обработки ошибок в async/await...";
    output.className = "output loading";
    
    try {
        const result = await createBasicPromise(false);
        output.textContent = `Успех: ${result}`;
        output.className = "output success";
    } catch (error) {
        output.textContent = `Поймана ошибка в async/await: ${error}`;
        output.className = "output error";
    }
}

async function parallelAsyncExecution() {
    const output = document.getElementById('async-output');
    output.textContent = "Запуск параллельного выполнения...";
    output.className = "output loading";
    
    const startTime = Date.now();
    
    try {
        const promises = [
            createBasicPromise(true),
            createBasicPromise(true),
            createBasicPromise(true)
        ];
        
        const results = await Promise.all(promises);
        
        const endTime = Date.now();
        const executionTime = endTime - startTime;
        
        output.textContent = `Параллельное выполнение завершено!\n` +
                           `Время выполнения: ${executionTime}ms\n` +
                           `Результаты:\n` +
                           `- ${results[0]}\n` +
                           `- ${results[1]}\n` +
                           `- ${results[2]}`;
        output.className = "output success";
    } catch (error) {
        output.textContent = `Ошибка при параллельном выполнении: ${error}`;
        output.className = "output error";
    }
}

function setupAsyncEvents() {
    document.getElementById('basic-async').addEventListener('click', basicAsyncAwait);
    document.getElementById('async-error').addEventListener('click', handleAsyncError);
    document.getElementById('async-parallel').addEventListener('click', parallelAsyncExecution);
}

async function fetchUsers() {
    const output = document.getElementById('api-output');
    const dataContainer = document.getElementById('api-data');
    
    if (!output || !dataContainer) {
        console.error('Элементы #api-output или #api-data не найдены');
        return;
    }
    
    output.textContent = "Загрузка пользователей...";
    output.className = "output loading";
    dataContainer.innerHTML = "";
    
    try {
        console.log("Начинаем загрузку пользователей...");
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const users = await response.json();
        console.log("Пользователи загружены:", users);
        
        output.textContent = `Успешно загружено ${users.length} пользователей`;
        output.className = "output success";
        
        // Создаем карточки пользователей
        if (users && users.length > 0) {
            dataContainer.innerHTML = users.map(user => `
                <div class="user-card">
                    <h4>${user.name || 'Не указано'}</h4>
                    <p><strong>Email:</strong> ${user.email || 'Не указан'}</p>
                    <p><strong>Телефон:</strong> ${user.phone || 'Не указан'}</p>
                    <p><strong>Компания:</strong> ${user.company?.name || 'Не указана'}</p>
                    <p><strong>Город:</strong> ${user.address?.city || 'Не указан'}</p>
                    <p><strong>Вебсайт:</strong> ${user.website || 'Не указан'}</p>
                </div>
            `).join('');
        } else {
            dataContainer.innerHTML = "<p>Пользователи не найдены</p>";
        }
        
    } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
        output.textContent = `Ошибка при загрузке пользователей: ${error.message}`;
        output.className = "output error";
        dataContainer.innerHTML = "";
    }
}

// 3.2. Создайте функцию createPost, которая отправляет POST запрос
async function createPost() {
    const output = document.getElementById('api-output');
    
    if (!output) {
        console.error('Элемент #api-output не найден');
        return;
    }
    
    output.textContent = "Отправка POST запроса...";
    output.className = "output loading";
    
    try {
        const postData = {
            title: 'Новый пост из JavaScript',
            body: 'Это содержимое поста, отправленного через fetch API',
            userId: 1
        };
        
        console.log("Отправляем POST запрос с данными:", postData);
        
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(postData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("POST запрос успешен:", result);
        
        output.textContent = `Пост успешно создан!\n\n` +
                           `ID: ${result.id || 'N/A'}\n` +
                           `Заголовок: ${result.title || 'N/A'}\n` +
                           `Содержимое: ${result.body || 'N/A'}\n` +
                           `User ID: ${result.userId || 'N/A'}`;
        output.className = "output success";
        
    } catch (error) {
        console.error('Ошибка при создании поста:', error);
        output.textContent = `Ошибка при создании поста: ${error.message}`;
        output.className = "output error";
    }
}

// 3.3. Создайте функцию testApiError, которая тестирует обработку ошибок API
async function testApiError() {
    const output = document.getElementById('api-output');
    
    if (!output) {
        console.error('Элемент #api-output не найден');
        return;
    }
    
    output.textContent = "Тестирование обработки ошибок API...";
    output.className = "output loading";
    
    try {
        console.log("Пытаемся получить доступ к несуществующему ресурсу...");
        
        // Пытаемся получить доступ к несуществующему ресурсу
        const response = await fetch('https://jsonplaceholder.typicode.com/nonexistent-endpoint-12345');
        
        console.log("Получен ответ:", response.status, response.statusText);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Ресурс не найден (404). Проверьте URL адрес.`);
            } else if (response.status >= 500) {
                throw new Error(`Ошибка сервера (${response.status}). Попробуйте позже.`);
            } else {
                throw new Error(`HTTP ошибка! Статус: ${response.status} ${response.statusText}`);
            }
        }
        
        const data = await response.json();
        output.textContent = `Успех: ${JSON.stringify(data, null, 2)}`;
        output.className = "output success";
        
    } catch (error) {
        console.error('Произошла ошибка API:', error);
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            output.textContent = `Сетевая ошибка: Не удалось выполнить запрос. \nВозможные причины:\n- Проверьте подключение к интернету\n- Проверьте CORS настройки\n- URL может быть недоступен`;
        } else if (error.message.includes('404')) {
            output.textContent = `Ошибка 404: Ресурс не найден.\nЭто ожидаемое поведение для теста ошибок.`;
        } else {
            output.textContent = `Ошибка API: ${error.message}`;
        }
        output.className = "output error";
    }
}

// 3.4. Создайте функцию setupApiEvents, которая настраивает обработчики API
function setupApiEvents() {
    const fetchUserBtn = document.getElementById('fetch-user');
    const fetchPostBtn = document.getElementById('fetch-post');
    const fetchErrorBtn = document.getElementById('fetch-error');
    
    if (!fetchUserBtn || !fetchPostBtn || !fetchErrorBtn) {
        console.error('Не найдены кнопки API. Проверьте HTML структуру.');
        return;
    }
    
    fetchUserBtn.addEventListener('click', fetchUsers);
    fetchPostBtn.addEventListener('click', createPost);
    fetchErrorBtn.addEventListener('click', testApiError);
    
    console.log("Обработчики API настроены успешно");
}

async function testBasicApiConnection() {
    try {
        console.log("Тестируем базовое подключение к API...");
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        
        if (!response.ok) {
            throw new Error(`API недоступен. Статус: ${response.status}`);
        }
        
        const user = await response.json();
        console.log("✅ API доступен. Тестовый пользователь:", user.name);
        return true;
    } catch (error) {
        console.error("❌ Проблема с API:", error.message);
        return false;
    }
}

let intervalId;
let intervalCounter = 0;

async function startAsyncInterval() {
    const output = document.getElementById('interval-output');
    const startButton = document.getElementById('start-interval');
    const stopButton = document.getElementById('stop-interval');
    
    if (intervalId) {
        output.textContent = "Интервал уже запущен!";
        output.className = "output warning";
        return;
    }
    
    intervalCounter = 0;
    output.textContent = "Интервал запущен...";
    output.className = "output";
    
    startButton.disabled = true;
    stopButton.disabled = false;
    
    intervalId = setInterval(async () => {
        intervalCounter++;
        output.textContent = `Интервал: ${intervalCounter}`;
        
        try {
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (intervalCounter % 5 === 0) {
                throw new Error(`Имитация ошибки на итерации ${intervalCounter}`);
            }
            
        } catch (error) {
            console.error('Ошибка в интервале:', error);
            output.textContent = `Интервал: ${intervalCounter} (Ошибка: ${error.message})`;
            output.className = "output error";
        }
    }, 1000);
}

function stopAsyncInterval() {
    const output = document.getElementById('interval-output');
    const startButton = document.getElementById('start-interval');
    const stopButton = document.getElementById('stop-interval');
    
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        output.textContent = `Интервал остановлен. Всего итераций: ${intervalCounter}`;
        output.className = "output success";
        
        startButton.disabled = false;
        stopButton.disabled = true;
    } else {
        output.textContent = "Интервал не был запущен";
        output.className = "output warning";
    }
}

function delayWithPromise(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`Задержка завершена через ${ms}ms`);
        }, ms);
    });
}

async function testDelay() {
    const output = document.getElementById('timer-output');
    output.textContent = "Начинаем последовательность задержек...";
    output.className = "output loading";
    
    try {
        output.textContent += "\nЗадержка 1сек...";
        await delayWithPromise(1000);
        output.textContent += "\n✓ Завершено";
        
        output.textContent += "\nЗадержка 1.5сек...";
        await delayWithPromise(1500);
        output.textContent += "\n✓ Завершено";
        
        output.textContent += "\nЗадержка 0.5сек...";
        await delayWithPromise(500);
        output.textContent += "\n✓ Завершено";
        
        output.textContent += "\n\nВсе задержки завершены успешно!";
        output.className = "output success";
        
    } catch (error) {
        output.textContent += `\nОшибка: ${error.message}`;
        output.className = "output error";
    }
}

function setupTimerEvents() {
    document.getElementById('start-interval').addEventListener('click', startAsyncInterval);
    document.getElementById('stop-interval').addEventListener('click', stopAsyncInterval);
    document.getElementById('delay-promise').addEventListener('click', testDelay);
    
    document.getElementById('stop-interval').disabled = true;
}

async function asyncTryCatch() {
    const output = document.getElementById('error-output');
    output.textContent = "Тестирование try/catch с async...";
    output.className = "output loading";
    
    try {
        output.textContent += "\n\nШаг 1: Запуск успешной операции...";
        const result1 = await createBasicPromise(true);
        output.textContent += `\n✓ ${result1}`;
        
        output.textContent += "\n\nШаг 2: Имитация сетевой ошибки...";
        try {
            await new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Сетевая ошибка: timeout")), 1000);
            });
        } catch (networkError) {
            output.textContent += `\n⚠ Поймана сетевая ошибка: ${networkError.message}`;
        }
        
        output.textContent += "\n\nШаг 3: Проверка синхронных ошибок в async...";
        const invalidData = null;
        try {
            if (!invalidData) {
                throw new Error("Данные не определены");
            }
        } catch (syncError) {
            output.textContent += `\n⚠ Поймана синхронная ошибка: ${syncError.message}`;
        }
        
        output.textContent += "\n\nШаг 4: Пользовательская ошибка...";
        try {
            await createBasicPromise(false);
        } catch (customError) {
            output.textContent += `\n⚠ Поймана пользовательская ошибка: ${customError}`;
            throw new Error(`Цепочка ошибок: ${customError}`);
        }
        
    } catch (finalError) {
        output.textContent += `\n\nФинальная ошибка: ${finalError.message}`;
        output.className = "output error";
        return;
    }
    
    output.textContent += "\n\nВсе операции завершены, ошибки обработаны!";
    output.className = "output success";
}

async function handleMultipleErrors() {
    const output = document.getElementById('error-output');
    output.textContent = "Обработка множественных ошибок...";
    output.className = "output loading";
    
    const promises = [
        createBasicPromise(true),
        createBasicPromise(false),
        createBasicPromise(true),
        createBasicPromise(false),
        createBasicPromise(true),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Таймаут")), 800))
    ];
    
    try {
        const results = await Promise.allSettled(promises);
        
        let successCount = 0;
        let errorCount = 0;
        const errorMessages = [];
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                successCount++;
                output.textContent += `\nПромис ${index + 1}: Успех - ${result.value}`;
            } else {
                errorCount++;
                output.textContent += `\nПромис ${index + 1}: Ошибка - ${result.reason}`;
                errorMessages.push(result.reason);
            }
        });
        
        output.textContent += `\n\nСтатистика:\n` +
                           `Успешных: ${successCount}\n` +
                           `Ошибок: ${errorCount}\n` +
                           `Общее: ${results.length}`;
        
        if (errorCount > 0) {
            output.textContent += `\n\nСообщения об ошибках:\n${errorMessages.join('\n')}`;
            output.className = "output warning";
        } else {
            output.className = "output success";
        }
        
    } catch (error) {
        output.textContent = `Неожиданная ошибка: ${error.message}`;
        output.className = "output error";
    }
}

async function retryWithBackoff(operation, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Попытка ${attempt} из ${maxRetries}`);
            return await operation();
        } catch (error) {
            lastError = error;
            console.log(`Попытка ${attempt} не удалась: ${error.message}`);
            
            if (attempt === maxRetries) {
                break;
            }
            
            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.log(`Повтор через ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw new Error(`Все ${maxRetries} попыток не удались. Последняя ошибка: ${lastError.message}`);
}

async function demonstrateRetryPattern() {
    const output = document.getElementById('error-output');
    output.textContent = "Тестирование паттерна повторных попыток...";
    output.className = "output loading";
    
    let attemptCount = 0;
    
    const flakyOperation = async () => {
        attemptCount++;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (attemptCount < 4) {
            throw new Error(`Случайная ошибка на попытке ${attemptCount}`);
        }
        
        return "Операция завершена успешно!";
    };
    
    try {
        const result = await retryWithBackoff(flakyOperation, 5, 1000);
        output.textContent = `${result}\nВсего попыток: ${attemptCount}`;
        output.className = "output success";
    } catch (error) {
        output.textContent = `${error.message}\nВсего попыток: ${attemptCount}`;
        output.className = "output error";
    }
}

function setupErrorEvents() {
    document.getElementById('try-catch').addEventListener('click', asyncTryCatch);
    document.getElementById('multiple-error').addEventListener('click', handleMultipleErrors);
    document.getElementById('retry-pattern').addEventListener('click', demonstrateRetryPattern);
}

async function demonstratePromiseAll() {
    const output = document.getElementById('parallel-output');
    output.textContent = "Демонстрация Promise.all...";
    output.className = "output loading";
    
    const startTime = Date.now();
    
    const promises = [
        new Promise(resolve => setTimeout(() => resolve("Быстрая операция (500ms)"), 500)),
        new Promise(resolve => setTimeout(() => resolve("Средняя операция (1000ms)"), 1000)),
        new Promise(resolve => setTimeout(() => resolve("Медленная операция (1500ms)"), 1500)),
        new Promise(resolve => setTimeout(() => resolve("Очень медленная операция (2000ms)"), 2000)),
        createBasicPromise(true)
    ];
    
    try {
        const results = await Promise.all(promises);
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        output.textContent = `Promise.all завершен!\n` +
                           `Общее время: ${totalTime}ms\n` +
                           `Количество операций: ${results.length}\n\n` +
                           `Результаты:\n${results.map((result, i) => `${i + 1}. ${result}`).join('\n')}`;
        output.className = "output success";
        
    } catch (error) {
        const endTime = Date.now();
        output.textContent = `Promise.all завершился с ошибкой!\n` +
                           `Прошло времени: ${endTime - startTime}ms\n` +
                           `Ошибка: ${error.message}`;
        output.className = "output error";
    }
}

async function demonstratePromiseRace() {
    const output = document.getElementById('parallel-output');
    output.textContent = "Демонстрация Promise.race...";
    output.className = "output loading";
    
    const startTime = Date.now();
    
    const promises = [
        new Promise(resolve => setTimeout(() => resolve("Победитель: Быстрая операция (300ms)"), 300)),
        new Promise(resolve => setTimeout(() => resolve("Средняя операция (800ms)"), 800)),
        new Promise(resolve => setTimeout(() => resolve("Медленная операция (1200ms)"), 1200)),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Ошибка (600ms)")), 600))
    ];
    
    try {
        const result = await Promise.race(promises);
        const endTime = Date.now();
        const raceTime = endTime - startTime;
        
        output.textContent = `Promise.race завершен!\n` +
                           `Время гонки: ${raceTime}ms\n` +
                           `Победитель: ${result}`;
        output.className = "output success";
        
    } catch (error) {
        const endTime = Date.now();
        output.textContent = `Promise.race: первая операция завершилась ошибкой!\n` +
                           `Время: ${endTime - startTime}ms\n` +
                           `Ошибка: ${error.message}`;
        output.className = "output error";
    }
}

async function demonstratePromiseAllSettled() {
    const output = document.getElementById('parallel-output');
    output.textContent = "Демонстрация Promise.allSettled...";
    output.className = "output loading";
    
    const startTime = Date.now();
    
    const promises = [
        new Promise(resolve => setTimeout(() => resolve("Успешная операция 1"), 600)),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Ошибка 1")), 400)),
        new Promise(resolve => setTimeout(() => resolve("Успешная операция 2"), 800)),
        createBasicPromise(true),
        createBasicPromise(false),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Ошибка 2")), 1000))
    ];
    
    const results = await Promise.allSettled(promises);
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    
    const fulfilled = results.filter(r => r.status === 'fulfilled');
    const rejected = results.filter(r => r.status === 'rejected');
    
    output.textContent = `Promise.allSettled завершен!\n` +
                       `Общее время: ${totalTime}ms\n` +
                       `Успешных: ${fulfilled.length}, Ошибок: ${rejected.length}\n\n` +
                       `Детали:\n` +
                       results.map((result, i) => {
                           if (result.status === 'fulfilled') {
                               return `${i + 1}. ${result.value}`;
                           } else {
                               return `${i + 1}. ${result.reason.message}`;
                           }
                       }).join('\n');
    
    if (rejected.length === 0) {
        output.className = "output success";
    } else if (fulfilled.length === 0) {
        output.className = "output error";
    } else {
        output.className = "output warning";
    }
}

function setupParallelEvents() {
    document.getElementById('promise-all').addEventListener('click', demonstratePromiseAll);
    document.getElementById('promise-race').addEventListener('click', demonstratePromiseRace);
    document.getElementById('promise-allSettled').addEventListener('click', demonstratePromiseAllSettled);
}

function displayOutput(elementId, data, isError = false) {
    const output = document.getElementById(elementId);
    if (!output) return;

    const timestamp = new Date().toLocaleTimeString();
    const content = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);

    output.innerHTML = `[${timestamp}] ${content}`;
    output.className = `output ${isError ? 'error' : 'success'}`;
}

function updateProgress(percentage) {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
}

function setLoadingState(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="spinner"></span> Загрузка...';
    } else {
        button.disabled = false;
        const originalText = button.getAttribute('data-original-text') || button.textContent;
        button.innerHTML = originalText;
    }
}

function saveOriginalButtonTexts() {
    document.querySelectorAll('button').forEach(button => {
        button.setAttribute('data-original-text', button.textContent);
    });
}

async function sequentialApiRequests() {
    const output = document.getElementById('scenario-output');
    const button = document.getElementById('sequential-requests');
    
    setLoadingState('sequential-requests', true);
    output.textContent = "Начинаем последовательные запросы...";
    output.className = "output loading";
    
    try {
        output.textContent += "\n\n1. Получаем пользователя...";
        const userResponse = await fetch('https://jsonplaceholder.typicode.com/users/1');
        if (!userResponse.ok) throw new Error('Ошибка получения пользователя');
        const user = await userResponse.json();
        output.textContent += `\n✓ Получен пользователь: ${user.name}`;
        
        output.textContent += "\n\n2. Получаем посты пользователя...";
        const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/users/1/posts`);
        if (!postsResponse.ok) throw new Error('Ошибка получения постов');
        const posts = await postsResponse.json();
        output.textContent += `\n✓ Получено постов: ${posts.length}`;
        
        if (posts.length > 0) {
            output.textContent += "\n\n3. Получаем комментарии к первому посту...";
            const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${posts[0].id}/comments`);
            if (!commentsResponse.ok) throw new Error('Ошибка получения комментариев');
            const comments = await commentsResponse.json();
            output.textContent += `\n✓ Получено комментариев: ${comments.length}`;
            
            output.textContent += `\n\nИтоги последовательных запросов:\n` +
                               `Пользователь: ${user.name}\n` +
                               `Количество постов: ${posts.length}\n` +
                               `Количество комментариев: ${comments.length}\n` +
                               `Email: ${user.email}\n` +
                               `Город: ${user.address.city}`;
        }
        
        output.className = "output success";
        
    } catch (error) {
        output.textContent += `\n\nОшибка: ${error.message}`;
        output.className = "output error";
    } finally {
        setLoadingState('sequential-requests', false);
    }
}

async function simulateFileUpload() {
    const output = document.getElementById('scenario-output');
    const button = document.getElementById('upload-simulation');
    
    setLoadingState('upload-simulation', true);
    output.textContent = "Начинаем симуляцию загрузки файла...";
    output.className = "output loading";
    updateProgress(0);
    
    try {
        const fileSize = 100; 
        let uploaded = 0;
        
        while (uploaded < fileSize) {
            const chunk = Math.min(Math.floor(Math.random() * 10) + 5, fileSize - uploaded);
            uploaded += chunk;
            const progress = Math.min((uploaded / fileSize) * 100, 100);
            
            updateProgress(progress);
            output.textContent = `Загрузка файла... ${progress.toFixed(1)}%`;
            
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        updateProgress(100);
        
        output.textContent = `Загрузка завершена!\n` +
                           `Размер файла: ${fileSize} единиц\n` +
                           `Время загрузки: ~${(fileSize * 300 / 1000).toFixed(1)} секунд`;
        output.className = "output success";
        
    } catch (error) {
        output.textContent = `Ошибка загрузки: ${error.message}`;
        output.className = "output error";
        updateProgress(0);
    } finally {
        setLoadingState('upload-simulation', false);
    }
}

function createRequestCache() {
    const cache = new Map();
    
    return async function cachedRequest(url) {
        if (cache.has(url)) {
            console.log(`Возвращаем закэшированный результат для: ${url}`);
            return cache.get(url);
        }
        
        console.log(`Выполняем новый запрос: ${url}`);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            cache.set(url, data);
            console.log(`Результат закэширован для: ${url}`);
            
            return data;
        } catch (error) {
            console.error(`Ошибка запроса ${url}:`, error);
            throw error;
        }
    };
}

const cachedFetch = createRequestCache();

async function demonstrateCaching() {
    const output = document.getElementById('scenario-output');
    const button = document.getElementById('cache-requests');
    
    setLoadingState('cache-requests', true);
    output.textContent = "Тестирование кэширования запросов...";
    output.className = "output loading";
    
    const testUrl = 'https://jsonplaceholder.typicode.com/users/1';
    
    try {
        output.textContent += "\n\nПервый запрос (должен быть медленным)...";
        const startTime1 = Date.now();
        const user1 = await cachedFetch(testUrl);
        const time1 = Date.now() - startTime1;
        output.textContent += `\n✓ Получен пользователь: ${user1.name} (${time1}ms)`;
        
        output.textContent += "\n\nВторой запрос (должен быть быстрым - из кэша)...";
        const startTime2 = Date.now();
        const user2 = await cachedFetch(testUrl);
        const time2 = Date.now() - startTime2;
        output.textContent += `\n✓ Получен пользователь: ${user2.name} (${time2}ms)`;
        
        output.textContent += "\n\nТретий запрос (тоже из кэша)...";
        const startTime3 = Date.now();
        const user3 = await cachedFetch(testUrl);
        const time3 = Date.now() - startTime3;
        output.textContent += `\n✓ Получен пользователь: ${user3.name} (${time3}ms)`;
        
        output.textContent += `\n\n📊 Результаты кэширования:\n` +
                           `Первый запрос: ${time1}ms\n` +
                           `Второй запрос: ${time2}ms\n` +
                           `Третий запрос: ${time3}ms\n` +
                           `Ускорение: ${((time1 - time2) / time1 * 100).toFixed(1)}%`;
        
        output.className = "output success";
        
    } catch (error) {
        output.textContent += `\n\n❌ Ошибка: ${error.message}`;
        output.className = "output error";
    } finally {
        setLoadingState('cache-requests', false);
    }
}

function setupRealScenarioEvents() {
    document.getElementById('sequential-requests').addEventListener('click', sequentialApiRequests);
    document.getElementById('upload-simulation').addEventListener('click', simulateFileUpload);
    document.getElementById('cache-requests').addEventListener('click', demonstrateCaching);
}

function initializeAsyncOperations() {
    saveOriginalButtonTexts();
    
    setupPromiseEvents();
    setupAsyncEvents();
    setupApiEvents();
    setupTimerEvents();
    setupErrorEvents();
    setupParallelEvents();
    setupRealScenarioEvents();
    
    console.log('Все асинхронные обработчики инициализированы!');
}

document.addEventListener('DOMContentLoaded', initializeAsyncOperations);