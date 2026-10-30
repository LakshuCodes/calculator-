const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

let currentInput = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
    display.value = currentInput;
}

function calculate() {
    const secondOperand = Number(currentInput);

    if (firstOperand === null || operator === null) {
        return;
    }

    let result;

    switch (operator) {
        case "+":
            result = firstOperand + secondOperand;
            break;

        case "−":
            result = firstOperand - secondOperand;
            break;

        case "×":
            result = firstOperand * secondOperand;
            break;

        case "÷":
            if (secondOperand === 0) {
                currentInput = "Cannot divide by zero";
                updateDisplay();
                firstOperand = null;
                operator = null;
                waitingForSecondOperand = true;
                return;
            }

            result = firstOperand / secondOperand;
            break;

        case "%":
            result = firstOperand % secondOperand;
            break;

        default:
            return;
    }

    currentInput = String(Number(result.toPrecision(12)));
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = true;

    updateDisplay();
}

buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        const value = button.textContent;

        if (value === "AC") {
            currentInput = "0";
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
            updateDisplay();
            return;
        }

        if (value === "DEL") {
            if (waitingForSecondOperand) {
                return;
            }

            currentInput = currentInput.length > 1
                ? currentInput.slice(0, -1)
                : "0";

            updateDisplay();
            return;
        }

        if (value === "=") {
            calculate();
            return;
        }

        if (["+", "−", "×", "÷", "%"].includes(value)) {
            if (currentInput === "Cannot divide by zero") {
                return;
            }

            if (operator !== null && !waitingForSecondOperand) {
                calculate();
            }

            firstOperand = Number(currentInput);
            operator = value;
            waitingForSecondOperand = true;
            return;
        }

        if (currentInput === "Cannot divide by zero") {
            currentInput = "0";
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
        }

        if (waitingForSecondOperand) {
            currentInput = value === "." ? "0." : value;
            waitingForSecondOperand = false;
        } else if (value === ".") {
            if (!currentInput.includes(".")) {
                currentInput += ".";
            }
        } else {
            currentInput = currentInput === "0"
                ? value
                : currentInput + value;
        }

        updateDisplay();
    });
});