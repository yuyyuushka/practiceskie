
const TEST_BASE_URL = 'https://jsonplaceholder.typicode.com';

function runTest(testName, testFunction) {
    try {
        const result = testFunction();
        console.log(`${testName}: PASSED`, result);
        return { passed: true, result };
    } catch (error) {
        console.log(`${testName}: FAILED`, error.message);
        return { passed: false, error: error.message };
    }
}

async function runAsyncTest(testName, testFunction) {
    try {
        const result = await testFunction();
        console.log(`${testName}: PASSED`, result);
        return { passed: true, result };
    } catch (error) {
        console.log(`${testName}: FAILED`, error.message);
        return { passed: false, error: error.message };
    }
}

function createMockFetch() {
    const mockResponses = new Map();
    
    return function mockFetch(url, options = {}) {
        console.log(`🔧 Mock fetch called: ${url}`, options);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (mockResponses.has(url)) {
                    const response = mockResponses.get(url);
                    resolve({
                        ok: response.ok !== false,
                        status: response.status || 200,
                        statusText: response.statusText || 'OK',
                        json: () => Promise.resolve(response.data),
                        text: () => Promise.resolve(JSON.stringify(response.data)),
                        blob: () => Promise.resolve(new Blob([JSON.stringify(response.data)])),
                        headers: new Headers(response.headers || {})
                    });
                } else {
                    reject(new TypeError('Failed to fetch'));
                }
            }, 100);
        });
    };
}

function testBuildUrlBasic() {
    const url = buildUrl('https://api.example.com/data', {
        page: 1,
        limit: 10,
        search: 'test'
    });
    
    const expected = 'https://api.example.com/data?page=1&limit=10&search=test';
    if (url !== expected) {
        throw new Error(`Expected "${expected}", got "${url}"`);
    }
    return url;
}

function testBuildUrlWithSpecialChars() {
    const url = buildUrl('https://api.example.com/search', {
        q: 'hello world',
        filter: 'test&value'
    });
    
    if (!url.includes('hello%20world') || !url.includes('test%26value')) {
        throw new Error('URL parameters not properly encoded');
    }
    return url;
}

function testBuildUrlEmptyParams() {
    const url = buildUrl('https://api.example.com/data', {});
    if (url !== 'https://api.example.com/data') {
        throw new Error('URL with empty params should not have query string');
    }
    return url;
}

function testBuildUrlUndefinedParams() {
    const url = buildUrl('https://api.example.com/data', {
        valid: 'value',
        invalid: undefined,
        nullValue: null,
        empty: ''
    });

    if (!url.includes('valid=value') || !url.includes('empty=')) {
        throw new Error('Valid params missing from URL');
    }
    if (url.includes('invalid') || url.includes('nullValue')) {
        throw new Error('Undefined/null params should be excluded');
    }
    return url;
}

function testDisplayOutputTypes() {
    const testId = 'test-output-' + Date.now();
    const tempDiv = document.createElement('div');
    tempDiv.id = testId;
    document.body.appendChild(tempDiv);
    
    displayOutput(testId, 'Test string');
    let content = tempDiv.textContent;
    if (!content.includes('Test string')) throw new Error('String display failed');
    
    displayOutput(testId, { name: 'Test', value: 123 });
    content = tempDiv.textContent;
    if (!content.includes('"name": "Test"')) throw new Error('Object display failed');

    displayOutput(testId, new Error('Test error'), true);
    content = tempDiv.textContent;
    if (!content.includes('Test error')) throw new Error('Error display failed');
    
    document.body.removeChild(tempDiv);
    return 'All display types work correctly';
}

function testDisplayDataFormats() {
    const testId = 'test-data-' + Date.now();
    const tempDiv = document.createElement('div');
    tempDiv.id = testId;
    document.body.appendChild(tempDiv);
    
    const arrayData = [
        { name: 'User1', email: 'user1@test.com' },
        { name: 'User2', email: 'user2@test.com' }
    ];
    displayData(testId, arrayData);
    let html = tempDiv.innerHTML;
    if (!html.includes('user1@test.com') || !html.includes('User2')) {
        throw new Error('Array display failed');
    }

    const objectData = { id: 1, title: 'Test Object' };
    displayData(testId, objectData);
    html = tempDiv.innerHTML;
    if (!html.includes('Test Object') || !html.includes('"id": 1')) {
        throw new Error('Object display failed');
    }
    
    displayData(testId, 'Simple string');
    html = tempDiv.innerHTML;
    if (!html.includes('Simple string')) {
        throw new Error('String data display failed');
    }
    
    document.body.removeChild(tempDiv);
    return 'All data formats display correctly';
}

