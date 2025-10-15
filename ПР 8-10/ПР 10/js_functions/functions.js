
function sum(...numbers) {
    return numbers.reduce((total, num) => total + num, 0);
}

function createUser({ name, age, email = "не указан" }) {
    return `Пользователь: ${name}, возраст: ${age}, email: ${email}`;
}

function secretMessage(password, message) {
    return function(checkPassword) {
        return checkPassword === password ? message : "Доступ запрещен";
    };
}

function compose(...functions) {
    return function(initialValue) {
        return functions.reduceRight((value, fn) => fn(value), initialValue);
    };
}

function myMap(array, callback) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result.push(callback(array[i], i, array));
    }
    return result;
}

function myFilter(array, callback) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (callback(array[i], i, array)) {
            result.push(array[i]);
        }
    }
    return result;
}

function myReduce(array, callback, initialValue) {
    let accumulator = initialValue !== undefined ? initialValue : array[0];
    let startIndex = initialValue !== undefined ? 0 : 1;
    
    for (let i = startIndex; i < array.length; i++) {
        accumulator = callback(accumulator, array[i], i, array);
    }
    
    return accumulator;
}

function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...args2) {
                return curried.apply(this, args.concat(args2));
            };
        }
    };
}

function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

function throttle(fn, interval) {
    let lastCallTime = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCallTime >= interval) {
            lastCallTime = now;
            return fn.apply(this, args);
        }
    };
}

function createValidator(options) {
    const { minLength = 0, requireDigits = false, requireUppercase = false } = options;
    
    return function(text) {
        const errors = [];
        
        if (text.length < minLength) {
            errors.push(`Минимальная длина: ${minLength} символов`);
        }
        
        if (requireDigits && !/\d/.test(text)) {
            errors.push("Требуется хотя бы одна цифра");
        }
        
        if (requireUppercase && !/[A-ZА-Я]/.test(text)) {
            errors.push("Требуется хотя бы одна заглавная буква");
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    };
}