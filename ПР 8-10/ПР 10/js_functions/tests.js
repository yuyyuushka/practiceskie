document.addEventListener('DOMContentLoaded', function() {
    const testResults = document.getElementById('testResults');
    
    function addTestResult(message, isSuccess) {
        const div = document.createElement('div');
        div.className = `test-result ${isSuccess ? 'success' : 'error'}`;
        div.textContent = message;
        testResults.appendChild(div);
    }
    
    try {
        const result1 = sum(1, 2, 3, 4);
        const result2 = sum(10, -5, 7);
        
        if (result1 === 10 && result2 === 12) {
            addTestResult('✓ Функция sum работает корректно', true);
        } else {
            addTestResult('✗ Функция sum работает некорректно', false);
        }
    } catch (e) {
        addTestResult('✗ Функция sum вызвала ошибку: ' + e.message, false);
    }
    
    try {
        const user1 = createUser({ name: "Иван", age: 25 });
        const user2 = createUser({ name: "Мария", age: 30, email: "maria@example.com" });
        
        if (user1.includes("не указан") && user2.includes("maria@example.com")) {
            addTestResult('✓ Функция createUser работает корректно', true);
        } else {
            addTestResult('✗ Функция createUser работает некорректно', false);
        }
    } catch (e) {
        addTestResult('✗ Функция createUser вызвала ошибку: ' + e.message, false);
    }
    
    try {
        const secret = secretMessage("пароль123", "Секретное сообщение");
        const result1 = secret("пароль123");
        const result2 = secret("неправильный");
        
        if (result1 === "Секретное сообщение" && result2 === "Доступ запрещен") {
            addTestResult('✓ Функция secretMessage работает корректно', true);
        } else {
            addTestResult('✗ Функция secretMessage работает некорректно', false);
        }
    } catch (e) {
        addTestResult('✗ Функция secretMessage вызвала ошибку: ' + e.message, false);
    }
    
    try {
        const addTwo = x => x + 2;
        const multiplyByThree = x => x * 3;
        const subtractFive = x => x - 5;
        
        const composed = compose(subtractFive, multiplyByThree, addTwo);
        const result = composed(4); // (4 + 2) * 3 - 5 = 13
        
        if (result === 13) {
            addTestResult('✓ Функция compose работает корректно', true);
        } else {
            addTestResult('✗ Функция compose работает некорректно', false);
        }
    } catch (e) {
        addTestResult('✗ Функция compose вызвала ошибку: ' + e.message, false);
    }
    
    try {
        const array = [1, 2, 3];
        const doubled = myMap(array, x => x * 2);
        
        if (JSON.stringify(doubled) === JSON.stringify([2, 4, 6])) {
            addTestResult('✓ Функция myMap работает корректно', true);
        } else {
            addTestResult('✗ Функция myMap работает некорректно', false);
        }
    } catch (e) {
        addTestResult('✗ Функция myMap вызвала ошибку: ' + e.message, false);
    }
    
    try {
        const array = [1, 2, 3, 4, 5];
        const evens = myFilter(array, x => x % 2 === 0);
        
        if (JSON.stringify(evens) === JSON.stringify([2, 4])) {
            addTestResult('✓ Функция myFilter работает корректно', true);
        } else {
            addTestResult('✗ Функция myFilter работает некорректно', false);
        }
    } catch (e) {
        addTestResult('✗ Функция myFilter вызвала ошибку: ' + e.message, false);
    }
    
    try {
        const array = [1, 2, 3, 4];
        const sum = myReduce(array, (acc, val) => acc + val, 0);
        
        if (sum === 10) {
            addTestResult('✓ Функция myReduce работает корректно', true);
        } else {
            addTestResult('✗ Функция myReduce работает некорректно', false);
        }
    } catch (e) {
        addTestResult('✗ Функция myReduce вызвала ошибку: ' + e.message, false);
    }
    
    try {
        const multiply = (a, b, c) => a * b * c;
        const curriedMultiply = curry(multiply);
        
        const result = curriedMultiply(2)(3)(4);
        
        if (result === 24) {
            addTestResult('✓ Функция curry работает корректно', true);
        } else {
            addTestResult('✗ Функция curry работает некорректно', false);
        }
    } catch (e) {
        addTestResult('✗ Функция curry вызвала ошибку: ' + e.message, false);
    }
    
    try {
        let callCount = 0;
        const expensiveFunction = (a, b) => {
            callCount++;
            return a + b;
        };
        
        const memoized = memoize(expensiveFunction);
        
        memoized(2, 3);
        memoized(2, 3);
        memoized(2, 3);
        
        if (callCount === 1) {
            addTestResult('✓ Функция memoize работает корректно', true);
        } else {
            addTestResult('✗ Функция memoize работает некорректно', false);
        }
    } catch (e) {
        addTestResult('✗ Функция memoize вызвала ошибку: ' + e.message, false);
    }
    
    try {
        const validator = createValidator({
            minLength: 6,
            requireDigits: true,
            requireUppercase: true
        });
        
        const result1 = validator("Pass1");
        const result2 = validator("password1");
        const result3 = validator("PASSWORD");
        const result4 = validator("Pass123");
        
        if (!result1.isValid && !result2.isValid && !result3.isValid && result4.isValid) {
            addTestResult('✓ Функция createValidator работает корректно', true);
        } else {
            addTestResult('✗ Функция createValidator работает некорректно', false);
        }
    } catch (e) {
        addTestResult('✗ Функция createValidator вызвала ошибку: ' + e.message, false);
    }
});