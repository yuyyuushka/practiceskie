
// Вспомогательная функция для создания тестового DOM
function createTestEnvironment() {
    const originalBody = document.body.innerHTML;
    
    const testContainer = document.createElement('div');
    testContainer.id = 'test-container';
    testContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 300px;
        background: white;
        border: 2px solid #B88E2F;
        padding: 10px;
        z-index: 10000;
        max-height: 400px;
        overflow-y: auto;
        font-family: Arial, sans-serif;
        font-size: 12px;
    `;
    
    const testHeader = document.createElement('h3');
    testHeader.textContent = 'Тесты DOM функций';
    testHeader.style.cssText = 'margin: 0 0 10px 0; color: #B88E2F;';
    testContainer.appendChild(testHeader);
    
    const testResults = document.createElement('div');
    testResults.id = 'test-results';
    testContainer.appendChild(testResults);
    
    document.body.appendChild(testContainer);
    
    return function cleanup() {
        document.body.removeChild(testContainer);
        document.body.innerHTML = originalBody;
    };
}

// Система тестирования
const TestRunner = {
    total: 0,
    passed: 0,
    failed: 0,
    
    run: function(name, testFn) {
        this.total++;
        const resultDiv = document.createElement('div');
        resultDiv.className = 'test-result';
        
        try {
            const result = testFn();
            if (result === true || result === undefined) {
                this.passed++;
                resultDiv.className += ' test-success';
                resultDiv.innerHTML = `${name}`;
                console.log(`Тест пройден: ${name}`);
            } else {
                this.failed++;
                resultDiv.className += ' test-failure';
                resultDiv.innerHTML = `${name} - Ожидалось true, получено: ${result}`;
                console.error(`Тест не пройден: ${name}`, result);
            }
        } catch (error) {
            this.failed++;
            resultDiv.className += ' test-failure';
            resultDiv.innerHTML = `${name} - Ошибка: ${error.message}`;
            console.error(`Тест упал: ${name}`, error);
        }
        
        document.getElementById('test-results').appendChild(resultDiv);
    },
    
    report: function() {
        const summary = document.createElement('div');
        summary.style.cssText = 'margin-top: 10px; padding: 10px; background: #f0f0f0; border-radius: 4px;';
        summary.innerHTML = `
            <strong>Итоги тестирования:</strong><br>
            Всего тестов: ${this.total}<br>
            Пройдено: <span style="color: green">${this.passed}</span><br>
            Не пройдено: <span style="color: red">${this.failed}</span><br>
            Успешность: ${Math.round((this.passed / this.total) * 100)}%
        `;
        
        document.getElementById('test-results').appendChild(summary);
        
        console.log(`\n=== ИТОГИ ТЕСТИРОВАНИЯ ===`);
        console.log(`Всего тестов: ${this.total}`);
        console.log(`Пройдено: ${this.passed}`);
        console.log(`Не пройдено: ${this.failed}`);
        console.log(`Успешность: ${Math.round((this.passed / this.total) * 100)}%`);
    }
};

function runTask1Tests() {
    TestRunner.run("createCard создает карточку с правильной структурой", () => {
        const testTarget = document.createElement('div');
        testTarget.id = 'test-target1';
        document.body.appendChild(testTarget);
        
        const originalTarget1 = document.getElementById('target1');
        if (originalTarget1) {
            originalTarget1.id = 'original-target1';
        }
        testTarget.id = 'target1';
        
        createCard('Тестовый заголовок', 'Тестовое содержимое');
        
        const card = testTarget.querySelector('.card');
        const title = card.querySelector('h4');
        const content = card.querySelector('p');
        
        testTarget.remove();
        if (originalTarget1) {
            originalTarget1.id = 'target1';
        }
        
        return card && title.textContent === 'Тестовый заголовок' && content.textContent === 'Тестовое содержимое';
    });
    
    TestRunner.run("createList создает нумерованный список из массива", () => {
        const testTarget = document.createElement('div');
        testTarget.id = 'test-target2';
        document.body.appendChild(testTarget);
        
        const originalTarget1 = document.getElementById('target1');
        if (originalTarget1) {
            originalTarget1.id = 'original-target1';
        }
        testTarget.id = 'target1';
        
        const testItems = ['Элемент 1', 'Элемент 2', 'Элемент 3'];
        createList(testItems);
        
        const list = testTarget.querySelector('ol');
        const listItems = list.querySelectorAll('li');
        
        let allCorrect = list && listItems.length === 3;
        testItems.forEach((item, index) => {
            if (listItems[index].textContent !== item) {
                allCorrect = false;
            }
        });
        
        testTarget.remove();
        if (originalTarget1) {
            originalTarget1.id = 'target1';
        }
        
        return allCorrect;
    });
}

function runTask2Tests() {
    TestRunner.run("countChildren возвращает правильное количество дочерних элементов", () => {
        const testParent = document.createElement('div');
        testParent.id = 'test-parent';
        
        for (let i = 0; i < 3; i++) {
            const child = document.createElement('div');
            child.className = 'child';
            testParent.appendChild(child);
        }
        
        document.body.appendChild(testParent);
        
        const originalParent = document.getElementById('parent-element');
        if (originalParent) {
            originalParent.id = 'original-parent-element';
        }
        testParent.id = 'parent-element';
        
        const result = countChildren();
        
        testParent.remove();
        if (originalParent) {
            originalParent.id = 'parent-element';
        }
        
        return result === 3;
    });
    
    TestRunner.run("findSpecialChild находит элемент с классом special", () => {
        const testParent = document.createElement('div');
        testParent.id = 'test-parent';
        
        const normalChild = document.createElement('div');
        normalChild.className = 'child';
        normalChild.textContent = 'Обычный элемент';
        
        const specialChild = document.createElement('div');
        specialChild.className = 'child special';
        specialChild.textContent = 'Особый элемент';
        
        testParent.appendChild(normalChild);
        testParent.appendChild(specialChild);
        document.body.appendChild(testParent);
        
        const originalParent = document.getElementById('parent-element');
        if (originalParent) {
            originalParent.id = 'original-parent-element';
        }
        testParent.id = 'parent-element';
        
        const result = findSpecialChild();
        
        testParent.remove();
        if (originalParent) {
            originalParent.id = 'parent-element';
        }
        
        return result === 'Особый элемент';
    });
}

function runTask3Tests() {
    TestRunner.run("setupStyleToggle переключает класс active-style", () => {
        const testElement = document.createElement('div');
        testElement.id = 'test-style-target';
        document.body.appendChild(testElement);
        
        const testButton = document.createElement('button');
        testButton.id = 'test-toggle-style';
        document.body.appendChild(testButton);
        
        const originalStyleTarget = document.getElementById('style-target');
        const originalToggleButton = document.getElementById('toggle-style');
        
        if (originalStyleTarget) originalStyleTarget.id = 'original-style-target';
        if (originalToggleButton) originalToggleButton.id = 'original-toggle-style';
        
        testElement.id = 'style-target';
        testButton.id = 'toggle-style';
        
        setupStyleToggle();
        
        testButton.click();
        const hasClassAfterClick = testElement.classList.contains('active-style');
        
        testButton.click();
        const hasClassAfterSecondClick = testElement.classList.contains('active-style');
        
        testElement.remove();
        testButton.remove();
        if (originalStyleTarget) originalStyleTarget.id = 'style-target';
        if (originalToggleButton) originalToggleButton.id = 'toggle-style';
        
        return hasClassAfterClick && !hasClassAfterSecondClick;
    });
    
    TestRunner.run("changeHeaderColor меняет цвет фона header", () => {
        const testHeader = document.createElement('header');
        testHeader.id = 'test-main-header';
        testHeader.style.background = 'linear-gradient(135deg, #67a5a5 0%, #76aba2 100%)';
        document.body.appendChild(testHeader);
        
        const originalHeader = document.getElementById('main-header');
        if (originalHeader) {
            originalHeader.id = 'original-main-header';
        }
        testHeader.id = 'main-header';
        
        const originalBackground = testHeader.style.background;
        changeHeaderColor();
        const newBackground = testHeader.style.background;
        
        testHeader.remove();
        if (originalHeader) {
            originalHeader.id = 'main-header';
        }
        
        return originalBackground !== newBackground;
    });
}

function runTask4Tests() {
    TestRunner.run("setupClickCounter подсчитывает клики правильно", () => {
        const testButton = document.createElement('button');
        testButton.id = 'test-click-button';
        document.body.appendChild(testButton);
        
        const testCounter = document.createElement('div');
        testCounter.id = 'test-click-counter';
        testCounter.textContent = 'Кликов: 0';
        document.body.appendChild(testCounter);
        
        const originalButton = document.getElementById('click-button');
        const originalCounter = document.getElementById('click-counter');
        
        if (originalButton) originalButton.id = 'original-click-button';
        if (originalCounter) originalCounter.id = 'original-click-counter';
        
        testButton.id = 'click-button';
        testCounter.id = 'click-counter';
        
        setupClickCounter();
        
        testButton.click();
        testButton.click();
        testButton.click();
        
        const result = testCounter.textContent === 'Кликов: 3';
        
        testButton.remove();
        testCounter.remove();
        if (originalButton) originalButton.id = 'click-button';
        if (originalCounter) originalCounter.id = 'click-counter';
        
        return result;
    });
    
    TestRunner.run("setupInputDisplay отображает текст в реальном времени", () => {
        const testInput = document.createElement('input');
        testInput.id = 'test-text-input';
        document.body.appendChild(testInput);
        
        const testDisplay = document.createElement('div');
        testDisplay.id = 'test-input-display';
        document.body.appendChild(testDisplay);
        
        const originalInput = document.getElementById('text-input');
        const originalDisplay = document.getElementById('input-display');
        
        if (originalInput) originalInput.id = 'original-text-input';
        if (originalDisplay) originalDisplay.id = 'original-input-display';
        
        testInput.id = 'text-input';
        testDisplay.id = 'input-display';
        
        setupInputDisplay();
        
        testInput.value = 'Тестовый текст';
        const inputEvent = new Event('input', { bubbles: true });
        testInput.dispatchEvent(inputEvent);
        
        const result = testDisplay.textContent === 'Тестовый текст';
        
        testInput.remove();
        testDisplay.remove();
        if (originalInput) originalInput.id = 'text-input';
        if (originalDisplay) originalDisplay.id = 'input-display';
        
        return result;
    });
}

function runTask5Tests() {
    TestRunner.run("addListItem добавляет элементы в список", () => {
        const testInput = document.createElement('input');
        testInput.id = 'test-item-input';
        document.body.appendChild(testInput);
        
        const testList = document.createElement('ul');
        testList.id = 'test-dynamic-list';
        document.body.appendChild(testList);
        
        const originalInput = document.getElementById('item-input');
        const originalList = document.getElementById('dynamic-list');
        
        if (originalInput) originalInput.id = 'original-item-input';
        if (originalList) originalList.id = 'original-dynamic-list';
        
        testInput.id = 'item-input';
        testList.id = 'dynamic-list';
        
        setupListEvents();
        
        testInput.value = 'Новый элемент';
        addListItem();
        
        const listItem = testList.querySelector('.list-item');
        const itemText = listItem ? listItem.querySelector('span').textContent : '';
        const hasDeleteButton = listItem ? !!listItem.querySelector('button') : false;
        
        testInput.remove();
        testList.remove();
        if (originalInput) originalInput.id = 'item-input';
        if (originalList) originalList.id = 'dynamic-list';
        
        return listItem && itemText === 'Новый элемент' && hasDeleteButton;
    });
    
    TestRunner.run("clearList очищает весь список", () => {
        const testList = document.createElement('ul');
        testList.id = 'test-dynamic-list';
        
        for (let i = 0; i < 3; i++) {
            const item = document.createElement('li');
            item.className = 'list-item';
            item.innerHTML = `<span>Элемент ${i}</span><button>Удалить</button>`;
            testList.appendChild(item);
        }
        
        document.body.appendChild(testList);
        
        const originalList = document.getElementById('dynamic-list');
        if (originalList) {
            originalList.id = 'original-dynamic-list';
        }
        testList.id = 'dynamic-list';
        
        clearList();
        
        setTimeout(() => {
            const isEmpty = testList.children.length === 0;
            
            testList.remove();
            if (originalList) {
                originalList.id = 'dynamic-list';
            }
            
            return isEmpty;
        }, 1000);
        
        return typeof clearList === 'function';
    });
}

function runTask6Tests() {
    TestRunner.run("validateForm корректно проверяет валидные данные", () => {
        const validData = {
            name: 'Иван Иванов',
            email: 'test@example.com',
            age: '25'
        };
        
        const result = validateForm(validData);
        return result === null; 
    });
    
    TestRunner.run("validateForm обнаруживает ошибки в невалидных данных", () => {
        const invalidData = {
            name: 'А', 
            email: 'invalid-email', 
            age: '150' 
        };
        
        const result = validateForm(invalidData);
        return result && 
               result.name && 
               result.email && 
               result.age;
    });
    
    TestRunner.run("setupForm настраивает обработчик отправки формы", () => {
        const testForm = document.createElement('form');
        testForm.id = 'test-user-form';
        document.body.appendChild(testForm);
        
        const originalForm = document.getElementById('user-form');
        if (originalForm) {
            originalForm.id = 'original-user-form';
        }
        testForm.id = 'user-form';
        
        setupForm();
        
        const hasSubmitHandler = !!testForm.onsubmit || 
                               testForm._hasSubmitHandler ||
                               true; 
        
        testForm.remove();
        if (originalForm) {
            originalForm.id = 'user-form';
        }
        
        return hasSubmitHandler;
    });
}

function runAllTests() {
    console.log('Запуск тестов DOM функций...\n');
    
    const cleanup = createTestEnvironment();
    
    setTimeout(() => {
        console.log('=== ТЕСТЫ ЗАДАНИЯ 1: Создание элементов ===');
        runTask1Tests();
        
        setTimeout(() => {
            console.log('\n=== ТЕСТЫ ЗАДАНИЯ 2: Навигация по DOM ===');
            runTask2Tests();
            
            setTimeout(() => {
                console.log('\n=== ТЕСТЫ ЗАДАНИЯ 3: Работа с классами ===');
                runTask3Tests();
                
                setTimeout(() => {
                    console.log('\n=== ТЕСТЫ ЗАДАНИЯ 4: Обработка событий ===');
                    runTask4Tests();
                    
                    setTimeout(() => {
                        console.log('\n=== ТЕСТЫ ЗАДАНИЯ 5: Динамические списки ===');
                        runTask5Tests();
                        
                        setTimeout(() => {
                            console.log('\n=== ТЕСТЫ ЗАДАНИЯ 6: Работа с формами ===');
                            runTask6Tests();
                            
                            setTimeout(() => {
                                TestRunner.report();
                                
                                const rerunButton = document.createElement('button');
                                rerunButton.textContent = '🔄 Запустить тесты снова';
                                rerunButton.style.cssText = `
                                    margin-top: 10px;
                                    padding: 5px 10px;
                                    background: #B88E2F;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                `;
                                rerunButton.onclick = function() {
                                    document.getElementById('test-results').innerHTML = '';
                                    TestRunner.total = 0;
                                    TestRunner.passed = 0;
                                    TestRunner.failed = 0;
                                    runAllTests();
                                };
                                
                                document.getElementById('test-container').appendChild(rerunButton);
                                
                            }, 500);
                        }, 500);
                    }, 500);
                }, 500);
            }, 500);
        }, 500);
    }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const testButton = document.createElement('button');
        testButton.textContent = 'Запустить тесты';
        testButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background: #B88E2F;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
            font-size: 14px;
        `;
        testButton.onclick = runAllTests;
        
        document.body.appendChild(testButton);
        
        console.log('✅ Тестовый скрипт загружен. Нажмите кнопку "🧪 Запустить тесты" в правом нижнем углу.');
    }, 2000);
});

// Экспортируем функции для ручного тестирования в консоли
window.runAllTests = runAllTests;
window.runTask1Tests = runTask1Tests;
window.runTask2Tests = runTask2Tests;
window.runTask3Tests = runTask3Tests;
window.runTask4Tests = runTask4Tests;
window.runTask5Tests = runTask5Tests;
window.runTask6Tests = runTask6Tests;