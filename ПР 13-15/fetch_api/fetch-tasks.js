
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

function displayOutput(elementId, message, isError = false) {
    const outputElement = document.getElementById(elementId);
    if (outputElement) {
        outputElement.textContent = message;
        outputElement.style.color = isError ? '#d32f2f' : '#616161';
    }
    console.log(message);
}

function clearDataContainer(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.style.cssText = `
        background: #f5f5f5;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        padding: 15px;
        margin: 10px 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `;
    
    card.innerHTML = `
        <h4 style="margin: 0 0 10px 0; color: #424242;">${user.name}</h4>
        <p style="margin: 5px 0; color: #616161;"><strong>Email:</strong> ${user.email}</p>
        <p style="margin: 5px 0; color: #616161;"><strong>Телефон:</strong> ${user.phone}</p>
        <p style="margin: 5px 0; color: #616161;"><strong>Город:</strong> ${user.address.city}</p>
        <p style="margin: 5px 0; color: #616161;"><strong>Компания:</strong> ${user.company.name}</p>
    `;
    
    return card;
}

async function fetchGetRequest() {
    try {
        displayOutput('get-output', 'Выполняется GET запрос...');
        clearDataContainer('get-data');
        
        const response = await fetch(`${API_BASE_URL}/posts/1`);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const data = await response.json();
        displayOutput('get-output', `GET запрос выполнен успешно!`);
        
        const dataContainer = document.getElementById('get-data');
        dataContainer.innerHTML = `
            <div style="background: #f0f0f0; padding: 15px; border-radius: 4px;">
                <h4>Пост #${data.id}</h4>
                <p><strong>Заголовок:</strong> ${data.title}</p>
                <p><strong>Текст:</strong> ${data.body}</p>
                <p><strong>ID пользователя:</strong> ${data.userId}</p>
            </div>
        `;
        
    } catch (error) {
        displayOutput('get-output', `Ошибка: ${error.message}`, true);
    }
}

async function fetchJsonData() {
    try {
        displayOutput('get-output', 'Загрузка данных пользователей...');
        clearDataContainer('get-data');
        
        const response = await fetch(`${API_BASE_URL}/users`);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const users = await response.json();
        displayOutput('get-output', `Загружено ${users.length} пользователей`);
        
        const dataContainer = document.getElementById('get-data');
        users.forEach(user => {
            const userCard = createUserCard(user);
            dataContainer.appendChild(userCard);
        });
        
    } catch (error) {
        displayOutput('get-output', `Ошибка: ${error.message}`, true);
    }
}

async function fetchWithError() {
    try {
        displayOutput('get-output', 'Пытаемся выполнить запрос к несуществующему URL...');
        clearDataContainer('get-data');

        const response = await fetch(`${API_BASE_URL}/nonexistent-endpoint`);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        displayOutput('get-output', 'Запрос выполнен (это не должно произойти)');
        
    } catch (error) {
        displayOutput('get-output', `Произошла ошибка: ${error.message}`, true);

        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            displayOutput('get-output', `Это сетевая ошибка (например, нет подключения к интернету)`, true);
        } else {
            displayOutput('get-output', `Это HTTP ошибка (сервер ответил, но с ошибкой)`, true);
        }
    }
}

function setupGetRequests() {
    document.getElementById('fetch-get').addEventListener('click', fetchGetRequest);
    document.getElementById('fetch-json').addEventListener('click', fetchJsonData);
    document.getElementById('fetch-error').addEventListener('click', fetchWithError);
}

async function fetchPostRequest() {
    try {
        displayOutput('crud-output', 'Отправка POST запроса для создания нового поста...');
        
        const newPost = {
            title: 'Новый пост',
            body: 'Это тело нового поста, созданного через Fetch API',
            userId: 1
        };
        
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const createdPost = await response.json();
        displayOutput('crud-output', `Пост успешно создан! ID: ${createdPost.id}`);
        
        console.log('Созданный пост:', createdPost);
        
    } catch (error) {
        displayOutput('crud-output', `Ошибка при создании поста: ${error.message}`, true);
    }
}

async function fetchPutRequest() {
    try {
        displayOutput('crud-output', 'Отправка PUT запроса для полного обновления поста...');
        
        const updatedPost = {
            id: 1,
            title: 'Полностью обновленный пост',
            body: 'Это тело полностью обновленного поста',
            userId: 1
        };
        
        const response = await fetch(`${API_BASE_URL}/posts/1`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPost)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const result = await response.json();
        displayOutput('crud-output', `Пост успешно обновлен!`);
        
        console.log('Обновленный пост:', result);
        
    } catch (error) {
        displayOutput('crud-output', `Ошибка при обновлении поста: ${error.message}`, true);
    }
}

