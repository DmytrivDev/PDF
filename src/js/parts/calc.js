import { exchangeRates } from './exchangerates.js';

const giveSelect = document.querySelector('.give-exchange select');
const receiveSelect = document.querySelector('.receive-exchange select');

const giveInput = document.querySelector('.give-exchange input');
const receiveInput = document.querySelector('.receive-exchange input');

const calcToggle = document.querySelector('.calc__toggle');
const calcAdd = document.querySelector('.calc__add');
const calcCourses = document.querySelector('.calc__courses');

let debounceTimeout;

//* Функція для дебаунсінгу (затримка) обчислень
function debounceCalculation(callback) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(callback, 300);
}

//* Парсить числове значення з поля вводу, замінюючи кому на крапку
function parseValue(input) {
  return parseFloat(input.value.replace(',', '.')) || 0;
}

//* Форматування значення введеного в інпут
function formatInputValue(input) {
  let value = input.value.replace(/[^0-9.]/g, ''); // Видаляємо всі нецифрові символи, окрім крапки

  const parts = value.split('.');
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

//* Отримання прямого або зворотного курсу для валютної пари
function getRate(from, to, regular, usdt, operation) {
  const pair = `${from}_${to}`;
  const reversePair = `${to}_${from}`;
  const isUsdt = from === 'USDT' || to === 'USDT';
  const oppositeOperation = operation === 'buy' ? 'sell' : 'buy';

  if (isUsdt) {
    const sideSame =
      usdt[to] === 'same_usd' ? to : usdt[from] === 'same_usd' ? from : null;

    if (sideSame) {
      const fromUsdPair = `USD-W_${sideSame}`; // Курс від USD-W до валюти
      const toUsdPair = `${sideSame}_USD-W`; // Курс від валюти до USD-W

      if (regular[fromUsdPair]) {
        if (pair === `USDT_${to}`) {
          return regular[fromUsdPair][operation];
        }
        if (pair === `${from}_USDT`) {
          return 1 / regular[fromUsdPair][oppositeOperation];
        }
      }

      if (regular[toUsdPair]) {
        if (pair === `USDT_${to}`) {
          return 1 / regular[toUsdPair][oppositeOperation];
        }
        if (pair === `${from}_USDT`) {
          return regular[toUsdPair][operation];
        }
      }
    }

    const sideCross =
      usdt[to] === 'cross' ? to : usdt[from] === 'cross' ? from : null;

    if (sideCross) {
      const fromUsdPair = `USD-W_${sideCross}`; // Курс від USD-W до валюти
      const toUsdPair = `${sideCross}_USD-W`; // Курс від валюти до USD-W

      if (regular[fromUsdPair]) {
        if (pair === `USDT_${to}`) {
          const percent = usdt['USD-W'][operation];
          const usdToUah = regular[fromUsdPair][operation];
          const adjustedRate = usdToUah * percent;
          return adjustedRate;
        }

        if (pair === `${from}_USDT`) {
          const percent = usdt['USD-W'][oppositeOperation];
          const usdToUah = regular[fromUsdPair][oppositeOperation];
          const adjustedRate = usdToUah * percent;
          return 1 / adjustedRate;
        }
      }

      if (regular[toUsdPair]) {
        if (pair === `USDT_${to}`) {
          const percent = usdt['USD-W'][oppositeOperation];
          const usdToUah = regular[toUsdPair][oppositeOperation];
          const adjustedRate = usdToUah / percent;
          return 1 / adjustedRate;
        }

        if (pair === `${from}_USDT`) {
          const percent = usdt['USD-W'][operation];
          const usdToUah = regular[toUsdPair][operation];
          const adjustedRate = usdToUah / percent;
          return adjustedRate;
        }
      }
    }

    if (isUsdt) {
      if (from === 'USDT' && usdt[to]) {
        return usdt[to][operation];
      }
      if (to === 'USDT' && usdt[from]) {
        return 1 / usdt[from][oppositeOperation];
      }
    }
  }

  if (regular[pair]) {
    return regular[pair][operation];
  }
  if (regular[reversePair]) {
    return 1 / regular[reversePair][oppositeOperation];
  }

  return null;
}

//* Визначає порогову суму для обраної валютної пари
function getRateTier(from, to) {
  const amountGive = parseValue(giveInput);

  if (from === 'USDT' || to === 'USDT') {
    return getRateUsdtTier(amountGive, from);
  } else {
    return getRateRegularTier(amountGive, from);
  }
}
//* Визначає tier (діапазон) для USDT на основі суми
function getRateUsdtTier(amount, from) {
  let usdAmount = amount;

  const baseTier = exchangeRates.regular[0].rates;
  const usdtBaseTier = exchangeRates.usdt[0].rates;

  if (from === 'USDT') {
    usdAmount = amount / usdtBaseTier['USD-W']?.buy;
  } else {
    const directPair = `${from}_USD-W`;
    const reversePair = `USD-W_${from}`;

    if (baseTier[directPair]) {
      usdAmount = amount * baseTier[directPair].buy;
    } else if (baseTier[reversePair]) {
      usdAmount = amount / baseTier[reversePair].sell;
    }
  }

  console.log(from, usdAmount);
  return { tierAmount: usdAmount };
}
//* Визначає tier (діапазон) для звичайних валют на основі суми
function getRateRegularTier(amount, from) {
  let usdAmount = amount;

  const baseTier = exchangeRates.regular[0].rates;

  if (from !== 'USD-W') {
    const directPair = `${from}_USD-W`;
    const reversePair = `USD-W_${from}`;

    if (baseTier[directPair]) {
      usdAmount = amount * baseTier[directPair].buy;
    } else if (baseTier[reversePair]) {
      usdAmount = amount / baseTier[reversePair].sell;
    }
  }

  console.log(from, usdAmount);
  return { tierAmount: usdAmount };
}
//* Повертає об'єкти курсів (regular і usdt) відповідно до tierAmount
function getDefinitionTier(tierAmount) {
  const regularTier =
    exchangeRates.regular.find(t => tierAmount <= t.maxAmount) ??
    exchangeRates.regular.at(-1);
  const usdtTier =
    exchangeRates.usdt.find(t => tierAmount <= t.maxAmount) ??
    exchangeRates.usdt.at(-1);

  return {
    regular: regularTier.rates,
    usdt: usdtTier.rates,
  };
}

//* Обчислення суми до отримання на основі введеної суми
function calcExchangeFromGive(giveAmount, from, to) {
  if (!from || !to) return null;

  const { tierAmount } = getRateTier(from, to);
  const { regular, usdt } = getDefinitionTier(tierAmount);
  const rate = getRate(from, to, regular, usdt, 'buy');

  console.log('tier Give regular', regular);
  console.log('tier Give usdt', usdt);
  console.log('rate Give', rate);

  if (!rate) return null;

  return giveAmount * rate;
}
//* Обчислення суми до введення на основі бажаної отриманої суми
function calcExchangeFromReceive(receiveAmount, from, to) {
  if (!from || !to) return null;

  const { tierAmount } = getRateTier(from, to);
  const { regular, usdt } = getDefinitionTier(tierAmount);
  const rate = getRate(from, to, regular, usdt, 'buy');

  console.log('tier Give regular', regular);
  console.log('tier Give usdt', usdt);
  console.log('rate Receive', rate);

  if (!rate) return null;

  return receiveAmount / rate;
}

//* Обробка введення суми у полі "віддаю"
function handleGiveInput() {
  if (!giveInput || !receiveInput) return;

  formatInputValue(giveInput);

  const amount = parseValue(giveInput);
  const from = giveSelect.value;
  const to = receiveSelect.value;

  const result = calcExchangeFromGive(amount, from, to) || 0;
  receiveInput.value = amount !== 0 && result ? result.toFixed(2) : '';

  updateExchangeRates();
}
//* Обробка введення суми у полі "отримую"
function handleReceiveInput() {
  if (!giveInput || !receiveInput) return;

  formatInputValue(receiveInput);

  const amount = parseValue(receiveInput);
  const from = giveSelect.value;
  const to = receiveSelect.value;

  const result = calcExchangeFromReceive(amount, from, to) || 0;
  giveInput.value = amount !== 0 && result ? result.toFixed(2) : '';

  updateExchangeRates();
}

//* Оновлення відображення курсів валют
function updateExchangeRates() {
  if (!giveSelect || !receiveSelect) return;

  const from = giveSelect.value;
  const to = receiveSelect.value;

  const { tierAmount } = getRateTier(from, to);
  const { regular, usdt } = getDefinitionTier(tierAmount);

  // Отримуємо курси
  const directRate = getRate(from, to, regular, usdt, 'buy') || 0;
  const inverseRate = getRate(to, from, regular, usdt, 'sell') || 0;

  // Якщо немає курсу — не показуємо блок
  if (!directRate || !inverseRate) {
    calcCourses.innerHTML = '';
    return;
  }

  // Вивід з 4 знаками
  const formattedDirect = directRate.toFixed(4);
  const formattedInverse = inverseRate.toFixed(4);

  // Замінюємо USD-W на USD
  const formatCurrency = val => (val.startsWith('USD-') ? 'USD' : val);
  const displayFrom = formatCurrency(from);
  const displayTo = formatCurrency(to);

  calcCourses.innerHTML = `
    <p>1 ${displayFrom} = ${formattedDirect} ${displayTo}</p>
    <p>1 ${displayTo} = ${formattedInverse} ${displayFrom}</p>
  `;
}

//* Обробка перемикання курсів валют між полями
function handleToggle() {
  const tempValue = giveSelect.value;
  giveSelect.tomselect.setValue(receiveSelect.value, true);
  receiveSelect.tomselect.setValue(tempValue, true);

  const tempInput = giveInput.value;
  giveInput.value = receiveInput.value;
  receiveInput.value = tempInput;

  handleGiveInput();
  updateSelectsOnChange();
}

//* Обробка даних для подальшої обробки або відправки
export function handleExchangeData() {
  calcExchangeFromGive();

  const from = giveSelect.selectedOptions[0].value.trim();
  const to = receiveSelect.selectedOptions[0].value.trim();
  const giveAmount = parseFloat(giveInput.value) || 0;
  const receiveAmount = parseFloat(receiveInput.value) || 0;

  // Визначаємо tierAmount
  const { tierAmount } = getRateTier(from, to);
  const { regular, usdt } = getDefinitionTier(tierAmount);

  // Отримуємо курси
  const directRate = getRate(from, to, regular, usdt, 'buy') || 0;
  const inverseRate = getRate(to, from, regular, usdt, 'sell') || 0;

  const formattedDirect = directRate.toFixed(4);
  const formattedInverse = inverseRate.toFixed(4);

  const formatCurrencyName = val => (val.startsWith('USD-') ? 'USD' : val);
  const displayFrom = formatCurrencyName(from);
  const displayTo = formatCurrencyName(to);

  return {
    currencyExchange: `${displayFrom} = ${giveAmount}`,
    currencyReceived: `${displayTo} = ${receiveAmount}`,
    reverseCourse: `${displayFrom} = ${formattedDirect} ${displayTo}; ${displayTo} = ${formattedInverse} ${displayFrom}`,
  };
}

//* Функція для блокування вибору валюти в селекторі
export function updateSelectsOnChange(changedSelect) {
  const giveValue = giveSelect.tomselect.getValue();
  const receiveValue = receiveSelect.tomselect.getValue();

  const validPairs = getValidPairs();

  const isValid =
    giveValue &&
    receiveValue &&
    validPairs.has(giveValue) &&
    validPairs.get(giveValue).has(receiveValue);

  if (!isValid) {
    if (changedSelect === giveSelect) {
      if (receiveValue !== '') {
        receiveSelect.tomselect.setValue('', true);
      }
    } else if (changedSelect === receiveSelect) {
      if (giveValue !== '') {
        giveSelect.tomselect.setValue('', true);
      }
    }

    giveInput.value = '';
    receiveInput.value = '';
  }

  const giveOptions =
    giveSelect.tomselect.dropdown_content.querySelectorAll('[data-value]');
  const receiveOptions =
    receiveSelect.tomselect.dropdown_content.querySelectorAll('[data-value]');

  giveOptions.forEach(option => {
    option.classList.remove('noSelect');
    if (option.dataset.value === receiveValue) {
      option.classList.add('noSelect');
    }
  });

  receiveOptions.forEach(option => {
    option.classList.remove('noSelect');
    if (option.dataset.value === giveValue) {
      option.classList.add('noSelect');
    }
  });
}
//* Створюємо реальну мапу пар на основі exchangeRates
function getValidPairs() {
  const pairs = new Map();

  const addPair = (from, to) => {
    if (!pairs.has(from)) pairs.set(from, new Set());
    pairs.get(from).add(to);
  };

  const regularTiers = Object.values(exchangeRates.regular);
  for (const tier of regularTiers) {
    const rates = tier.rates;
    for (const pairKey in rates) {
      const [from, to] = pairKey.split('_');
      addPair(from, to);
      addPair(to, from);
    }
  }

  const usdtTiers = Object.values(exchangeRates.usdt);
  for (const tier of usdtTiers) {
    const rates = tier.rates;
    for (const to in rates) {
      addPair('USDT', to);
      addPair(to, 'USDT');
    }
  }

  return pairs;
}

giveInput?.addEventListener('input', () => {
  debounceCalculation(handleGiveInput);
});
receiveInput?.addEventListener('input', () => {
  handleReceiveInput();
});

giveSelect?.addEventListener('change', () => {
  updateSelectsOnChange(giveSelect);
  debounceCalculation(handleGiveInput);
});
receiveSelect?.addEventListener('change', () => {
  updateSelectsOnChange(receiveSelect);
  debounceCalculation(handleGiveInput);
});

calcToggle?.addEventListener('click', handleToggle);
calcAdd?.addEventListener('click', handleGiveInput);

document.addEventListener('DOMContentLoaded', () => {
  debounceCalculation(handleGiveInput);
});
