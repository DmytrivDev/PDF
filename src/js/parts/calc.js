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

//* Перетворює відсоткове значення у десятковий дроб
function percentCalc(perc) {
  return perc / 100;
}

//* Отримання прямого або зворотного курсу для валютної пари
function getRate(from, to, regular, usdt, operation) {
  const pair = `${from}_${to}`;
  const reversePair = `${to}_${from}`;
  const isUsdt = from === 'USDT' || to === 'USDT';

  if (isUsdt && pair === 'USDT_UAH') {
    if (usdt.UAH === 'same_usd') {
      return regular['USD-W_UAH'][operation];
    }
    if (usdt.UAH === 'cross') {
      const percent = usdt['USD-W'][operation];
      const usdToUah = regular['USD-W_UAH'][operation];
      const adjustedRate = usdToUah * (1 - percentCalc(percent));
      return adjustedRate;
    }
  }

  if (isUsdt && pair === 'UAH_USDT') {
    if (usdt.UAH === 'same_usd') {
      const usdToUah =
        regular['USD-W_UAH'][operation === 'buy' ? 'sell' : 'buy'];
      return 1 / usdToUah;
    }
    if (usdt.UAH === 'cross') {
      const percent = usdt['USD-W'][operation === 'buy' ? 'sell' : 'buy'];
      const usdToUah =
        regular['USD-W_UAH'][operation === 'buy' ? 'sell' : 'buy'];
      const adjustedRate = usdToUah / (1 - percentCalc(percent));
      return 1 / adjustedRate;
    }
  }

  if (isUsdt) {
    if (from === 'USDT' && usdt[to]) {
      return 1 / usdt[to][operation];
    }
    if (to === 'USDT' && usdt[from]) {
      return 1 / usdt[from][operation === 'buy' ? 'sell' : 'buy'];
    }
  }

  if (regular[pair]) {
    return regular[pair][operation];
  }
  if (regular[reversePair]) {
    return 1 / regular[reversePair][operation === 'buy' ? 'sell' : 'buy'];
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
  const regular = exchangeRates.regular.find(
    t => tierAmount <= t.maxAmount
  )?.rates;
  const usdt = exchangeRates.usdt.find(t => tierAmount <= t.maxAmount)?.rates;

  return { regular, usdt };
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

  // Визначаємо tierAmount
  const { tierAmount } = getRateTier(from, to);

  // Отримуємо відповідні тьєри
  const directTiers = getDefinitionTier(tierAmount);

  // Отримуємо курси
  const directRate = getRate(
    from,
    to,
    directTiers.regular,
    directTiers.usdt,
    'buy'
  );
  const inverseRate = getRate(
    to,
    from,
    directTiers.regular,
    directTiers.usdt,
    'sell'
  );

  const isUSDx = val => val.startsWith('USD-');
  const isUSDT = from === 'USDT' || to === 'USDT';

  let formattedDirect, formattedInverse;

  if (isUSDT && (isUSDx(from) || isUSDx(to))) {
    // USDT <=> USD-* (без інверсії прямого)
    formattedDirect = directRate.toFixed(4);
    formattedInverse = (1 / inverseRate).toFixed(4);
  } else if (isUSDT) {
    // USDT <=> інша валюта (наприклад, UAH): інвертуємо
    formattedDirect = directRate.toFixed(4);
    formattedInverse = inverseRate.toFixed(4);
  } else {
    // Усі інші пари валют
    formattedDirect = directRate.toFixed(4);
    formattedInverse = inverseRate.toFixed(4);
  }

  calcCourses.innerHTML = `
    <p>1 ${from} = ${formattedDirect} ${to}</p>
    <p>1 ${to} = ${formattedInverse} ${from}</p>
  `;
}

//* Обробка перемикання курсів валют між полями
function handleToggle() {
  delDisableSelect();

  const tempValue = giveSelect.value;
  giveSelect.tomselect.setValue(receiveSelect.value);
  receiveSelect.tomselect.setValue(tempValue);

  const tempInput = giveInput.value;
  giveInput.value = receiveInput.value;
  receiveInput.value = tempInput;

  handleGiveInput();
  addDisableSelect();
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

  // Отримуємо відповідні тьєри
  const directTiers = getDefinitionTier(tierAmount);

  // Отримуємо курси
  const directRate = getRate(
    from,
    to,
    directTiers.regular,
    directTiers.usdt,
    'buy'
  );
  const inverseRate = getRate(
    to,
    from,
    directTiers.regular,
    directTiers.usdt,
    'sell'
  );

  // Перевірки як у updateExchangeRates
  const isUSDx = val => val.startsWith('USD-');
  const isUSDT = from === 'USDT' || to === 'USDT';

  let formattedDirect, formattedInverse;

  if (isUSDT && (isUSDx(from) || isUSDx(to))) {
    // USDT <=> USD-*
    formattedDirect = directRate.toFixed(4);
    formattedInverse = (1 / inverseRate).toFixed(4);
  } else if (isUSDT) {
    // USDT <=> інші
    formattedDirect = directRate.toFixed(4);
    formattedInverse = inverseRate.toFixed(4);
  } else {
    formattedDirect = directRate.toFixed(4);
    formattedInverse = inverseRate.toFixed(4);
  }

  return {
    currencyExchange: `${from} = ${giveAmount}`,
    currencyReceived: `${to} = ${receiveAmount}`,
    reverseCourse: `${from} = ${formattedDirect} ${to}; ${to} = ${formattedInverse} ${from}`,
  };
}

//* Функція для блокування вибору валюти в селекторі
export function addDisableSelect() {
  const giveValue = giveSelect.tomselect.getValue();
  const receiveValue = receiveSelect.tomselect.getValue();

  const dropdownGiveSelect = giveSelect.tomselect.dropdown_content;
  const dropdownReceiveSelect = receiveSelect.tomselect.dropdown_content;

  // Очистити старі класи
  dropdownGiveSelect
    .querySelectorAll('[data-value]')
    .forEach(option => option.classList.remove('noSelect'));
  dropdownReceiveSelect
    .querySelectorAll('[data-value]')
    .forEach(option => option.classList.remove('noSelect'));

  // Створюємо реальну мапу пар на основі exchangeRates
  const getValidPairs = () => {
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
  };

  const validPairs = getValidPairs();

  // Заборонити вибір однакових валют
  if (receiveValue) {
    const el = dropdownGiveSelect.querySelector(
      `[data-value="${receiveValue}"]`
    );
    if (el) el.classList.add('noSelect');
  }
  if (giveValue) {
    const el = dropdownReceiveSelect.querySelector(
      `[data-value="${giveValue}"]`
    );
    if (el) el.classList.add('noSelect');
  }

  // Вимкнути ті опції, які не мають валідних пар
  dropdownGiveSelect.querySelectorAll('[data-value]').forEach(option => {
    const currency = option.dataset.value;
    const hasValidPairs =
      !validPairs.has(currency) ||
      (receiveValue && !validPairs.get(currency)?.has(receiveValue));

    if (hasValidPairs) {
      option.classList.add('noSelect');
    }
  });

  dropdownReceiveSelect.querySelectorAll('[data-value]').forEach(option => {
    const currency = option.dataset.value;
    const hasValidPairs =
      !validPairs.has(giveValue) ||
      (giveValue && !validPairs.get(giveValue)?.has(currency));

    if (hasValidPairs) {
      option.classList.add('noSelect');
    }
  });
}

//* Функція для видалення блокування з вибору валют
export function delDisableSelect() {
  const dropdownGiveOptions =
    giveSelect.tomselect.dropdown_content.querySelectorAll('[data-value]');
  const dropdownReceiveOptions =
    receiveSelect.tomselect.dropdown_content.querySelectorAll('[data-value]');

  dropdownGiveOptions?.forEach(option => {
    option.classList.remove('noSelect');
  });

  dropdownReceiveOptions?.forEach(option => {
    option.classList.remove('noSelect');
  });
}

giveInput?.addEventListener('input', () => {
  debounceCalculation(handleGiveInput);
});
receiveInput?.addEventListener('input', () => {
  debounceCalculation(handleReceiveInput);
});

giveSelect?.addEventListener('change', () => {
  debounceCalculation(handleGiveInput);
});
receiveSelect?.addEventListener('change', () => {
  debounceCalculation(handleGiveInput);
});

calcToggle?.addEventListener('click', handleToggle);
calcAdd?.addEventListener('click', handleGiveInput);

document.addEventListener('DOMContentLoaded', () => {
  debounceCalculation(handleGiveInput);
});