async function fetchPatchRequest() {
    try {
        displayOutput('crud-output', 'Отправка PATCH запроса для частичного обновления поста...');
        
        const partialUpdate = {
            title: 'Частично обновленный заголовок'
        };
        
        const response = await fetch(`${API_BASE_URL}/posts/1`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(partialUpdate)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const result = await response.json();
        displayOutput('crud-output', `Заголовок поста успешно обновлен!`);
        
        console.log('Результат PATCH запроса:', result);
        console.log('Разница между PUT и PATCH: PUT заменяет весь ресурс, а PATCH только указанные поля');
        
    } catch (error) {
        displayOutput('crud-output', `Ошибка при частичном обновлении: ${error.message}`, true);
    }
}

async function fetchDeleteRequest() {
    try {
        displayOutput('crud-output', 'Отправка DELETE запроса для удаления поста...');
        
        const response = await fetch(`${API_BASE_URL}/posts/1`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }

        if (response.status === 200) {
            displayOutput('crud-output', `Пост успешно удален! Статус: ${response.status}`);
        } else {
            displayOutput('crud-output', `Запрос на удаление обработан. Статус: ${response.status}`);
        }
        
        console.log('Статус ответа DELETE:', response.status);
        
    } catch (error) {
        displayOutput('crud-output', `Ошибка при удалении: ${error.message}`, true);
    }
}

function setupCrudRequests() {
    document.getElementById('fetch-post').addEventListener('click', fetchPostRequest);
    document.getElementById('fetch-put').addEventListener('click', fetchPutRequest);
    document.getElementById('fetch-patch').addEventListener('click', fetchPatchRequest);
    document.getElementById('fetch-delete').addEventListener('click', fetchDeleteRequest);
}

async function fetchWithHeaders() {
    try {
        displayOutput('headers-output', 'Отправка запроса с кастомными заголовками...');
        
        const customHeaders = {
            'X-Custom-Header': 'MyCustomValue123',
            'Authorization': 'Bearer fake-jwt-token-12345',
            'X-Request-ID': `req-${Date.now()}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        console.log('Отправляемые заголовки:', customHeaders);
        
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'GET',
            headers: customHeaders
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const data = await response.json();

        let outputMessage = `Запрос выполнен успешно!\n\n`;
        outputMessage += `Отправленные заголовки:\n`;
        Object.entries(customHeaders).forEach(([key, value]) => {
            outputMessage += `  ${key}: ${value}\n`;
        });
        
        outputMessage += `\nПолучено постов: ${data.length}`;
        
        displayOutput('headers-output', outputMessage);

        console.log('Заголовки ответа:');
        response.headers.forEach((value, key) => {
            console.log(`  ${key}: ${value}`);
        });
        
    } catch (error) {
        displayOutput('headers-output', `Ошибка: ${error.message}`, true);
    }
}

async function fetchWithAuth() {
    try {
        displayOutput('headers-output', 'Тестирование различных методов авторизации...');
        
        const username = 'testuser';
        const password = 'testpass';
        const basicAuth = btoa(`${username}:${password}`);

        const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-token';

        const apiKey = '12345-abcde-67890';

        displayOutput('headers-output', 'Пытаемся выполнить запрос с Basic Auth...');
        
        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {

            if (response.status === 401) {
                throw new Error('Ошибка авторизации: Неверные учетные данные');
            }
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        let outputMessage = `Basic Auth запрос выполнен (демонстрация)\n\n`;
        outputMessage += `Методы авторизации:\n`;
        outputMessage += `1. Basic Auth: ${basicAuth}\n`;
        outputMessage += `2. Bearer Token: ${bearerToken}\n`;
        outputMessage += `3. API Key: ${apiKey}\n\n`;
        outputMessage += `В реальном приложении эти данные должны храниться безопасно!`;
        
        displayOutput('headers-output', outputMessage);
        
        console.log('Демонстрация обработки неверных учетных данных:');
        try {

            const fakeResponse = await fetch(`${API_BASE_URL}/posts`, {
                headers: {
                    'Authorization': 'Bearer invalid-token-123'
                }
            });
            
            if (fakeResponse.status === 401) {
                console.log('Получена ошибка 401 - Неавторизован');
            }
        } catch (authError) {
            console.log('Ошибка авторизации:', authError.message);
        }
        
    } catch (error) {
        displayOutput('headers-output', `Ошибка авторизации: ${error.message}`, true);
    }
}

async function fetchWithParams() {
    try {
        displayOutput('headers-output', 'Выполнение запроса с параметрами...');

        const url1 = `${API_BASE_URL}/posts?_limit=5&_sort=id&_order=desc`;
        console.log('URL с ручным формированием:', url1);

        const params = new URLSearchParams({
            '_limit': '5',
            '_sort': 'id', 
            '_order': 'desc',
            '_page': '1'
        });
        
        const url2 = `${API_BASE_URL}/posts?${params.toString()}`;
        console.log('URL с URLSearchParams:', url2);
        
        const response = await fetch(url2);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const data = await response.json();
        
        let outputMessage = `Запрос с параметрами выполнен успешно!\n\n`;
        outputMessage += `Использованные параметры:\n`;
        outputMessage += `  _limit=5 (ограничение количества результатов)\n`;
        outputMessage += `  _sort=id (сортировка по ID)\n`;
        outputMessage += `  _order=desc (порядок сортировки: по убыванию)\n\n`;
        outputMessage += `Получено постов: ${data.length}\n`;
        outputMessage += `ID первого поста: ${data[0]?.id || 'N/A'}`;
        
        displayOutput('headers-output', outputMessage);

        console.log('Все параметры из URLSearchParams:');
        params.forEach((value, key) => {
            console.log(`  ${key} = ${value}`);
        });
        
    } catch (error) {
        displayOutput('headers-output', `Ошибка: ${error.message}`, true);
    }
}

async function fetchWithTimeout() {
    try {
        displayOutput('headers-output', 'Запуск запроса с таймаутом 3 секунды...');
        
        const abortController = new AbortController();
        const signal = abortController.signal;

        const timeoutId = setTimeout(() => {
            abortController.abort();
            console.log('Запрос отменен по таймауту');
        }, 3000);

        const slowUrl = `${API_BASE_URL}/posts?_delay=5000`; 
        
        const response = await fetch(slowUrl, {
            signal: signal,
            method: 'GET'
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const data = await response.json();
        displayOutput('headers-output', `Запрос выполнен успешно до истечения таймаута! Получено постов: ${data.length}`);
        
    } catch (error) {
        if (error.name === 'AbortError') {
            displayOutput('headers-output', 'Запрос был отменен по таймауту (3 секунды)', true);
            console.log('Тип ошибки: AbortError - запрос был прерван AbortController');
        } else {
            displayOutput('headers-output', `Ошибка: ${error.message}`, true);
        }
    }
}

function setupHeadersAndParams() {
    document.getElementById('fetch-headers').addEventListener('click', fetchWithHeaders);
    document.getElementById('fetch-auth').addEventListener('click', fetchWithAuth);
    document.getElementById('fetch-params').addEventListener('click', fetchWithParams);
    document.getElementById('fetch-timeout').addEventListener('click', fetchWithTimeout);
}

async function fetchAndCheckStatus() {
    try {
        displayOutput('response-output', 'Проверка статусов ответов...');
        clearDataContainer('response-data');

        const testUrls = [
            { url: `${API_BASE_URL}/posts/1`, description: 'Успешный запрос (200)' },
            { url: `${API_BASE_URL}/posts/99999`, description: 'Не найден (404)' },
            { url: `${API_BASE_URL}/invalid-endpoint`, description: 'Неверный эндпоинт' },
            { url: 'https://httpstat.us/500', description: 'Ошибка сервера (500)' },
            { url: 'https://httpstat.us/301', description: 'Редирект (301)' }
        ];
        
        let outputMessage = 'Результаты проверки статусов:\n\n';
        
        for (const test of testUrls) {
            try {
                const response = await fetch(test.url);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                outputMessage += ` ${test.description}\n`;
                outputMessage += `   Статус: ${response.status} ${response.statusText}\n`;
                outputMessage += `   OK: ${response.ok}\n\n`;
                
            } catch (error) {
                outputMessage += ` ${test.description}\n`;
                outputMessage += `   Ошибка: ${error.message}\n\n`;
            }
        }

        outputMessage += 'Обработка разных HTTP статусов:\n';
        outputMessage += '• 200-299 - Успех\n';
        outputMessage += '• 300-399 - Перенаправление\n';
        outputMessage += '• 400-499 - Ошибка клиента\n';
        outputMessage += '• 500-599 - Ошибка сервера\n';
        
        displayOutput('response-output', outputMessage);
        
    } catch (error) {
        displayOutput('response-output', `Ошибка: ${error.message}`, true);
    }
}

async function fetchAndReadHeaders() {
    try {
        displayOutput('response-output', 'Чтение заголовков ответа...');
        clearDataContainer('response-data');
        
        const response = await fetch(`${API_BASE_URL}/posts/1`);
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }

        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key] = value;
        });
        
        let outputMessage = 'Заголовки ответа:\n\n';

        const importantHeaders = [
            'content-type', 'content-length', 'date', 
            'server', 'cache-control', 'etag'
        ];
        
        importantHeaders.forEach(header => {
            if (headers[header]) {
                outputMessage += `• ${header}: ${headers[header]}\n`;
            }
        });
        
        outputMessage += '\nВсе заголовки ответа:\n';
        Object.entries(headers).forEach(([key, value]) => {
            outputMessage += `  ${key}: ${value}\n`;
        });
        
        displayOutput('response-output', outputMessage);

        console.log('Все заголовки ответа:', headers);
        
    } catch (error) {
        displayOutput('response-output', `Ошибка: ${error.message}`, true);
    }
}

async function fetchBlobData() {
    try {
        displayOutput('response-output', 'Загрузка изображения как Blob...');
        clearDataContainer('response-data');
        
        const imageUrl = 'https://picsum.photos/200/300'; 
        console.log('Загружаем изображение с:', imageUrl);
        
        const response = await fetch(imageUrl);
        
        if (!response.ok) {
            throw new Error(`Ошибка загрузки изображения: ${response.status}`);
        }

        const blob = await response.blob();
        
        console.log('Blob информация:', {
            size: blob.size,
            type: blob.type,
            blob: blob
        });

        const blobUrl = URL.createObjectURL(blob);

        const dataContainer = document.getElementById('response-data');
        dataContainer.innerHTML = `
            <div style="text-align: center;">
                <h4>Загруженное изображение (Blob)</h4>
                <img src="${blobUrl}" alt="Загруженное изображение" 
                     style="max-width: 200px; border: 2px solid #e0e0e0; border-radius: 4px;">
                <div style="margin-top: 10px; color: #616161;">
                    <p>Размер: ${(blob.size / 1024).toFixed(2)} KB</p>
                    <p>Тип: ${blob.type}</p>
                    <p>Blob URL: ${blobUrl.substring(0, 50)}...</p>
                </div>
            </div>
        `;
        
        displayOutput('response-output', 'Изображение успешно загружено как Blob!');

        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
            console.log('Blob URL очищен');
        }, 5000);
        
    } catch (error) {
        displayOutput('response-output', `Ошибка: ${error.message}`, true);
    }
}

async function fetchWithFormData() {
    try {
        displayOutput('response-output', 'Отправка FormData...');
        clearDataContainer('response-data');

        const formData = new FormData();

        formData.append('title', 'Новый пост через FormData');
        formData.append('body', 'Это тело поста отправлено через FormData');
        formData.append('userId', '1');
        formData.append('category', 'technology');
        
        const fileContent = 'Это содержимое текстового файла';
        const blob = new Blob([fileContent], { type: 'text/plain' });
        formData.append('attachment', blob, 'example.txt');
        
        console.log('FormData содержимое:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        const response = await fetch(`${API_BASE_URL}/posts`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const result = await response.json();
        
        let outputMessage = 'FormData успешно отправлен!\n\n';
        outputMessage += 'Отправленные данные:\n';
        outputMessage += '• title: Новый пост через FormData\n';
        outputMessage += '• body: Это тело поста отправлено через FormData\n';
        outputMessage += '• userId: 1\n';
        outputMessage += '• category: technology\n';
        outputMessage += '• attachment: example.txt (текстовый файл)\n\n';
        outputMessage += 'Разница между JSON и FormData:\n';
        outputMessage += '• JSON: application/json, структурированные данные\n';
        outputMessage += '• FormData: multipart/form-data, файлы + данные\n';
        outputMessage += `• Ответ сервера: ID ${result.id}`;
        
        displayOutput('response-output', outputMessage);
        
        console.log('Content-Type заголовок запроса:', response.headers.get('content-type'));
        
    } catch (error) {
        displayOutput('response-output', `Ошибка: ${error.message}`, true);
    }
}

function setupResponseHandling() {
    document.getElementById('fetch-status').addEventListener('click', fetchAndCheckStatus);
    document.getElementById('fetch-headers-response').addEventListener('click', fetchAndReadHeaders);
    document.getElementById('fetch-blob').addEventListener('click', fetchBlobData);
    document.getElementById('fetch-formdata').addEventListener('click', fetchWithFormData);
}

async function fetchNetworkError() {
    try {
        displayOutput('error-output', 'Пытаемся выполнить запрос к несуществующему домену...');
        

        const response = await fetch('https://this-domain-definitely-does-not-exist-12345.com/api/data');

        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        
        const data = await response.json();
        displayOutput('error-output', 'Запрос выполнен (это не должно произойти)');
        
    } catch (error) {

        let errorMessage = `Сетевая ошибка: ${error.message}\n\n`;

        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            errorMessage += 'Это типовая сетевая ошибка. Возможные причины:\n';
            errorMessage += '• Нет подключения к интернету\n';
            errorMessage += '• DNS не может разрешить домен\n';
            errorMessage += '• Сервер недоступен\n';
            errorMessage += '• CORS ошибка (запрос заблокирован политикой безопасности)\n';
        } else {
            errorMessage += `Тип ошибки: ${error.name}\n`;
        }
        
        displayOutput('error-output', errorMessage, true);
        
        console.log('Детали сетевой ошибки:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    }
}

async function fetchHttpError() {
    try {
        displayOutput('error-output', 'Выполняем запросы, которые возвращают HTTP ошибки...');

        const errorTests = [
            { 
                url: `${API_BASE_URL}/posts/999999`, 
                description: 'Несуществующий пост (404)' 
            },
            { 
                url: 'https://httpstat.us/500', 
                description: 'Ошибка сервера (500)' 
            },
            { 
                url: 'https://httpstat.us/403', 
                description: 'Доступ запрещен (403)' 
            },
            { 
                url: 'https://httpstat.us/429', 
                description: 'Слишком много запросов (429)' 
            }
        ];
        
        let outputMessage = 'Тестирование HTTP ошибок:\n\n';
        
        for (const test of errorTests) {
            try {
                const response = await fetch(test.url);
                
                if (!response.ok) {

                    const httpError = new Error(`HTTP ${response.status}: ${response.statusText}`);
                    httpError.status = response.status;
                    httpError.statusText = response.statusText;
                    httpError.url = test.url;
                    throw httpError;
                }
                
                outputMessage += ` ${test.description} - УСПЕХ (не ожидалось)\n`;
                
            } catch (error) {
                outputMessage += ` ${test.description}\n`;
                outputMessage += `   Статус: ${error.status || 'N/A'}\n`;
                outputMessage += `   Сообщение: ${error.statusText || error.message}\n`;

                if (error.status === 404) {
                    outputMessage += '   Рекомендация: Проверьте URL или ID ресурса\n';
                } else if (error.status === 500) {
                    outputMessage += '   Рекомендация: Проблема на стороне сервера\n';
                } else if (error.status === 403) {
                    outputMessage += '   Рекомендация: Проверьте права доступа\n';
                } else if (error.status === 429) {
                    outputMessage += '   Рекомендация: Добавьте задержку между запросами\n';
                }
                
                outputMessage += '\n';
            }
        }

        outputMessage += 'Классы HTTP ошибок:\n';
        outputMessage += '• 4xx - Ошибки клиента (неправильный запрос)\n';
        outputMessage += '• 5xx - Ошибки сервера (проблемы на сервере)\n';
        
        displayOutput('error-output', outputMessage);
        
    } catch (error) {
        displayOutput('error-output', `Неожиданная ошибка: ${error.message}`, true);
    }
}

async function fetchWithAbort() {
    let abortController = null;
    
    try {
        displayOutput('error-output', 'Запуск запроса с возможностью отмены...');

        abortController = new AbortController();
        const signal = abortController.signal;

        const outputElement = document.getElementById('error-output');
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Отменить запрос';
        cancelButton.className = 'btn';
        cancelButton.style.marginLeft = '10px';
        cancelButton.style.backgroundColor = '#ff9800';
        
        cancelButton.onclick = () => {
            if (abortController) {
                abortController.abort();
                displayOutput('error-output', 'Запрос отменен пользователем!', true);
                cancelButton.disabled = true;
            }
        };
        
        outputElement.appendChild(cancelButton);

        const slowUrl = `${API_BASE_URL}/posts?_delay=5000`; 
        
        displayOutput('error-output', 'Запрос запущен. Нажмите "Отменить запрос" чтобы прервать...');
        
        const response = await fetch(slowUrl, {
            signal: signal,
            method: 'GET'
        });

        cancelButton.remove();
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status}`);
        }
        
        const data = await response.json();
        displayOutput('error-output', `Запрос завершен успешно! Получено постов: ${data.length}`);
        
    } catch (error) {
        if (error.name === 'AbortError') {
            displayOutput('error-output', 'Запрос был отменен через AbortController', true);
            console.log('AbortError обработан:', error.message);
        } else {
            displayOutput('error-output', `Ошибка: ${error.message}`, true);
        }
    }
}

