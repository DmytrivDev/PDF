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

// export function addDisableSelect() {
//   const giveValue = giveSelect.tomselect.getValue();
//   const receiveValue = receiveSelect.tomselect.getValue();

//   const dropdownGiveSelect = giveSelect.tomselect.dropdown_content;
//   const dropdownReceiveSelect = receiveSelect.tomselect.dropdown_content;

//   // Очистити старі класи
//   dropdownGiveSelect
//     .querySelectorAll('[data-value]')
//     .forEach(option => option.classList.remove('noSelect'));
//   dropdownReceiveSelect
//     .querySelectorAll('[data-value]')
//     .forEach(option => option.classList.remove('noSelect'));

//   // Створюємо реальну мапу пар на основі exchangeRates
//   const getValidPairs = () => {
//     const pairs = new Map();

//     const addPair = (from, to) => {
//       if (!pairs.has(from)) pairs.set(from, new Set());
//       pairs.get(from).add(to);
//     };

//     const regularTiers = Object.values(exchangeRates.regular);
//     for (const tier of regularTiers) {
//       const rates = tier.rates;
//       for (const pairKey in rates) {
//         const [from, to] = pairKey.split('_');
//         addPair(from, to);
//         addPair(to, from);
//       }
//     }

//     const usdtTiers = Object.values(exchangeRates.usdt);
//     for (const tier of usdtTiers) {
//       const rates = tier.rates;
//       for (const to in rates) {
//         addPair('USDT', to);
//         addPair(to, 'USDT');
//       }
//     }

//     return pairs;
//   };

//   const validPairs = getValidPairs();

//   // Заборонити вибір однакових валют
//   if (receiveValue) {
//     const el = dropdownGiveSelect.querySelector(
//       `[data-value="${receiveValue}"]`
//     );
//     if (el) el.classList.add('noSelect');
//   }
//   if (giveValue) {
//     const el = dropdownReceiveSelect.querySelector(
//       `[data-value="${giveValue}"]`
//     );
//     if (el) el.classList.add('noSelect');
//   }

//   // Вимкнути ті опції, які не мають валідних пар
//   dropdownGiveSelect.querySelectorAll('[data-value]').forEach(option => {
//     const currency = option.dataset.value;
//     const hasValidPairs =
//       !validPairs.has(currency) ||
//       (receiveValue && !validPairs.get(currency)?.has(receiveValue));

//     if (hasValidPairs) {
//       option.classList.add('noSelect');
//     }
//   });

//   dropdownReceiveSelect.querySelectorAll('[data-value]').forEach(option => {
//     const currency = option.dataset.value;
//     const hasValidPairs =
//       !validPairs.has(giveValue) ||
//       (giveValue && !validPairs.get(giveValue)?.has(currency));

//     if (hasValidPairs) {
//       option.classList.add('noSelect');
//     }
//   });
// }

// function getRate(from, to, regular, usdt, operation) {
//   const pair = `${from}_${to}`;
//   const reversePair = `${to}_${from}`;
//   const isUsdt = from === 'USDT' || to === 'USDT';
//   const oppositeOperation = operation === 'buy' ? 'sell' : 'buy';

//   if (isUsdt) {
//     const sideSame =
//       usdt[to] === 'same_usd' ? to : usdt[from] === 'same_usd' ? from : null;
//     const sideCross =
//       usdt[to] === 'cross' ? to : usdt[from] === 'cross' ? from : null;

//     if (sideSame) {
//       const fromUsdPair = `USD-W_${sideSame}`;
//       const toUsdPair = `${sideSame}_USD-W`;

//       if (regular[fromUsdPair]) {
//         return pair === `USDT_${to}`
//           ? regular[fromUsdPair][operation]
//           : 1 / regular[fromUsdPair][oppositeOperation];
//       }
//       if (regular[toUsdPair]) {
//         return pair === `USDT_${to}`
//           ? 1 / regular[toUsdPair][oppositeOperation]
//           : regular[toUsdPair][operation];
//       }
//     }

//     if (sideCross) {
//       const fromUsdPair = `USD-W_${sideCross}`;
//       const toUsdPair = `${sideCross}_USD-W`;

//       if (regular[fromUsdPair]) {
//         const percent = usdt['USD-W'][operation];
//         const rate = regular[fromUsdPair][operation];

//         return pair === `USDT_${to}`
//           ? rate * (1 - percentCalc(percent))
//           : 1 / (rate / (1 - percentCalc(usdt['USD-W'][oppositeOperation])));
//       }
//       if (regular[toUsdPair]) {
//         const percent = usdt['USD-W'][operation];
//         const rate = regular[toUsdPair][operation];

//         return pair === `USDT_${to}`
//           ? 1 / (rate / (1 - percentCalc(usdt['USD-W'][oppositeOperation])))
//           : rate * (1 - percentCalc(percent));
//       }
//     }

//     if (from === 'USDT' && usdt[to]) {
//       return 1 / usdt[to][operation];
//     }
//     if (to === 'USDT' && usdt[from]) {
//       return 1 / usdt[from][oppositeOperation];
//     }
//   }

//   if (regular[pair]) {
//     return regular[pair][operation];
//   }
//   if (regular[reversePair]) {
//     return 1 / regular[reversePair][oppositeOperation];
//   }

//   return null;
// }
