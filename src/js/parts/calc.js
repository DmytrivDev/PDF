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

//*
function parseValue(input) {
  return parseFloat(input.value.replace(',', '.')) || 0;
}

//*
function percentToCoeff(percent) {
  return 1 + percent / 100;
}

//* Форматування значення введеного в інпут
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

function getRateTier(amount, fromCurrency) {
  let usdAmount = amount;

  if (fromCurrency === 'UAH') {
    const referenceRate = exchangeRates.ranges[0].rates['USD-W']?.['UAH'];
    if (referenceRate) {
      usdAmount = amount / referenceRate.sell;
    }
  }

  return exchangeRates.ranges.find(
    range => usdAmount >= range.min && usdAmount < range.max
  );
}

function getDirectRate(from, to, tier) {
  const rate = tier.rates[from]?.[to];

  if (rate === 'mirror') {
    return tier.rates['USD-W']?.[to];
  }

  if (rate === 'cross') {
    // cross: Спочатку через USD-W
    const crossBase = tier.rates[from]?.['USD-W'];
    const usdRate = tier.rates['USD-W']?.[to];
    if (!crossBase || !usdRate) return null;
    return {
      buy: crossBase.buy * usdRate.buy,
      sell: crossBase.sell * usdRate.sell,
    };
  }

  return rate;
}

function calcExchangeFromGive(giveAmount, from, to) {
  if (!giveSelect && !receiveSelect) return;
  const tier = getRateTier(giveAmount, from);

  // USDT → UAH (через USD-W)
  if (from === 'USDT' && to === 'UAH') {
    const usdtToUsd = getDirectRate(from, 'USD-W', tier);
    const usdToUah = getDirectRate('USD-W', 'UAH', tier);

    const usdAmount = giveAmount / percentToCoeff(usdtToUsd.buy);
    return usdAmount * usdToUah.buy;
  }

  // UAH → USDT (через USD-W)
  if (from === 'UAH' && to === 'USDT') {
    const usdToUah = getDirectRate('USD-W', 'UAH', tier);
    const usdToUsdt = getDirectRate('USD-W', to, tier);

    const uahToUsd = {
      buy: 1 / usdToUah.sell,
    };

    const usdAmount = giveAmount * uahToUsd.buy;
    return usdAmount / percentToCoeff(usdToUsdt.sell);
  }

  if (from === 'USDT') {
    const inverse = getDirectRate(to, from, tier);
    return giveAmount / percentToCoeff(inverse.sell);
  }

  if (to === 'USDT') {
    const direct = getDirectRate(from, to, tier);
    return giveAmount / percentToCoeff(direct.buy);
  }

  const direct = getDirectRate(from, to, tier);
  const inverse = getDirectRate(to, from, tier);

  console.log(direct);
  console.log(inverse);

  return (giveAmount * direct.sell) / inverse.sell;
}
function calcExchangeFromReceive(receiveAmount, from, to) {
  if (!giveSelect && !receiveSelect) return;

  const tier = getRateTier(receiveAmount, to);

  // UAH ← USDT (через USD-W)
  if (from === 'USDT' && to === 'UAH') {
    const usdtToUsd = getDirectRate(from, 'USD-W', tier);
    const usdToUah = getDirectRate('USD-W', 'UAH', tier);

    const usdAmount = receiveAmount / usdToUah.buy;
    return usdAmount * percentToCoeff(usdtToUsd.buy);
  }

  // USDT ← UAH (через USD-W)
  if (from === 'UAH' && to === 'USDT') {
    const usdToUah = getDirectRate('USD-W', 'UAH', tier);
    const usdToUsdt = getDirectRate('USD-W', 'USDT', tier);

    const uahToUsd = {
      buy: 1 / usdToUah.sell,
    };

    const usdAmount = receiveAmount / percentToCoeff(usdToUsdt.sell);
    return usdAmount / uahToUsd.buy;
  }

  if (from === 'USDT') {
    const inverse = getDirectRate(to, from, tier);
    return receiveAmount * percentToCoeff(inverse.sell);
  }

  if (to === 'USDT') {
    const direct = getDirectRate(from, to, tier);
    return receiveAmount * percentToCoeff(direct.buy);
  }

  const direct = getDirectRate(from, to, tier);
  const inverse = getDirectRate(to, from, tier);

  return (receiveAmount * inverse.sell) / direct.buy;
}