async function fetchWithRetry(url, options = {}, retries = 3) {
    try {
        displayOutput('error-output', `Попытка запроса (осталось попыток: ${retries})...`);
        
        const response = await fetch(url, options);
        
        if (!response.ok) {

            if (response.status >= 500 && response.status < 600 && retries > 0) {
                console.log(`Серверная ошибка ${response.status}. Повтор через 1 секунду...`);

                const delay = Math.pow(2, 3 - retries) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                
                return fetchWithRetry(url, options, retries - 1);
            }
            
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response;
        
    } catch (error) {

        if (error.name === 'TypeError' && retries > 0) {
            console.log(`Сетевая ошибка. Повтор через 1 секунду...`);
            
            const delay = Math.pow(2, 3 - retries) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            
            return fetchWithRetry(url, options, retries - 1);
        }
        
        throw error;
    }
}

async function demonstrateRetry() {
    try {
        displayOutput('error-output', 'Демонстрация повторных попыток при ошибках...');

        const testUrl = 'https://httpstat.us/500'; 
        
        const response = await fetchWithRetry(testUrl, {}, 3);

        const data = await response.json();
        displayOutput('error-output', 'Запрос успешен после повторных попыток!');
        
    } catch (error) {
        let message = `Все попытки исчерпаны. Финальная ошибка: ${error.message}\n\n`;
        message += 'Логика повторных попыток:\n';
        message += '• Максимум 3 попытки\n';
        message += '• Экспоненциальная задержка: 1s, 2s, 4s\n';
        message += '• Повторяем при сетевых ошибках и серверных ошибках 5xx\n';
        message += '• Не повторяем при клиентских ошибках 4xx\n';
        
        displayOutput('error-output', message, true);
    }
}

function setupErrorHandling() {
    document.getElementById('fetch-network-error').addEventListener('click', fetchNetworkError);
    document.getElementById('fetch-http-error').addEventListener('click', fetchHttpError);
    document.getElementById('fetch-abort').addEventListener('click', fetchWithAbort);
    document.getElementById('fetch-retry').addEventListener('click', demonstrateRetry);
}

async function fetchWithPromiseAll() {
    try {
        displayOutput('parallel-output', 'Запуск параллельных запросов с Promise.all...');
        
        const startTime = performance.now();

        const promises = [
            fetch(`${API_BASE_URL}/posts/1`).then(r => r.json()),
            fetch(`${API_BASE_URL}/users/1`).then(r => r.json()),
            fetch(`${API_BASE_URL}/comments/1`).then(r => r.json()),
            fetch(`${API_BASE_URL}/albums/1`).then(r => r.json()),
            fetch(`${API_BASE_URL}/photos/1`).then(r => r.json())
        ];
        
        console.log('Запущено параллельных запросов:', promises.length);

        const results = await Promise.all(promises);
        
        const endTime = performance.now();
        const totalTime = (endTime - startTime).toFixed(2);
        
        let outputMessage = `Все запросы завершены!\n\n`;
        outputMessage += `Общее время выполнения: ${totalTime} мс\n`;
        outputMessage += `Количество запросов: ${promises.length}\n\n`;
        outputMessage += `Результаты:\n`;
        
        results.forEach((result, index) => {
            const resourceTypes = ['Пост', 'Пользователь', 'Комментарий', 'Альбом', 'Фото'];
            outputMessage += `• ${resourceTypes[index]}: ID ${result.id}\n`;
        });
        
        outputMessage += `\nПреимущества Promise.all:\n`;
        outputMessage += `• Все запросы выполняются параллельно\n`;
        outputMessage += `• Общее время ≈ времени самого долгого запроса\n`;
        outputMessage += `• Все результаты доступны одновременно\n`;
        outputMessage += `• Если один запрос失敗, все失敗 (все или ничего)`;
        
        displayOutput('parallel-output', outputMessage);

        console.log('Результаты Promise.all:', results);
        console.log(`Время выполнения: ${totalTime} мс`);
        
    } catch (error) {
        let errorMessage = `Ошибка в Promise.all: ${error.message}\n\n`;
        errorMessage += `Важно: Promise.all отклоняется при первой ошибке в любом из промисов\n`;
        errorMessage += `Это поведение "все или ничего"`;
        
        displayOutput('parallel-output', errorMessage, true);
    }
}

async function fetchWithPromiseRace() {
    try {
        displayOutput('parallel-output', 'Запуск запросов с Promise.race...');

        const fastRequest = fetch(`${API_BASE_URL}/posts/1`).then(r => r.json());
        const mediumRequest = fetch(`${API_BASE_URL}/posts?_delay=2000`).then(r => r.json()); 
        const slowRequest = fetch(`${API_BASE_URL}/posts?_delay=5000`).then(r => r.json()); 
        const requests = [fastRequest, mediumRequest, slowRequest];
        
        console.log('Запущено запросов с разной скоростью для Promise.race');

        const winner = await Promise.race(requests);
        
        let outputMessage = `Promise.race: Получен первый результат!\n\n`;
        
        if (winner.length) {

            outputMessage += `Победитель: Запрос постов с задержкой\n`;
            outputMessage += `Получено постов: ${winner.length}\n`;
            outputMessage += `Первый пост ID: ${winner[0]?.id || 'N/A'}\n`;
        } else {

            outputMessage += `Победитель: Быстрый запрос отдельного поста\n`;
            outputMessage += `ID поста: ${winner.id}\n`;
            outputMessage += `Заголовок: ${winner.title}\n`;
        }
        
        outputMessage += `\nПрактическое применение Promise.race:\n`;
        outputMessage += `• Таймаут запросов\n`;
        outputMessage += `• Получение данных из самого быстрого источника\n`;
        outputMessage += `• Соревнование между несколькими API\n`;
        outputMessage += `• Отмена медленных запросов`;
        
        displayOutput('parallel-output', outputMessage);

        await demonstrateTimeoutWithRace();
        
    } catch (error) {
        displayOutput('parallel-output', `Ошибка в Promise.race: ${error.message}`, true);
    }
}

async function demonstrateTimeoutWithRace() {
    try {
        displayOutput('parallel-output', '\n\nДемонстрация таймаута с Promise.race...');
        
        const dataPromise = fetch(`${API_BASE_URL}/posts?_delay=3000`).then(r => r.json()); 
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Таймаут: запрос занял слишком много времени')), 2000); 
        });
        
        const result = await Promise.race([dataPromise, timeoutPromise]);
        displayOutput('parallel-output', 'Данные получены до таймаута!');
        
    } catch (error) {
        if (error.message.includes('Таймаут')) {
            displayOutput('parallel-output', `${error.message}`, true);
        } else {
            throw error;
        }
    }
}

