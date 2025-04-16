const giveSelect = document.querySelector('.give-exchange select');
const receiveSelect = document.querySelector('.receive-exchange select');

const giveInput = document.querySelector('.give-exchange input');
const receiveInput = document.querySelector('.receive-exchange input');

const calcToggle = document.querySelector('.calc__toggle');
const calcAdd = document.querySelector('.calc__add');
const calcCoursese = document.querySelector('.calc__courses');

let debounceTimeout;

// Функція для дебаунсінгу (затримка) обчислень
function debounceCalculation(callback) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(callback, 300);
}

// Отримання значення для валюти "віддачі" з селектора
function getGive(select) {
  return parseFloat(select.selectedOptions[0].dataset.give);
}
// Отримання значення для валюти "отримання" з селектора
function getReceive(select) {
  return parseFloat(select.selectedOptions[0].dataset.receive);
}

// Обчислення курсу при введенні суми "віддачі"
function calcExchangeFromGive() {
  if (!giveSelect && !receiveSelect) return;

  const amount = parseFloat(giveInput.value) || 0;
  const result = (amount * getGive(giveSelect)) / getReceive(receiveSelect);

  receiveInput.value = amount !== 0 ? result.toFixed(2) : ''; // Виводимо результат у відповідне поле
  updateExchangeRates(); // Оновлюємо курси валют
}
// Обчислення курсу при введенні суми "отримання"
function calcExchangeFromReceive() {
  if (!giveSelect && !receiveSelect) return;

  const amount = parseFloat(receiveInput.value) || 0;
  const result = (amount * getReceive(receiveSelect)) / getGive(giveSelect);

  giveInput.value = amount !== 0 ? result.toFixed(2) : ''; // Виводимо результат у відповідне поле
  updateExchangeRates(); // Оновлюємо курси валют
}

// Форматування значення введеного в інпут
function formatInputValue(input) {
  let value = input.value.replace(/[^0-9.]/g, ''); // Видаляємо всі нецифрові символи, окрім крапки

  const parts = value.split('.'); // Розділяємо на цілу та дробову частину
  // Якщо більше двох крапок, то з'єднуємо їх
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }

  if (parts.length === 2) {
    parts[1] = parts[1].slice(0, 2);
    value = parts.join('.');
  }

  input.value = value;
}

// Оновлення відображення курсів валют
function updateExchangeRates() {
  if (!giveSelect && !receiveSelect) return;
  const giveCurrency = giveSelect.selectedOptions[0].value.trim();
  const receiveCurrency = receiveSelect.selectedOptions[0].value.trim();
  const giveRate = getGive(giveSelect);
  const receiveRate = getReceive(receiveSelect);

  const directRate = (giveRate / receiveRate).toFixed(4);
  const inverseRate = (receiveRate / giveRate).toFixed(4);

  calcCoursese.innerHTML = `
    <p>1 ${giveCurrency} = ${directRate} ${receiveCurrency}</p>
    <p>1 ${receiveCurrency} = ${inverseRate} ${giveCurrency}</p>
  `;
}

// Обробка введення суми "віддачі" (для обчислення)
function handleGiveInput() {
  formatInputValue(giveInput);
  receiveInput.removeEventListener('input', calcExchangeFromReceive);
  debounceCalculation(calcExchangeFromGive);
  receiveInput.addEventListener('input', calcExchangeFromReceive);
}
// Обробка введення суми "отримання"
function handleReceiveInput() {
  formatInputValue(receiveInput);
  giveInput.removeEventListener('input', calcExchangeFromGive);
  debounceCalculation(calcExchangeFromReceive);
  giveInput.addEventListener('input', calcExchangeFromGive);
}

// Обробка перемикання курсів валют між полями
function handleExchangeTogglea() {
  giveInput.value = receiveInput.value; // Переміщаємо значення між полями
  receiveInput.value = giveInput.value;

  const giveValue = giveSelect.tomselect.getValue(); // Отримуємо вибраний курс "віддачі"
  const receiveValue = receiveSelect.tomselect.getValue(); // Отримуємо вибраний курс "отримання"

  giveSelect.tomselect.setValue(receiveValue); // Змінюємо значення для "віддачі"
  receiveSelect.tomselect.setValue(giveValue); // Змінюємо значення для "отримання"

  calcExchangeFromGive(); // Перераховуємо курс
}
// Обробка даних для подальшої обробки або відправки
export function handleExchangeData() {
  calcExchangeFromGive(); // Перерахунок курсу на основі поточних значень

  const giveCurrency = giveSelect.selectedOptions[0].value.trim();
  const receiveCurrency = receiveSelect.selectedOptions[0].value.trim();
  const giveAmount = parseFloat(giveInput.value) || 0;
  const receiveAmount = parseFloat(receiveInput.value) || 0;
  const directRate = (getGive(giveSelect) / getReceive(receiveSelect)).toFixed(
    4
  );
  const inverseRate = (getReceive(receiveSelect) / getGive(giveSelect)).toFixed(
    4
  );

  return {
    currencyExchange: `${giveCurrency} = ${giveAmount}`,
    currencyReceived: `${receiveCurrency} = ${receiveAmount}`,
    reverseCourse: `${giveCurrency} = ${directRate} ${receiveCurrency}; ${receiveCurrency} = ${inverseRate} ${giveCurrency}`,
  };
}

// Функція для блокування вибору валюти в селекторі
export function addDisableSelect() {
  const giveValue = giveSelect.tomselect.getValue();
  const receiveValue = receiveSelect.tomselect.getValue();

  const dropdownGiveSelect =
    giveSelect.tomselect.dropdown_content.querySelector(
      `[data-value="${receiveValue}"]`
    );
  const dropdownReceiveSelect =
    receiveSelect.tomselect.dropdown_content.querySelector(
      `[data-value="${giveValue}"]`
    );

  if (dropdownGiveSelect) {
    dropdownGiveSelect.classList.add('noSelect');
  }
  if (dropdownReceiveSelect) {
    dropdownReceiveSelect.classList.add('noSelect');
  }
}
// Функція для видалення блокування з вибору валют
export function delDisableSelect() {
  const dropdownGiveSelect =
    giveSelect.tomselect.dropdown_content.querySelectorAll('.option');
  const dropdownReceiveSelect =
    receiveSelect.tomselect.dropdown_content.querySelectorAll('.option');

  if (dropdownGiveSelect) {
    dropdownGiveSelect.forEach(option => {
      option.classList.remove('noSelect');
    });
  }
  if (dropdownReceiveSelect) {
    dropdownReceiveSelect.forEach(option => {
      option.classList.remove('noSelect');
    });
  }
}

giveInput?.addEventListener('input', handleGiveInput);
receiveInput?.addEventListener('input', handleReceiveInput);

giveSelect?.addEventListener('change', () => {
  debounceCalculation(calcExchangeFromGive);
});
receiveSelect?.addEventListener('change', () => {
  debounceCalculation(calcExchangeFromGive);
});

calcToggle?.addEventListener('click', handleExchangeTogglea);
calcAdd?.addEventListener('click', handleExchangeData);

document.addEventListener('DOMContentLoaded', () => {
  debounceCalculation(calcExchangeFromGive);
});