function testDisplayDataEdgeCases() {
    const testId = 'test-edge-' + Date.now();
    const tempDiv = document.createElement('div');
    tempDiv.id = testId;
    document.body.appendChild(tempDiv);
    
    displayData(testId, []);
    if (tempDiv.innerHTML === '') {
        throw new Error('Empty array should not produce empty HTML');
    }

    displayData(testId, null);
    if (!tempDiv.innerHTML.includes('null')) {
        throw new Error('Null should be displayed');
    }

    displayData(testId, undefined);
    if (!tempDiv.innerHTML.includes('undefined')) {
        throw new Error('Undefined should be displayed');
    }
    
    document.body.removeChild(tempDiv);
    return 'Edge cases handled correctly';
}

async function testFetchGetRequestWithMock() {

    const originalFetch = window.fetch;
    
    try {

        window.fetch = createMockFetch();

        const mockResponse = {
            ok: true,
            status: 200,
            data: { id: 1, title: 'Test Post', body: 'Test content', userId: 1 }
        };
        
        window.fetch = function(url) {
            if (url.includes('/posts/1')) {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve(mockResponse.data),
                    text: () => Promise.resolve(JSON.stringify(mockResponse.data))
                });
            }
            return Promise.reject(new Error('Not found'));
        };

        await fetchGetRequest();
        
        return 'Mock GET request completed';
    } finally {

        window.fetch = originalFetch;
    }
}

async function testFetchPostRequestWithMock() {
    const originalFetch = window.fetch;
    
    try {
        let capturedBody = null;
        
        window.fetch = function(url, options) {
            if (url.includes('/posts') && options.method === 'POST') {
                capturedBody = JSON.parse(options.body);
                return Promise.resolve({
                    ok: true,
                    status: 201,
                    json: () => Promise.resolve({ ...capturedBody, id: 101 })
                });
            }
            return Promise.reject(new Error('Not found'));
        };
        
        await fetchPostRequest();
        
        if (!capturedBody || !capturedBody.title) {
            throw new Error('POST request body not captured correctly');
        }
        
        return 'Mock POST request completed';
    } finally {
        window.fetch = originalFetch;
    }
}

async function testFetchWithRetryLogic() {
    let attemptCount = 0;
    const originalFetch = window.fetch;
    
    try {
        window.fetch = function() {
            attemptCount++;
            if (attemptCount < 3) {
                return Promise.reject(new TypeError('Failed to fetch'));
            }
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ success: true })
            });
        };
        
        const result = await fetchWithRetry('https://example.com/api', {}, 3);
        
        if (attemptCount !== 3) {
            throw new Error(`Expected 3 attempts, got ${attemptCount}`);
        }
        
        return 'Retry logic working correctly';
    } finally {
        window.fetch = originalFetch;
    }
}

function testCreateFetchCacheStructure() {
    const cachedFetch = createFetchCache();

    if (typeof cachedFetch !== 'function') {
        throw new Error('createFetchCache should return a function');
    }

    const result = cachedFetch('https://example.com/test');
    if (!(result instanceof Promise)) {
        throw new Error('cachedFetch should return a Promise');
    }
    
    return 'Cache structure is correct';
}

async function testRealFetchGetRequest() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
        const response = await fetch(`${TEST_BASE_URL}/posts/1`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        
        const requiredFields = ['id', 'title', 'body', 'userId'];
        for (const field of requiredFields) {
            if (!(field in data)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
        
        return {
            id: data.id,
            title: data.title,
            hasBody: !!data.body,
            userId: data.userId
        };
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            return { skipped: true, reason: 'Network timeout' };
        }
        throw error;
    }
}

async function testRealFetchWithErrorHandling() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
        const response = await fetch(`${TEST_BASE_URL}/nonexistent-endpoint-${Date.now()}`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (response.status === 404) {
            return '404 error handled correctly';
        }

        if (!response.ok) {
            return `HTTP ${response.status} error handled correctly`;
        }
        
        throw new Error('Expected error but got successful response');
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            return { skipped: true, reason: 'Network timeout' };
        }

        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            return 'Network error handled correctly';
        }
        
        throw error;
    }
}

async function testMeasureExecutionTime() {
    const { result, executionTime } = await measureExecutionTime(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'test result';
    });
    
    if (result !== 'test result') {
        throw new Error('Wrong result returned from measured function');
    }
    
    if (executionTime < 100 || executionTime > 500) {
        throw new Error(`Unexpected execution time: ${executionTime}ms`);
    }
    
    return { result, executionTime: `${executionTime}ms` };
}

function testSetLoadingState() {

    const button = document.createElement('button');
    button.id = 'test-loading-btn';
    button.textContent = 'Original Text';
    button.setAttribute('data-original-text', 'Original Text');
    document.body.appendChild(button);

    setLoadingState('test-loading-btn', true);
    
    if (!button.disabled || !button.innerHTML.includes('Загрузка')) {
        throw new Error('Loading state not set correctly');
    }

    setLoadingState('test-loading-btn', false);
    
    if (button.disabled || button.textContent !== 'Original Text') {
        throw new Error('Normal state not restored correctly');
    }
    
    document.body.removeChild(button);
    return 'Loading state works correctly';
}