async function fetchSequentialRequests() {
    try {
        displayOutput('parallel-output', 'Запуск последовательных запросов...');
        
        const startTime = performance.now();

        const user = await fetch(`${API_BASE_URL}/users/1`).then(r => r.json());
        const userPosts = await fetch(`${API_BASE_URL}/posts?userId=${user.id}`).then(r => r.json());
        const firstPostComments = await fetch(`${API_BASE_URL}/comments?postId=${userPosts[0].id}`).then(r => r.json());
        const userAlbums = await fetch(`${API_BASE_URL}/albums?userId=${user.id}`).then(r => r.json());
        
        const endTime = performance.now();
        const totalTime = (endTime - startTime).toFixed(2);
        
        let outputMessage = `Последовательные запросы завершены!\n\n`;
        outputMessage += `Общее время выполнения: ${totalTime} мс\n`;
        outputMessage += `Количество запросов: 4\n\n`;
        outputMessage += `Результаты:\n`;
        outputMessage += `• Пользователь: ${user.name}\n`;
        outputMessage += `• Постов пользователя: ${userPosts.length}\n`;
        outputMessage += `• Комментариев к первому посту: ${firstPostComments.length}\n`;
        outputMessage += `• Альбомов пользователя: ${userAlbums.length}\n`;
        
        outputMessage += `\nСравнение с параллельным выполнением:\n`;
        outputMessage += `• Время: ~${totalTime} мс (последовательно) vs ~2000 мс (параллельно)\n`;
        outputMessage += `• Зависимости: данные каждого запроса зависят от предыдущего\n`;
        outputMessage += `• Надежность: ошибка в одном запросе останавливает цепочку\n`;
        outputMessage += `• Использование: когда данные зависят друг от друга`;
        
        displayOutput('parallel-output', outputMessage);

        await demonstrateImprovedSequential();
        
    } catch (error) {
        displayOutput('parallel-output', `Ошибка в последовательных запросах: ${error.message}`, true);
    }
}

