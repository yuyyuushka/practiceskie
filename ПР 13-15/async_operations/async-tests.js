
class AsyncTests {
    constructor() {
        this.results = [];
        this.testContainer = null;
        this.setupTestContainer();
    }

    setupTestContainer() {
        this.testContainer = document.createElement('div');
        this.testContainer.id = 'test-results';
        this.testContainer.style.marginTop = '2rem';
        this.testContainer.style.padding = '1rem';
        this.testContainer.style.background = 'var(--color-bg-white)';
        this.testContainer.style.borderRadius = '8px';
        document.body.appendChild(this.testContainer);
    }

    async test(name, testFunction) {
        const testResult = {
            name,
            passed: false,
            error: null,
            duration: 0
        };

        const startTime = Date.now();

        try {
            await testFunction();
            testResult.passed = true;
            testResult.duration = Date.now() - startTime;
            console.log(`${name} (${testResult.duration}ms)`);
        } catch (error) {
            testResult.passed = false;
            testResult.error = error;
            testResult.duration = Date.now() - startTime;
            console.error(`${name}: ${error.message}`);
        }

        this.results.push(testResult);
        this.renderResults();
        return testResult.passed;
    }

    expect(value) {
        return {
            toBe: (expected) => {
                if (value !== expected) {
                    throw new Error(`Expected ${expected}, but got ${value}`);
                }
            },
            toBeGreaterThan: (min) => {
                if (value <= min) {
                    throw new Error(`Expected value greater than ${min}, but got ${value}`);
                }
            },
            toBeLessThan: (max) => {
                if (value >= max) {
                    throw new Error(`Expected value less than ${max}, but got ${value}`);
                }
            },
            toBeTruthy: () => {
                if (!value) {
                    throw new Error(`Expected truthy value, but got ${value}`);
                }
            },
            toBeFalsy: () => {
                if (value) {
                    throw new Error(`Expected falsy value, but got ${value}`);
                }
            },
            toContain: (expected) => {
                if (value && !value.includes(expected)) {
                    throw new Error(`Expected value to contain "${expected}", but got "${value}"`);
                }
            },
            toMatch: (regex) => {
                if (!regex.test(value)) {
                    throw new Error(`Expected value to match ${regex}, but got "${value}"`);
                }
            }
        };
    }

    renderResults() {
        if (!this.testContainer) return;

        const passed = this.results.filter(r => r.passed).length;
        const total = this.results.length;

        this.testContainer.innerHTML = `
            <h3>Результаты тестов: ${passed}/${total} пройдено</h3>
            ${this.results.map(result => `
                <div class="test-result ${result.passed ? '' : 'test-failure'}">
                    <strong>${result.passed ? '' : ''} ${result.name}</strong>
                    <div>Время: ${result.duration}ms</div>
                    ${result.error ? `<div>Ошибка: ${result.error.message}</div>` : ''}
                </div>
            `).join('')}
        `;
    }

    async runAllTests() {
        console.log('Запуск всех тестов...');
        this.results = [];

        await this.runPromiseTests();
        
        await this.runAsyncTests();
        
        await this.runErrorHandlingTests();
        
        await this.runUtilityTests();

        await this.runEdgeCaseTests();

        console.log(`Тесты завершены: ${this.results.filter(r => r.passed).length}/${this.results.length} пройдено`);
    }

    async runPromiseTests() {
        await this.test('createBasicPromise должен разрешаться с правильным сообщением', async () => {
            const result = await createBasicPromise(true);
            this.expect(result).toContain('Успех');
        });

        await this.test('createBasicPromise должен отклоняться с ошибкой', async () => {
            try {
                await createBasicPromise(false);
                throw new Error('Промис должен был отклониться');
            } catch (error) {
                this.expect(error).toContain('Ошибка');
            }
        });

        await this.test('Промис должен выполняться примерно 1 секунду', async () => {
            const start = Date.now();
            await createBasicPromise(true);
            const duration = Date.now() - start;
            this.expect(duration).toBeGreaterThan(900);
            this.expect(duration).toBeLessThan(1100);
        });
    }

    async runAsyncTests() {
        await this.test('basicAsyncAwait должен завершаться успешно', async () => {
            const originalElement = document.getElementById('async-output');
            
            const testElement = document.createElement('div');
            testElement.id = 'async-output';
            if (originalElement) {
                originalElement.parentNode.replaceChild(testElement, originalElement);
            } else {
                document.body.appendChild(testElement);
            }

            try {
                await basicAsyncAwait();
                
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                this.expect(testElement.textContent).toContain('Async/await результат');
            } finally {
                if (originalElement) {
                    testElement.parentNode.replaceChild(originalElement, testElement);
                } else {
                    document.body.removeChild(testElement);
                }
            }
        });

        await this.test('parallelAsyncExecution должен выполняться быстрее последовательного', async () => {
            const start = Date.now();
            
            const originalElement = document.getElementById('async-output');
            const testElement = document.createElement('div');
            testElement.id = 'async-output';
            if (originalElement) {
                originalElement.parentNode.replaceChild(testElement, originalElement);
            } else {
                document.body.appendChild(testElement);
            }

            try {
                await parallelAsyncExecution();
                const parallelTime = Date.now() - start;
                
                this.expect(parallelTime).toBeLessThan(4000);
            } finally {
                if (originalElement) {
                    testElement.parentNode.replaceChild(originalElement, testElement);
                } else {
                    document.body.removeChild(testElement);
                }
            }
        });
    }

