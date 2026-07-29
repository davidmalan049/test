class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand + ' ' + operation;
        this.shouldResetScreen = true;
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero');
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Handle floating point precision
        computation = Math.round(computation * 1000000000) / 1000000000;
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    toggle() {
        if (this.currentOperand === '0') return;
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }

    percent() {
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandElement.textContent = this.previousOperand;
        } else {
            this.previousOperandElement.textContent = '';
        }
    }
}

// Initialize calculator
const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Button click handlers
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 100);

        if (button.classList.contains('btn-number')) {
            const value = button.getAttribute('data-value');
            calculator.appendNumber(value);
            calculator.updateDisplay();
        } else if (button.classList.contains('btn-operator')) {
            const action = button.getAttribute('data-action');
            const operations = {
                'add': '+',
                'subtract': '−',
                'multiply': '×',
                'divide': '÷'
            };
            calculator.chooseOperation(operations[action]);
            calculator.updateDisplay();
        } else if (button.classList.contains('btn-function')) {
            const action = button.getAttribute('data-action');
            
            switch (action) {
                case 'clear':
                    calculator.clear();
                    button.textContent = 'AC';
                    break;
                case 'toggle':
                    calculator.toggle();
                    break;
                case 'percent':
                    calculator.percent();
                    break;
            }
            calculator.updateDisplay();
            
            // Update AC button text based on state
            const clearButton = document.querySelector('[data-action="clear"]');
            if (calculator.currentOperand !== '0' || calculator.previousOperand !== '') {
                clearButton.textContent = 'C';
            } else {
                clearButton.textContent = 'AC';
            }
        } else if (button.classList.contains('btn-equals')) {
            calculator.compute();
            calculator.updateDisplay();
            
            // Reset AC button
            const clearButton = document.querySelector('[data-action="clear"]');
            clearButton.textContent = 'AC';
        }
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    e.preventDefault();
    
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
        calculator.appendNumber(key);
        calculator.updateDisplay();
    } else if (key === '.') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
    } else if (key === '+' || key === '-') {
        const operation = key === '+' ? 'add' : 'subtract';
        const operations = { 'add': '+', 'subtract': '−' };
        calculator.chooseOperation(operations[operation]);
        calculator.updateDisplay();
    } else if (key === '*') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
    } else if (key === '/') {
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
    } else if (key === 'Enter' || key === '=') {
        calculator.compute();
        calculator.updateDisplay();
        document.querySelector('[data-action="clear"]').textContent = 'AC';
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        calculator.clear();
        calculator.updateDisplay();
        document.querySelector('[data-action="clear"]').textContent = 'AC';
    } else if (key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (key === '%') {
        calculator.percent();
        calculator.updateDisplay();
    }
});

// Update display on load
calculator.updateDisplay();
