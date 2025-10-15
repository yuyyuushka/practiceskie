
// Функция проверки числа на простоту (сложность O(√n))
function isPrime(number) {
    if (number <= 1) return false;
    if (number <= 3) return true;
    if (number % 2 === 0 || number % 3 === 0) return false;
    
    for (let i = 5; i * i <= number; i += 6) {
        if (number % i === 0 || number % (i + 2) === 0) return false;
    }
    return true;
}

// Функция вычисления факториала (сложность O(n))
function factorial(n) {
    if (n < 0) return undefined;
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Функция генерации последовательности Фибоначчи (сложность O(n))
function fibonacci(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];
    
    const sequence = [0, 1];
    for (let i = 2; i < n; i++) {
        sequence[i] = sequence[i - 1] + sequence[i - 2];
    }
    return sequence;
}

// Функция нахождения НОД (алгоритм Евклида, сложность O(log(min(a,b))))
function gcd(a, b) {
    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }
    return Math.abs(a);
}

// Функция проверки строки на палиндром (сложность O(n))
function isPalindrome(str) {
    const cleanStr = str.toLowerCase().replace(/\s/g, '');
    let left = 0;
    let right = cleanStr.length - 1;
    
    while (left < right) {
        if (cleanStr[left] !== cleanStr[right]) return false;
        left++;
        right--;
    }
    return true;
}

// Функция подсчета гласных (сложность O(n))
function countVowels(str) {
    const vowels = 'аеёиоуыэюяaeiou';
    let count = 0;
    
    for (let char of str.toLowerCase()) {
        if (vowels.includes(char)) {
            count++;
        }
    }
    return count;
}

// Функция переворота строки (сложность O(n))
function reverseString(str) {
    let reversed = '';
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}

// Функция поиска самого длинного слова (сложность O(n))
function findLongestWord(sentence) {
    const words = sentence.split(' ');
    let longestWord = '';
    
    for (let word of words) {
        const cleanWord = word.replace(/[^a-zA-Zа-яА-Я]/g, '');
        if (cleanWord.length > longestWord.length) {
            longestWord = cleanWord;
        }
    }
    return longestWord;
}

// Функция поиска максимального элемента (сложность O(n))
function findMax(arr) {
    if (arr.length === 0) return undefined;
    
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

// Функция удаления дубликатов (сложность O(n))
function removeDuplicates(arr) {
    const unique = [];
    const seen = {};
    
    for (let item of arr) {
        if (!seen[item]) {
            seen[item] = true;
            unique.push(item);
        }
    }
    return unique;
}

// Функция пузырьковой сортировки (сложность O(n²))
function bubbleSort(arr) {
    const n = arr.length;
    let swapped;
    
    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return arr;
}

// Функция бинарного поиска (сложность O(log n))
function binarySearch(sortedArr, target) {
    let left = 0;
    let right = sortedArr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (sortedArr[mid] === target) {
            return mid;
        } else if (sortedArr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}

// Функция форматирования валюты (сложность O(1))
function formatCurrency(amount, currency = '₽') {
    return `${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${currency}`;
}

// Функция проверки email (сложность O(1))
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Функция генерации пароля (сложность O(n))
function generatePassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
}