async function demonstrateImprovedSequential() {
    try {
        displayOutput('parallel-output', '\n\nДемонстрация улучшенной последовательной обработки...');
        
        const steps = [
            { name: 'Получение пользователя', url: `${API_BASE_URL}/users/1` },
            { name: 'Получение постов', url: `${API_BASE_URL}/posts?userId=1` },
            { name: 'Получение комментариев', url: `${API_BASE_URL}/comments?postId=1` }
        ];
        
        let results = [];
        
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            console.log(`Выполнение шага ${i + 1}: ${step.name}`);
            
            const response = await fetch(step.url);
            if (!response.ok) throw new Error(`Ошибка на шаге ${i + 1}`);
            
            const data = await response.json();
            results.push({ step: step.name, data: Array.isArray(data) ? data.length : 1 });
        }
        
        let improvedMessage = `Улучшенная последовательная обработка:\n`;
        results.forEach((result, index) => {
            improvedMessage += `${index + 1}. ${result.step}: ${result.data} элементов\n`;
        });
        
        displayOutput('parallel-output', improvedMessage);
        
    } catch (error) {
        console.log('Ошибка в улучшенной последовательной обработке:', error);
    }
}

function setupParallelRequests() {
    document.getElementById('fetch-all').addEventListener('click', fetchWithPromiseAll);
    document.getElementById('fetch-race').addEventListener('click', fetchWithPromiseRace);
    document.getElementById('fetch-sequential').addEventListener('click', fetchSequentialRequests);
}