async function runAllTests() {
    console.log('Starting Improved Fetch API Tests...\n');
    
    const results = {
        passed: 0,
        failed: 0,
        skipped: 0
    };

    const syncTests = [
        ['buildUrl basic', testBuildUrlBasic],
        ['buildUrl special chars', testBuildUrlWithSpecialChars],
        ['buildUrl empty params', testBuildUrlEmptyParams],
        ['buildUrl undefined params', testBuildUrlUndefinedParams],
        ['displayOutput types', testDisplayOutputTypes],
        ['displayData formats', testDisplayDataFormats],
        ['displayData edge cases', testDisplayDataEdgeCases],
        ['createFetchCache structure', testCreateFetchCacheStructure],
        ['setLoadingState', testSetLoadingState]
    ];

    const asyncMockTests = [
        ['fetch GET with mock', testFetchGetRequestWithMock],
        ['fetch POST with mock', testFetchPostRequestWithMock],
        ['fetch with retry logic', testFetchWithRetryLogic]
    ];

    const asyncNetworkTests = [
        ['real fetch GET', testRealFetchGetRequest],
        ['real fetch error handling', testRealFetchWithErrorHandling],
        ['measure execution time', testMeasureExecutionTime]
    ];
    
    console.log('Running sync tests...');
    for (const [name, test] of syncTests) {
        const result = runTest(name, test);
        if (result.passed) results.passed++; else results.failed++;
    }

    console.log('\nRunning async tests with mocks...');
    for (const [name, test] of asyncMockTests) {
        const result = await runAsyncTest(name, test);
        if (result.passed) results.passed++; else results.failed++;
    }

    console.log('\nRunning network tests...');
    for (const [name, test] of asyncNetworkTests) {
        const result = await runAsyncTest(name, test);
        if (result.passed) {
            if (result.result && result.result.skipped) {
                results.skipped++;
                console.log(`${name}: SKIPPED - ${result.result.reason}`);
            } else {
                results.passed++;
            }
        } else {
            results.failed++;
        }
    }

    console.log('\nTEST SUMMARY:');
    console.log(`PASSED: ${results.passed}`);
    console.log(`FAILED: ${results.failed}`);
    console.log(`SKIPPED: ${results.skipped}`);
    console.log(`TOTAL: ${results.passed + results.failed + results.skipped}`);
    
    displayTestResults(results);
    
    if (results.failed === 0) {
        console.log('\nAll tests passed!');
        return true;
    } else {
        console.log('\nSome tests failed. Check the logs above.');
        return false;
    }
}

function displayTestResults(results) {
    const existingResults = document.getElementById('test-results');
    if (existingResults) {
        existingResults.remove();
    }
    
    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'test-results';
    resultsDiv.className = `test-summary ${results.failed === 0 ? 'test-passed' : 'test-failed'}`;
    resultsDiv.innerHTML = `
        <h4>Test Results</h4>
        <div class="test-stats">
            <span class="test-passed">${results.passed} passed</span>
            <span class="test-failed">${results.failed} failed</span>
            <span class="test-skipped">${results.skipped} skipped</span>
        </div>
        <div class="test-status">
            ${results.failed === 0 ? 'Все тесты пройдены успешно' : 'Некоторые тесты провалены'}
        </div>
    `;
    
    const footer = document.querySelector('.main-footer');
    if (footer) {
        footer.appendChild(resultsDiv);
    }
}

document.addEventListener('DOMContentLoaded', function() {

    const testButton = document.createElement('button');
    testButton.textContent = 'Запустить тестирование';
    testButton.className = 'btn test-button';
    testButton.style.margin = '10px';
    
    testButton.addEventListener('click', async function() {
        this.disabled = true;
        this.textContent = 'Проходит тестирование...';

        const progressBar = document.createElement('div');
        progressBar.className = 'test-progress';
        progressBar.innerHTML = '<div class="test-progress-bar"></div>';
        this.parentNode.insertBefore(progressBar, this.nextSibling);
        
        try {
            await runAllTests();
        } finally {
            this.disabled = false;
            this.textContent = 'Повторно запустить тестирование';
            progressBar.remove();
        }
    });
    
    const footer = document.querySelector('.main-footer');
    if (footer) {
        const oldButton = footer.querySelector('.test-button');
        if (oldButton) oldButton.remove();
        
        footer.appendChild(testButton);
    }
});

if (typeof window !== 'undefined') {
    window.FetchAPITests = {
        runAllTests,
        runTest,
        runAsyncTest,
        createMockFetch
    };
}