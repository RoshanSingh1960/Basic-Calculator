document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const displayContainer = document.getElementById('display');
    const inputSpan = document.getElementById('display-input');
    const resultSpan = document.getElementById('display-result');
    const buttons = document.querySelectorAll('.btn');

    // Sound elements
    const memorySound = document.getElementById('sound-memory');
    const numberSound = document.getElementById('sound-number');
    const operatorSound = document.getElementById('sound-operator');
    const clearSound = document.getElementById('sound-clear');
    const equalsSound = document.getElementById('sound-equals');

    // Calculator state
    let currentInput = '';
    let lastInput = '';
    let memory = 0;

    // Update the calculator display with input and result
    function updateDisplay(input = '', result = '') {
        inputSpan.textContent = input;
        resultSpan.textContent = result;

        if (result && input) {
            displayContainer.classList.remove('result');
        } else if (result && !input) {
            displayContainer.classList.add('result');
        } else {
            displayContainer.classList.remove('result');
        }
    }

    // Check if a character is an operator
    function isOperator(char) {
        return ['+', '-', '*', '/'].includes(char);
    }

    // Evaluate the mathematical expression
    function calculate(expression) {
        try {
            if (/[^0-9+\-*/.() ]/.test(expression)) throw new Error('Error, Please Clear');
            const result = Function('"use strict";return (' + expression + ')')();
            if (!isFinite(result)) throw new Error('Error');
            return result;
        } catch (error) {
            return error.message;
        }
    }

    // Handle user input
    function handleInput(value) {
        if (value === 'Clear') {
            currentInput = '';
            updateDisplay('', '');
            return;
        }

        if (value === '=') {
            const result = calculate(currentInput);
            displayContainer.classList.add('flash');
            setTimeout(() => {
                displayContainer.classList.remove('flash');
            }, 200);
            if (typeof result === 'string') {
                updateDisplay('', result);
                currentInput = '';
                return;
            }
            updateDisplay('', result);
            currentInput = result.toString();
            return;
        }

        if (isOperator(value)) {
            if (currentInput === '' && value !== '-') return;
            if (isOperator(lastInput)) {
                currentInput = currentInput.slice(0, -1);
            }
        }

        currentInput += value;
        lastInput = value;

        const result = calculate(currentInput);
        const resultStr = typeof result === 'number' ? result : '';
        updateDisplay(currentInput, resultStr);
    }

    // Handle square root operation
    function handleSquareRoot() {
        const value = calculate(currentInput);
        if (typeof value === 'string' || value < 0) {
            updateDisplay('', 'Error');
            currentInput = '';
            return;
        }
        const result = Math.sqrt(value);
        updateDisplay('', result);
        currentInput = result.toString();
    }

    // Handle percentage operation
    function handlePercentage() {
        const value = calculate(currentInput);
        if (typeof value === 'string') {
            updateDisplay('', value);
            currentInput = '';
            return;
        }
        const result = value / 100;
        updateDisplay('', result);
        currentInput = result.toString();
    }

    // Memory functions
    function memoryPlus() {
        const value = calculate(currentInput);
        if (typeof value === 'number') {
            memory += value;
            updateDisplay('', memory);
            currentInput = memory.toString();
        }
    }

    function memoryMinus() {
        const value = calculate(currentInput);
        if (typeof value === 'number') {
            memory -= value;
            updateDisplay('', memory);
            currentInput = memory.toString();
        }
    }

    function memoryRecall() {
        updateDisplay('', memory);
        currentInput = memory.toString();
    }

    function memoryClear() {
        memory = 0;
        updateDisplay('', '');
        currentInput = '';
    }

    // Play the correct sound based on button type
    function playSound(button) {
        if (button.classList.contains('memory')) {
            memorySound.currentTime = 0;
            memorySound.play();
        } else if (button.classList.contains('operator')) {
            operatorSound.currentTime = 0;
            operatorSound.play();
        } else if (button.classList.contains('clear')) {
            clearSound.currentTime = 0;
            clearSound.play();
        } else if (button.classList.contains('equals')) {
            equalsSound.currentTime = 0;
            equalsSound.play();
        } else {
            // Default to number sound
            numberSound.currentTime = 0;
            numberSound.play();
        }
    }

    // Handle button clicks
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            playSound(button);

            const val = button.getAttribute('data-value') || button.textContent;
            switch (button.id) {
                case 'sqrt': handleSquareRoot(); break;
                case 'percent': handlePercentage(); break;
                case 'mPlus': memoryPlus(); break;
                case 'mMinus': memoryMinus(); break;
                case 'mRecall': memoryRecall(); break;
                case 'mClear': memoryClear(); break;
                default: handleInput(val); break;
            }
        });
    });

    // Keyboard input support
    document.addEventListener('keydown', (event) => {
        const allowedKeys = '0123456789+-*/.=';

        if (allowedKeys.includes(event.key)) {
            event.preventDefault();
            handleInput(event.key === '=' ? '=' : event.key);
        } else if (event.key === 'Enter') {
            event.preventDefault();
            handleInput('=');
        } else if (event.key === 'Backspace') {
            event.preventDefault();
            currentInput = currentInput.slice(0, -1);
            const result = calculate(currentInput);
            const resultStr = typeof result === 'number' ? result : '';
            updateDisplay(currentInput, resultStr);
            lastInput = currentInput.slice(-1);
        } else if (event.key.toLowerCase() === 'c') {
            event.preventDefault();
            handleInput('Clear');
        }
    });
});
