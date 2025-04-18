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

//... Допоміжна функція для вибору порогу regular для USDT крос-курсів
function getRegularTierName(amountInUsd) {
  if (amountInUsd <= 1000) return 'below_1k';
  if (amountInUsd <= 5000) return 'between_1k_5k';
  return 'above_5k';
}

//*
function parseValue(input) {
  return parseFloat(input.value.replace(',', '.')) || 0;
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

//... Отримання прямого або зворотного курсу для валютної пари
function getRate(from, to, tier, operation, usdAmount) {
  const pair = `${from}_${to}`;
  const reversePair = `${to}_${from}`;
  const isUsdt = from === 'USDT' || to === 'USDT';

  if (isUsdt && pair === 'USDT_UAH') {
    if (tier.UAH === 'same_usd') {
      const usdUahRate =
        exchangeRates.regular[getRegularTierName(usdAmount)][`USD-W_UAH`][
          operation
        ];
      return usdUahRate;
    }
    if (tier.UAH === 'cross') {
      const usdtToUsd = tier[`USD-W`][operation];
      const usdToUah =
        exchangeRates.regular[getRegularTierName(usdAmount)][`USD-W_UAH`][
          operation
        ];
      return usdtToUsd * usdToUah;
    }
  }
  if (isUsdt && pair === 'UAH_USDT') {
    if (tier.UAH === 'same_usd') {
      const usdToUah =
        exchangeRates.regular[getRegularTierName(usdAmount)][`USD-W_UAH`][
          operation === 'buy' ? 'sell' : 'buy'
        ];
      return 1 / usdToUah;
    }
    if (tier.UAH === 'cross') {
      const usdToUah =
        exchangeRates.regular[getRegularTierName(usdAmount)][`USD-W_UAH`][
          operation === 'buy' ? 'sell' : 'buy'
        ];
      const usdToUsdt = tier[`USD-W`][operation === 'buy' ? 'sell' : 'buy'];
      return 1 / usdToUah / usdToUsdt;
    }
  }

  // if (isUsdt && (from === 'USDT' || to === 'USDT')) {
  //   // Обмін USDT <-> USD-W або USD-B
  //   const usdPair = from === 'USDT' ? `${to}` : `${from}`;
  //   if (tier[usdPair]) {
  //     const rate = tier[usdPair][operation];
  //     return from === 'USDT' ? rate : 1 / rate;
  //   }
  // }

  if (tier[pair]) {
    return tier[pair][operation];
  }

  if (tier[reversePair]) {
    return 1 / tier[reversePair][operation === 'buy' ? 'sell' : 'buy'];
  }

  return null;
}

//... Визначення порогу курсів на основі суми, конвертованої в USD-W
function getRateTier(amount, from, to) {
  if (from === 'USDT' || to === 'USDT') {
    return getRateUsdtTier(amount, from, to);
  } else {
    return getRateRegularTier(amount, from);
  }
}
function getRateUsdtTier(amount, from, to) {
  let usdAmount = amount;

  const usdtTierName =
    amount <= 1000
      ? 'below_1k'
      : amount <= 10000
      ? 'between_1k_10k'
      : amount <= 50000
      ? 'between_10k_50k'
      : 'above_50k';

  const usdtTier = exchangeRates.usdt[usdtTierName];
  const usdtToUsdRate = usdtTier['USD-W']?.sell;
  const usdToUsdtRate = usdtTier['USD-W']?.buy;

  // 🟢 Якщо обмін з USDT
  if (from === 'USDT' && usdtToUsdRate) {
    usdAmount = amount / usdtToUsdRate;
  }
  // 🔵 Якщо обмін на USDT
  else if (to === 'USDT' && usdToUsdtRate) {
    usdAmount = amount * usdToUsdtRate;
  }

  // далі підставимо tier залежно від usdAmount
  if (usdAmount <= 1000)
    return { tier: exchangeRates.usdt.below_1k, usdAmount };
  if (usdAmount <= 10000)
    return { tier: exchangeRates.usdt.between_1k_10k, usdAmount };
  if (usdAmount <= 50000)
    return { tier: exchangeRates.usdt.between_10k_50k, usdAmount };
  return { tier: exchangeRates.usdt.above_50k, usdAmount };
}
function getRateRegularTier(amount, currency) {
  let usdAmount = amount;

  // 🔶 Обробка інших валют через regular
  const directPair = `${currency}_USD-W`;
  const reversePair = `USD-W_${currency}`;
  const tier = exchangeRates.regular.below_1k;

  if (tier[directPair]) {
    usdAmount = amount * tier[directPair].buy;
  } else if (tier[reversePair]) {
    usdAmount = amount / tier[reversePair].sell;
  }

  // 🔷 Повернення regular tier
  if (usdAmount <= 1000)
    return { tier: exchangeRates.regular.below_1k, usdAmount };
  if (usdAmount <= 5000)
    return { tier: exchangeRates.regular.between_1k_5k, usdAmount };
  return { tier: exchangeRates.regular.above_5k, usdAmount };
}

//... Обчислення суми до отримання на основі введеної суми
function calcExchangeFromGive(giveAmount, from, to) {
  if (!from || !to) return null;

  const { tier, usdAmount } = getRateTier(giveAmount, from, to);

  const rate = getRate(from, to, tier, 'buy', usdAmount);

  if (!rate) return null;

  //... Для USDT -> UAH: множення на курс
  if (from === 'USDT' && to === 'UAH') {
    return giveAmount * rate;
  }
  //... Для UAH -> USDT: ділення на курс
  if (from === 'UAH' && to === 'USDT') {
    return giveAmount / rate;
  }
  //... Для USDT -> USD або USD -> USDT: ділення на курс
  if (from === 'USDT' || to === 'USDT') {
    return giveAmount / rate;
  }

  //... Для інших валют: множення на курс

  return giveAmount * rate;
}
//... Обчислення суми до введення на основі бажаної отриманої суми
function calcExchangeFromReceive(receiveAmount, from, to) {
  if (!from || !to) return null;

  const { tier, usdAmount } = getRateTier(receiveAmount, to, from);

  const rate = getRate(from, to, tier, 'buy', usdAmount);

  if (!rate) return null;

  //... Для USDT -> UAH: ділення на курс
  if (from === 'USDT' && to === 'UAH') {
    return receiveAmount / rate;
  }
  //... Для UAH -> USDT: множення на курс
  if (from === 'UAH' && to === 'USDT') {
    return receiveAmount * rate;
  }
  //... Для USDT -> USD або USD -> USDT: множення на курс
  if (from === 'USDT' || to === 'USDT') {
    return receiveAmount * rate;
  }

  //... Для інших валют: ділення на курс

  return receiveAmount / rate;
}

//*... Обробка введення суми у полі "віддаю"
function handleGiveInput() {
  formatInputValue(giveInput);

  const amount = parseValue(giveInput);
  const from = giveSelect.value;
  const to = receiveSelect.value;

  const result = calcExchangeFromGive(amount, from, to);
  receiveInput.value = amount !== 0 && result ? result.toFixed(2) : '';

  updateExchangeRates();
}
//*... Обробка введення суми у полі "отримую"
function handleReceiveInput() {
  formatInputValue(receiveInput);

  const amount = parseValue(receiveInput);
  const from = giveSelect.value;
  const to = receiveSelect.value;

  const result = calcExchangeFromReceive(amount, from, to);
  giveInput.value = amount !== 0 && result ? result.toFixed(2) : '';

  updateExchangeRates();
}

//* Оновлення відображення курсів валют
function updateExchangeRates() {
  if (!giveSelect || !receiveSelect) return;

  const from = giveSelect.value;
  const to = receiveSelect.value;
  const amount = parseValue(giveInput);

  // ⬅️ Tier для прямого курсу
  const { tier: directTier, usdAmount: usdAmountBuy } = getRateTier(
    amount,
    from,
    to
  );
  const directRate = getRate(from, to, directTier, 'buy', usdAmountBuy);

  // ➡️ Tier для зворотного курсу
  const { tier: reverseTier, usdAmount: usdAmountSell } = getRateTier(
    amount,
    to,
    from
  );
  const inverseRate = getRate(to, from, reverseTier, 'sell', usdAmountSell);

  let formattedDirect, formattedInverse;

  if (from === 'USDT' || to === 'USDT') {
    // 🔄 USDT: показуємо інверсно, бо база – USD
    formattedDirect = (1 / directRate).toFixed(4);
    formattedInverse = (1 / inverseRate).toFixed(4);
  } else {
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

//? Функція для блокування вибору валюти в селекторі
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

  // 👉 Створюємо реальну мапу пар на основі exchangeRates
  const getValidPairs = () => {
    const pairs = new Map();

    const addPair = (from, to) => {
      if (!pairs.has(from)) pairs.set(from, new Set());
      pairs.get(from).add(to);
    };

    const tiers = [
      exchangeRates.regular.below_1k,
      exchangeRates.regular.between_1k_5k,
      exchangeRates.regular.above_5k,
    ];

    for (const tier of tiers) {
      for (const pairKey in tier) {
        const [from, to] = pairKey.split('_');
        addPair(from, to);
        addPair(to, from); // для зворотного напрямку
      }
    }

    const usdtTiers = Object.values(exchangeRates.usdt);
    for (const tier of usdtTiers) {
      for (const to in tier) {
        addPair('USDT', to);
        addPair(to, 'USDT');
      }
    }

    return pairs;
  };

  const validPairs = getValidPairs();

  // ⚠️ Заборонити вибір однакових валют
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

  // ❌ Вимкнути ті опції, які не мають валідних пар
  dropdownGiveSelect.querySelectorAll('[data-value]').forEach(option => {
    const currency = option.dataset.value;
    if (
      !validPairs.has(currency) ||
      (receiveValue && !validPairs.get(currency)?.has(receiveValue))
    ) {
      option.classList.add('noSelect');
    }
  });

  dropdownReceiveSelect.querySelectorAll('[data-value]').forEach(option => {
    const currency = option.dataset.value;
    if (
      !validPairs.has(giveValue) ||
      (giveValue && !validPairs.get(giveValue)?.has(currency))
    ) {
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