//! Оновлення відображення курсів валют
function updateExchangeRates() {
  if (!giveSelect && !receiveSelect) return;

  const from = giveSelect.value;
  const to = receiveSelect.value;
  const amount = parseValue(giveInput);
  const tier = getRateTier(amount, from);

  const direct = getDirectRate(from, to, tier);
  const inverse = getDirectRate(to, from, tier);

  let directRate, inverseRate;

  if (from === 'USDT') {
    directRate = (1 / percentToCoeff(inverse.sell)).toFixed(4);
    inverseRate = percentToCoeff(inverse.sell).toFixed(4);
  } else if (to === 'USDT') {
    directRate = (1 / percentToCoeff(direct.buy)).toFixed(4);
    inverseRate = percentToCoeff(direct.buy).toFixed(4);
  } else {
    directRate = (direct.buy / inverse.sell).toFixed(4);
    inverseRate = (inverse.sell / direct.buy).toFixed(4);
  }

  calcCourses.innerHTML = `
    <p>1 ${from} = ${directRate} ${to}</p>
    <p>1 ${to} = ${inverseRate} ${from}</p>
  `;
}

//*
function handleGiveInput() {
  formatInputValue(giveInput);

  const amount = parseValue(giveInput);
  const from = giveSelect.value;
  const to = receiveSelect.value;

  const result = calcExchangeFromGive(amount, from, to);
  receiveInput.value = amount !== 0 ? result.toFixed(2) : '';

  updateExchangeRates();
}
//*
function handleReceiveInput() {
  formatInputValue(receiveInput);

  const amount = parseValue(receiveInput);
  const from = giveSelect.value;
  const to = receiveSelect.value;

  const result = calcExchangeFromReceive(amount, from, to);
  giveInput.value = amount !== 0 ? result.toFixed(2) : '';

  updateExchangeRates();
}

//! Обробка перемикання курсів валют між полями
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
//! Обробка даних для подальшої обробки або відправки
export function handleExchangeData() {
  // calcExchangeFromGive(); // Перерахунок курсу на основі поточних значень

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

//* Функція для блокування вибору валюти в селекторі
export function addDisableSelect() {
  const giveValue = giveSelect.tomselect.getValue();
  const receiveValue = receiveSelect.tomselect.getValue();

  const dropdownGiveSelect = giveSelect.tomselect.dropdown_content;
  const dropdownReceiveSelect = receiveSelect.tomselect.dropdown_content;

  const currentTier = exchangeRates.ranges[0]; // Будь-який tier — важливий лише список валют
  const availableFrom = Object.keys(currentTier.rates || {});

  // Для кожної валюти "з", які доступні
  const validToMap = {};
  availableFrom.forEach(from => {
    const targets = currentTier.rates[from];
    if (!targets) return;

    validToMap[from] = Object.keys(targets).filter(to => {
      const rate = targets[to];
      return rate && rate !== 'mirror' && rate !== 'cross';
    });
  });

  // Очищення старих класів
  dropdownGiveSelect.querySelectorAll('[data-value]').forEach(option => {
    option.classList.remove('noSelect');
  });
  dropdownReceiveSelect.querySelectorAll('[data-value]').forEach(option => {
    option.classList.remove('noSelect');
  });

  // Заборона однакових валют
  const disableInGive = dropdownGiveSelect.querySelector(
    `[data-value="${receiveValue}"]`
  );
  const disableInReceive = dropdownReceiveSelect.querySelector(
    `[data-value="${giveValue}"]`
  );
  if (disableInGive) disableInGive.classList.add('noSelect');
  if (disableInReceive) disableInReceive.classList.add('noSelect');

  // Заборона валют, які не мають парного курсу
  dropdownGiveSelect.querySelectorAll('[data-value]').forEach(option => {
    const currency = option.dataset.value;
    if (!validToMap[currency] || !validToMap[currency].includes(receiveValue)) {
      option.classList.add('noSelect');
    }
  });

  dropdownReceiveSelect.querySelectorAll('[data-value]').forEach(option => {
    const currency = option.dataset.value;
    if (!validToMap[giveValue] || !validToMap[giveValue].includes(currency)) {
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

giveInput?.addEventListener('input', handleGiveInput);
receiveInput?.addEventListener('input', handleReceiveInput);

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