function displayOutput(elementId, data, isError = false) {
    const output = document.getElementById(elementId);
    if (!output) return;

    const timestamp = new Date().toLocaleTimeString();
    let content;

    if (typeof data === 'object' && !(data instanceof Error)) {
        content = JSON.stringify(data, null, 2);
    } else if (data instanceof Error) {
        content = `Ошибка: ${data.message}\n${data.stack}`;
    } else {
        content = String(data);
    }

    output.innerHTML = `<strong>[${timestamp}]</strong> ${content}`;
    output.className = `output ${isError ? 'error' : 'success'}`;
}

function displayData(elementId, data) {
    const container = document.getElementById(elementId);
    if (!container) return;

    if (Array.isArray(data)) {
        container.innerHTML = data.map(item => 
            `<div class="user-card">
                <h4>${item.name || item.title || 'Без названия'}</h4>
                <p>Email: ${item.email || 'Нет'}</p>
                <p>Телефон: ${item.phone || 'Нет'}</p>
                <p>${item.body || item.description || ''}</p>
            </div>`
        ).join('');
    } else if (typeof data === 'object') {
        container.innerHTML = `<div class="json-view">${JSON.stringify(data, null, 2)}</div>`;
    } else {
        container.innerHTML = `<p>${String(data)}</p>`;
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

function buildUrl(baseUrl, params = {}) {
    const url = new URL(baseUrl);
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    });
    return url.toString();
}

async function measureExecutionTime(asyncFunction) {
    const startTime = Date.now();
    const result = await asyncFunction();
    const endTime = Date.now();
    return {
        result,
        executionTime: endTime - startTime
    };
}