    async runErrorHandlingTests() {
        await this.test('retryWithBackoff должен повторять попытки', async () => {
            let attempts = 0;
            const failingOperation = async () => {
                attempts++;
                if (attempts < 3) {
                    throw new Error('Временная ошибка');
                }
                return 'Успех';
            };

            const result = await retryWithBackoff(failingOperation, 3, 100);
            this.expect(result).toBe('Успех');
            this.expect(attempts).toBe(3);
        });

        await this.test('retryWithBackoff должен бросить ошибку после всех попыток', async () => {
            const alwaysFailing = async () => {
                throw new Error('Постоянная ошибка');
            };

            try {
                await retryWithBackoff(alwaysFailing, 2, 50);
                throw new Error('Должна была быть ошибка');
            } catch (error) {
                this.expect(error.message).toContain('2 попыток не удались');
            }
        });

        await this.test('Promise.allSettled должен обрабатывать смешанные результаты', async () => {
            const promises = [
                Promise.resolve('успех'),
                Promise.reject('ошибка'),
                Promise.resolve('успех2')
            ];

            const results = await Promise.allSettled(promises);
            this.expect(results.length).toBe(3);
            this.expect(results[0].status).toBe('fulfilled');
            this.expect(results[1].status).toBe('rejected');
        });
    }

    async runUtilityTests() {
        await this.test('delayWithPromise должен создавать задержку', async () => {
            const start = Date.now();
            await delayWithPromise(100);
            const duration = Date.now() - start;
            this.expect(duration).toBeGreaterThan(90);
            this.expect(duration).toBeLessThan(150);
        });

        await this.test('createRequestCache должен кэшировать результаты', async () => {
            const cachedFetch = createRequestCache();
            let callCount = 0;
            
            const originalFetch = window.fetch;
            window.fetch = async (url) => {
                callCount++;
                return {
                    ok: true,
                    json: async () => ({ data: 'test', url })
                };
            };

            try {
                await cachedFetch('test-url');
                await cachedFetch('test-url'); 
                await cachedFetch('test-url'); 

                this.expect(callCount).toBe(1); 
            } finally {
                window.fetch = originalFetch;
            }
        });

        await this.test('updateProgress должен обновлять прогресс-бар', async () => {
            const originalElement = document.getElementById('progress-fill');
            
            const testElement = document.createElement('div');
            testElement.id = 'progress-fill';
            if (originalElement) {
                originalElement.parentNode.replaceChild(testElement, originalElement);
            } else {
                document.body.appendChild(testElement);
            }

            try {
                updateProgress(75);
                
                const width = testElement.style.width;
                console.log('Progress width:', width);
                this.expect(width).toBe('75%');
            } finally {
                if (originalElement) {
                    testElement.parentNode.replaceChild(originalElement, testElement);
                } else {
                    document.body.removeChild(testElement);
                }
            }
        });

    }

    async runEdgeCaseTests() {
        await this.test('Обработка пустого массива в Promise.all', async () => {
            const results = await Promise.all([]);
            this.expect(results.length).toBe(0);
        });

        await this.test('Promise.race с немедленными промисами', async () => {
            const fast = Promise.resolve('быстрый');
            const slow = new Promise(resolve => setTimeout(() => resolve('медленный'), 100));
            
            const winner = await Promise.race([fast, slow]);
            this.expect(winner).toBe('быстрый');
        });

        await this.test('createBasicPromise с разными параметрами', async () => {
            const result1 = await createBasicPromise(true);
            this.expect(result1).toContain('Успех');

            try {
                await createBasicPromise(false);
                throw new Error('Должна была быть ошибка');
            } catch (error) {
                this.expect(error).toContain('Ошибка');
            }

            const result2 = await createBasicPromise();
            this.expect(result2).toContain('Успех');
        });
    }
}

const asyncTests = new AsyncTests();

window.runAsyncTests = () => asyncTests.runAllTests();

document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.createElement('button');
    testButton.textContent = 'Запустить тесты';
    testButton.style.background = 'linear-gradient(135deg, rgba(215, 170, 202, 0.8), rgba(215, 170, 202, 0.6))';
    testButton.style.color = 'var(--color-text-dark)';
    testButton.onclick = () => asyncTests.runAllTests();
    
    const header = document.querySelector('header');
    if (header) {
        header.appendChild(testButton);
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AsyncTests, asyncTests };
}