
(function() {
    'use strict';

    class EventTestRunner {
        constructor() {
            this.tests = [];
            this.results = {
                passed: 0,
                failed: 0,
                total: 0
            };
            this.currentSuite = '';
            this.setupTestUI();
        }

        setupTestUI() {
            const testContainer = document.createElement('div');
            testContainer.id = 'test-results';
            testContainer.innerHTML = `
                <style>
                    #test-results {
                        margin: 20px 0;
                        padding: 20px;
                        border: 2px solid #333;
                        border-radius: 8px;
                        background: #f9f9f9;
                    }
                    .test-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #ddd;
                    }
                    .test-controls {
                        display: flex;
                        gap: 10px;
                    }
                    .test-btn {
                        padding: 8px 16px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                    }
                    .run-all { background: #4CAF50; color: white; }
                    .run-failed { background: #ff9800; color: white; }
                    .clear-results { background: #f44336; color: white; }
                    .test-summary {
                        background: white;
                        padding: 15px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                        border-left: 5px solid #2196F3;
                    }
                    .test-suite {
                        margin: 15px 0;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        overflow: hidden;
                    }
                    .suite-header {
                        background: #e3f2fd;
                        padding: 10px 15px;
                        font-weight: bold;
                        cursor: pointer;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .suite-header:hover {
                        background: #bbdefb;
                    }
                    .test-case {
                        padding: 10px 15px;
                        border-bottom: 1px solid #eee;
                        display: flex;
                        align-items: center;
                    }
                    .test-case:last-child {
                        border-bottom: none;
                    }
                    .test-status {
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        margin-right: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        color: white;
                        font-size: 12px;
                    }
                    .passed { background: #4CAF50; }
                    .failed { background: #f44336; }
                    .pending { background: #ff9800; }
                    .test-name {
                        flex-grow: 1;
                    }
                    .test-details {
                        font-size: 12px;
                        color: #666;
                        margin-left: 10px;
                    }
                    .error-message {
                        color: #d32f2f;
                        font-family: monospace;
                        margin-top: 5px;
                        padding: 5px;
                        background: #ffebee;
                        border-radius: 3px;
                    }
                    .test-duration {
                        color: #757575;
                        font-size: 12px;
                    }
                    .collapse-icon::after {
                        content: '▼';
                        font-size: 12px;
                    }
                    .collapsed .collapse-icon::after {
                        content: '▶';
                    }
                    .hidden {
                        display: none;
                    }
                </style>
                <div class="test-header">
                    <h2>Тесты обработки событий</h2>
                    <div class="test-controls">
                        <button class="test-btn run-all">Запустить все тесты</button>
                        <button class="test-btn run-failed">Запустить проваленные</button>
                        <button class="test-btn clear-results">Очистить результаты</button>
                    </div>
                </div>
                <div class="test-summary">
                    <div>Всего тестов: <span id="total-tests">0</span></div>
                    <div>Пройдено: <span id="passed-tests" style="color: #4CAF50">0</span></div>
                    <div>Провалено: <span id="failed-tests" style="color: #f44336">0</span></div>
                    <div>Время выполнения: <span id="test-duration">0ms</span></div>
                </div>
                <div id="test-suites"></div>
            `;
            
            document.body.appendChild(testContainer);
            
            document.querySelector('.run-all').addEventListener('click', () => this.runAllTests());
            document.querySelector('.run-failed').addEventListener('click', () => this.runFailedTests());
            document.querySelector('.clear-results').addEventListener('click', () => this.clearResults());
        }

        describe(suiteName, testFn) {
            this.currentSuite = suiteName;
            this.tests.push({
                suite: suiteName,
                testFn: testFn,
                tests: []
            });
        }

        it(testName, testFn) {
            const currentSuite = this.tests[this.tests.length - 1];
            currentSuite.tests.push({
                name: testName,
                fn: testFn,
                status: 'pending'
            });
        }

        async runAllTests() {
            const startTime = performance.now();
            this.results = { passed: 0, failed: 0, total: 0 };
            
            for (const suite of this.tests) {
                await this.runTestSuite(suite);
            }
            
            this.updateSummary(performance.now() - startTime);
        }

        async runFailedTests() {
            const startTime = performance.now();
            let hasFailedTests = false;
            
            for (const suite of this.tests) {
                const failedTests = suite.tests.filter(test => test.status === 'failed');
                if (failedTests.length > 0) {
                    hasFailedTests = true;
                    await this.runTestSuite(suite, true);
                }
            }
            
            if (!hasFailedTests) {
                console.log('❌ Нет проваленных тестов для перезапуска');
            }
            
            this.updateSummary(performance.now() - startTime);
        }

        async runTestSuite(suite, runOnlyFailed = false) {
            suite.tests = [];
            suite.testFn();
            
            const suiteElement = this.getOrCreateSuiteElement(suite.suite);
            
            for (const test of suite.tests) {
                if (runOnlyFailed && test.status !== 'failed') {
                    continue;
                }
                
                await this.runSingleTest(test, suiteElement);
            }
        }

        async runSingleTest(test, suiteElement) {
            const testElement = this.getOrCreateTestElement(test, suiteElement);
            const startTime = performance.now();
            
            try {
                await test.fn();
                test.status = 'passed';
                this.results.passed++;
                testElement.querySelector('.test-status').className = 'test-status passed';
                testElement.querySelector('.test-status').textContent = '✓';
                console.log(`${test.name}`);
            } catch (error) {
                test.status = 'failed';
                this.results.failed++;
                testElement.querySelector('.test-status').className = 'test-status failed';
                testElement.querySelector('.test-status').textContent = '✗';
                
                const errorElement = testElement.querySelector('.error-message') || 
                    document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = error.message;
                testElement.appendChild(errorElement);
                
                console.error(`${test.name}:`, error);
            } finally {
                this.results.total++;
                const duration = performance.now() - startTime;
                testElement.querySelector('.test-duration').textContent = `${duration.toFixed(2)}ms`;
            }
        }

        getOrCreateSuiteElement(suiteName) {
            let suiteElement = document.querySelector(`[data-suite="${suiteName}"]`);
            
            if (!suiteElement) {
                suiteElement = document.createElement('div');
                suiteElement.className = 'test-suite';
                suiteElement.setAttribute('data-suite', suiteName);
                suiteElement.innerHTML = `
                    <div class="suite-header">
                        <span>${suiteName}</span>
                        <span class="collapse-icon"></span>
                    </div>
                    <div class="suite-tests"></div>
                `;
                
                suiteElement.querySelector('.suite-header').addEventListener('click', () => {
                    suiteElement.classList.toggle('collapsed');
                    const testsContainer = suiteElement.querySelector('.suite-tests');
                    testsContainer.classList.toggle('hidden');
                });
                
                document.getElementById('test-suites').appendChild(suiteElement);
            }
            
            return suiteElement.querySelector('.suite-tests');
        }

        getOrCreateTestElement(test, suiteElement) {
            let testElement = suiteElement.querySelector(`[data-test="${test.name}"]`);
            
            if (!testElement) {
                testElement = document.createElement('div');
                testElement.className = 'test-case';
                testElement.setAttribute('data-test', test.name);
                testElement.innerHTML = `
                    <div class="test-status pending">●</div>
                    <div class="test-name">${test.name}</div>
                    <div class="test-duration">0ms</div>
                `;
                suiteElement.appendChild(testElement);
            }
            
            return testElement;
        }

        updateSummary(duration) {
            document.getElementById('total-tests').textContent = this.results.total;
            document.getElementById('passed-tests').textContent = this.results.passed;
            document.getElementById('failed-tests').textContent = this.results.failed;
            document.getElementById('test-duration').textContent = `${duration.toFixed(2)}ms`;
        }

        clearResults() {
            this.results = { passed: 0, failed: 0, total: 0 };
            document.getElementById('test-suites').innerHTML = '';
            this.updateSummary(0);
            console.clear();
            console.log('🧹 Результаты тестов очищены');
        }

        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        simulateClick(element) {
            if (element) {
                element.click();
                return true;
            }
            return false;
        }

        simulateInput(element, value) {
            if (element) {
                element.value = value;
                element.dispatchEvent(new Event('input', { bubbles: true }));
                return true;
            }
            return false;
        }

        simulateKeyPress(element, key, ctrlKey = false) {
            if (element) {
                element.dispatchEvent(new KeyboardEvent('keydown', {
                    key: key,
                    ctrlKey: ctrlKey,
                    bubbles: true
                }));
                return true;
            }
            return false;
        }
    }

    window.TestRunner = new EventTestRunner();

    TestRunner.describe('Краевые случаи', function() {
        TestRunner.it('Обработка отсутствующих элементов', function() {
            const nonExistent = document.getElementById('non-existent-element');
            TestRunner.simulateClick(nonExistent);
            TestRunner.simulateInput(nonExistent, 'test');
        });

        TestRunner.it('Множественные быстрые клики', function() {
            const button = document.getElementById('basic-btn');
            if (!button) return;
            
            for (let i = 0; i < 5; i++) {
                TestRunner.simulateClick(button);
            }
        });

        TestRunner.it('Очень длинный ввод', function() {
            const input = document.getElementById('key-input');
            if (!input) return;
            
            const longText = 'A'.repeat(1000);
            TestRunner.simulateInput(input, longText);
            
            if (input.value.length !== longText.length) {
                throw new Error('Длинный текст не был полностью принят');
            }
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        console.log('Тесты загружены. Используйте TestRunner.runAllTests() для запуска.');
        console.log('Или нажмите кнопку "Запустить все тесты" в интерфейсе тестов.');
    });

})();