async function fetchUserWithPosts() {
    try {
        setLoadingState('fetch-user-posts', true);
        displayOutput('scenario-output', 'Загрузка пользователя и его постов...');
        clearDataContainer('scenario-data');

        const usersResponse = await fetch(`${API_BASE_URL}/users`);
        const users = await usersResponse.json();
        const randomUser = users[Math.floor(Math.random() * users.length)];

        const postsResponse = await fetch(`${API_BASE_URL}/posts?userId=${randomUser.id}`);
        const posts = await postsResponse.json();

        const postsWithComments = await Promise.all(
            posts.slice(0, 3).map(async post => {
                const commentsResponse = await fetch(`${API_BASE_URL}/comments?postId=${post.id}`);
                const comments = await commentsResponse.json();
                return {
                    ...post,
                    comments: comments.slice(0, 2)
                };
            })
        );

        const result = {
            user: randomUser,
            posts: postsWithComments,
            totalPosts: posts.length,
            totalComments: postsWithComments.reduce((sum, post) => sum + post.comments.length, 0)
        };
        
        displayOutput('scenario-output', `Успешно загружен пользователь "${randomUser.name}" с ${posts.length} постами`);

        const container = document.getElementById('scenario-data');
        container.innerHTML = `
            <div class="user-profile">
                <div class="profile-header">
                    <h3>👤 ${randomUser.name}</h3>
                    <p><strong>Email:</strong> ${randomUser.email}</p>
                    <p><strong>Телефон:</strong> ${randomUser.phone}</p>
                    <p><strong>Город:</strong> ${randomUser.address.city}</p>
                    <p><strong>Компания:</strong> ${randomUser.company.name}</p>
                </div>
                <div class="posts-section">
                    <h4>Последние посты (${postsWithComments.length} из ${posts.length})</h4>
                    ${postsWithComments.map(post => `
                        <div class="post-card">
                            <h5>${post.title}</h5>
                            <p>${post.body}</p>
                            <div class="comments">
                                <strong>Комментарии (${post.comments.length}):</strong>
                                ${post.comments.map(comment => `
                                    <div class="comment">
                                        <strong>${comment.name}</strong> (${comment.email}): 
                                        ${comment.body}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
    } catch (error) {
        displayOutput('scenario-output', `Ошибка: ${error.message}`, true);
    } finally {
        setLoadingState('fetch-user-posts', false);
    }
}

async function fetchWithSearch() {
    try {
        setLoadingState('fetch-search', true);
        displayOutput('scenario-output', 'Выполнение поиска постов...');
        clearDataContainer('scenario-data');

        const keywords = ['sunt', 'quia', 'aut', 'dolorem', 'magnam', 'voluptatem'];
        const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];

        const response = await fetch(`${API_BASE_URL}/posts`);
        const allPosts = await response.json();

        const searchResults = allPosts.filter(post => 
            post.title.toLowerCase().includes(randomKeyword) || 
            post.body.toLowerCase().includes(randomKeyword)
        );
        
        displayOutput('scenario-output', 
            `Поиск по ключевому слову "${randomKeyword}". Найдено ${searchResults.length} постов из ${allPosts.length}`
        );

        if (searchResults.length > 0) {
            const container = document.getElementById('scenario-data');
            container.innerHTML = `
                <div class="search-results">
                    <h4>Результаты поиска: "${randomKeyword}"</h4>
                    <div class="search-stats">
                        Найдено: ${searchResults.length} постов | 
                        Всего постов: ${allPosts.length} |
                        Соответствие: ${((searchResults.length / allPosts.length) * 100).toFixed(1)}%
                    </div>
                    ${searchResults.slice(0, 5).map(post => `
                        <div class="search-result-item">
                            <h5>${post.title}</h5>
                            <p>${post.body}</p>
                            <div class="post-meta">
                                ID: ${post.id} | User: ${post.userId} |
                                <button onclick="fetchPostDetails(${post.id})" class="btn-small">Подробнее</button>
                            </div>
                        </div>
                    `).join('')}
                    ${searchResults.length > 5 ? 
                        `<p class="search-more">... и еще ${searchResults.length - 5} постов</p>` : ''}
                </div>
            `;
        } else {
            displayData('scenario-data', 'По вашему запросу ничего не найдено');
        }
        
    } catch (error) {
        displayOutput('scenario-output', `Ошибка поиска: ${error.message}`, true);
    } finally {
        setLoadingState('fetch-search', false);
    }
}

async function fetchPostDetails(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
        const post = await response.json();
        
        const commentsResponse = await fetch(`${API_BASE_URL}/comments?postId=${postId}`);
        const comments = await commentsResponse.json();
        
        const container = document.getElementById('scenario-data');
        container.innerHTML = `
            <div class="post-details">
                <button onclick="fetchWithSearch()" class="btn-small">← Назад к результатам</button>
                <h4>${post.title}</h4>
                <p>${post.body}</p>
                <div class="comments-section">
                    <h5>Комментарии (${comments.length})</h5>
                    ${comments.map(comment => `
                        <div class="comment-detail">
                            <strong>${comment.name}</strong> (${comment.email})<br>
                            ${comment.body}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Ошибка загрузки деталей поста:', error);
    }
}

async function simulateFileUpload() {
    try {
        setLoadingState('fetch-upload', true);
        displayOutput('scenario-output', 'Симуляция загрузки файла...');
        clearDataContainer('scenario-data');

        const fileContent = `Это содержимое тестового файла.\nСоздано: ${new Date().toLocaleString()}\nРазмер: ${Math.floor(Math.random() * 1000) + 100} байт`;
        const fakeFile = new Blob([fileContent], { type: 'text/plain' });

        const formData = new FormData();
        formData.append('file', fakeFile, 'test-file.txt');
        formData.append('description', 'Тестовый файл для демонстрации загрузки');
        formData.append('timestamp', new Date().toISOString());

        const container = document.getElementById('scenario-data');
        container.innerHTML = `
            <div class="upload-container">
                <h4>Загрузка файла</h4>
                <div class="progress-bar">
                    <div class="progress-fill" id="upload-progress" style="width: 0%"></div>
                </div>
                <div id="upload-status">Подготовка к загрузке...</div>
                <div id="upload-details" class="upload-details"></div>
            </div>
        `;
        
        await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    const progressBar = document.getElementById('upload-progress');
                    const status = document.getElementById('upload-status');
                    const details = document.getElementById('upload-details');
                    
                    progressBar.style.width = percentComplete + '%';
                    status.textContent = `Загрузка: ${Math.round(percentComplete)}%`;
                    
                    details.innerHTML = `
                        <p>Загружено: ${formatBytes(event.loaded)} из ${formatBytes(event.total)}</p>
                        <p>Скорость: ${formatBytes(event.loaded / (Date.now() - startTime) * 1000)}/сек</p>
                    `;
                }
            });
            
            const startTime = Date.now();
            
            xhr.addEventListener('load', () => {
                if (xhr.status === 201) {
                    const endTime = Date.now();
                    const totalTime = (endTime - startTime) / 1000;
                    
                    document.getElementById('upload-status').textContent = 'Загрузка завершена!';
                    document.getElementById('upload-details').innerHTML += 
                        `<p>Общее время: ${totalTime.toFixed(2)} сек</p>`;
                    
                    displayOutput('scenario-output', 
                        `Файл успешно загружен за ${totalTime.toFixed(2)} секунд`
                    );
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject(new Error(`Ошибка загрузки: ${xhr.status}`));
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Ошибка сети при загрузке файла'));
            });

            xhr.open('POST', `${API_BASE_URL}/posts`);
            xhr.send(formData);
        });
        
    } catch (error) {
        displayOutput('scenario-output', `Ошибка загрузки: ${error.message}`, true);
        document.getElementById('upload-status').textContent = 'Ошибка загрузки';
    } finally {
        setLoadingState('fetch-upload', false);
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function createFetchCache() {
    const cache = new Map();
    
    return async function cachedFetch(url, options = {}) {
        const cacheKey = `${url}-${JSON.stringify(options)}`;
        const now = Date.now();
        const CACHE_TTL = 5 * 60 * 1000; 

        if (cache.has(cacheKey)) {
            const { data, timestamp } = cache.get(cacheKey);
            
            if (now - timestamp < CACHE_TTL) {
                console.log(`Используем кэш для: ${url}`);
                displayOutput('scenario-output', 
                    `Используем кэшированные данные (созданы: ${new Date(timestamp).toLocaleTimeString()})`
                );
                return data;
            } else {
                console.log(`Удаляем устаревший кэш для: ${url}`);
                cache.delete(cacheKey);
            }
        }

        console.log(`Выполняем запрос: ${url}`);
        displayOutput('scenario-output', 'Выполняем новый запрос...');
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();

        cache.set(cacheKey, {
            data,
            timestamp: now
        });
        
        console.log(`Сохраняем в кэш: ${url}`);
        displayOutput('scenario-output', 
            `Данные сохранены в кэш (истекает: ${new Date(now + CACHE_TTL).toLocaleTimeString()})`
        );
        
        return data;
    };
}

const cachedFetch = createFetchCache();


async function demonstrateCaching() {
    try {
        setLoadingState('fetch-cache', true);
        displayOutput('scenario-output', 'Демонстрация кэширования запросов...');
        clearDataContainer('scenario-data');
        
        const testUrl = `${API_BASE_URL}/posts/1`;
        let results = [];

        for (let i = 1; i <= 3; i++) {
            displayOutput('scenario-output', `Запрос ${i}...`);
            
            const startTime = Date.now();
            const data = await cachedFetch(testUrl);
            const endTime = Date.now();
            
            results.push({
                attempt: i,
                data: data,
                time: endTime - startTime,
                cached: i > 1
            });
            
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const container = document.getElementById('scenario-data');
        container.innerHTML = `
            <div class="cache-demo">
                <h4>🧪 Демонстрация кэширования</h4>
                <div class="cache-results">
                    ${results.map(result => `
                        <div class="cache-result ${result.cached ? 'cached' : 'fresh'}">
                            <strong>Запрос ${result.attempt}:</strong>
                            <span>${result.time} ms</span>
                            <span class="cache-badge">${result.cached ? 'КЭШ' : 'СЕТЬ'}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="cache-info">
                    <p><strong>TTL кэша:</strong> 5 минут</p>
                    <p><strong>Экономия времени:</strong> ~${results[0].time - results[1].time} ms на запрос</p>
                    <p><strong>Снижение нагрузки:</strong> ${Math.round((1 - 1/results.length) * 100)}% меньше запросов к серверу</p>
                </div>
            </div>
        `;
        
    } catch (error) {
        displayOutput('scenario-output', `Ошибка: ${error.message}`, true);
    } finally {
        setLoadingState('fetch-cache', false);
    }
}

function setupRealScenarios() {
    document.getElementById('fetch-user-posts').addEventListener('click', fetchUserWithPosts);
    document.getElementById('fetch-search').addEventListener('click', fetchWithSearch);
    document.getElementById('fetch-upload').addEventListener('click', simulateFileUpload);
    document.getElementById('fetch-cache').addEventListener('click', demonstrateCaching);
}

function initializeFetchAPI() {

    setupGetRequests();
    setupCrudRequests();
    setupHeadersAndParams();
    setupResponseHandling();
    setupErrorHandling();
    setupParallelRequests();
    setupRealScenarios();

    document.querySelectorAll('button').forEach(button => {
        button.setAttribute('data-original-text', button.textContent);
    });
    
    console.log('Все обработчики Fetch API инициализированы!');
}

document.addEventListener('DOMContentLoaded', initializeFetchAPI);