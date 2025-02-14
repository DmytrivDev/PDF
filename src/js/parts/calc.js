const giveSelect = document.querySelector('.give-exchange select');
const receiveSelect = document.querySelector('.receive-exchange select');

const giveInput = document.querySelector('.give-exchange input');
const receiveInput = document.querySelector('.receive-exchange input');

const calcToggle = document.querySelector('.calc__toggle');
const calcAdd = document.querySelector('.calc__add');
const calcCoursese = document.querySelector('.calc__courses');

let debounceTimeout;

function getGive(select) {
  return parseFloat(select.selectedOptions[0].dataset.give);
}
function getReceive(select) {
  return parseFloat(select.selectedOptions[0].dataset.receive);
}

function debounceCalculation(callback) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(callback, 300);
}

function calculateExchangeFromGive() {
  if (!giveSelect && !receiveSelect) return;

  const amount = parseFloat(giveInput.value) || 0;
  const result = (amount * getGive(giveSelect)) / getReceive(receiveSelect);

  receiveInput.value = amount !== 0 ? result.toFixed(2) : '';
  updateExchangeRates();
}
function calculateExchangeFromReceive() {
  if (!giveSelect && !receiveSelect) return;

  const amount = parseFloat(receiveInput.value) || 0;
  const result = (amount * getReceive(receiveSelect)) / getGive(giveSelect);

  giveInput.value = amount !== 0 ? result.toFixed(2) : '';
  updateExchangeRates();
}

function formatInputValue(input) {
  let value = input.value.replace(/[^0-9.]/g, '');

  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }

  if (parts.length === 2) {
    parts[1] = parts[1].slice(0, 2);
    value = parts.join('.');
  }

  if (parseFloat(value) > 1000000) {
    value = '1000000';
  }

  input.value = value;
}

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

function handleGiveInput() {
  formatInputValue(giveInput);
  receiveInput.removeEventListener('input', calculateExchangeFromReceive);
  debounceCalculation(calculateExchangeFromGive);
  receiveInput.addEventListener('input', calculateExchangeFromReceive);
}
function handleReceiveInput() {
  formatInputValue(receiveInput);
  giveInput.removeEventListener('input', calculateExchangeFromGive);
  debounceCalculation(calculateExchangeFromReceive);
  giveInput.addEventListener('input', calculateExchangeFromGive);
}

function handleExchangeTogglea() {
  giveInput.value = receiveInput.value;
  receiveInput.value = giveInput.value;

  const giveValue = giveSelect.tomselect.getValue();
  const receiveValue = receiveSelect.tomselect.getValue();

  giveSelect.tomselect.setValue(receiveValue);
  receiveSelect.tomselect.setValue(giveValue);

  debounceCalculation(calculateExchangeFromGive);
  updateExchangeRates();
}
function handleExchangeData() {
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

  console.log(`Валюта для обміну: ${giveCurrency}, Сума: ${giveAmount}`);
  console.log(
    `Отримана валюта: ${receiveCurrency}, Результат: ${receiveAmount}`
  );
  console.log(`Курс: 1 ${giveCurrency} = ${directRate} ${receiveCurrency}`);
  console.log(
    `Зворотній курс: 1 ${receiveCurrency} = ${inverseRate} ${giveCurrency}`
  );

  // submitExchangeData(giveCurrency, giveAmount, receiveCurrency, receiveAmount, directRate);
}

giveInput?.addEventListener('input', handleGiveInput);
receiveInput?.addEventListener('input', handleReceiveInput);

giveSelect?.addEventListener('change', () => {
  debounceCalculation(calculateExchangeFromGive);
  updateExchangeRates();
});
receiveSelect?.addEventListener('change', () => {
  debounceCalculation(calculateExchangeFromGive);
  updateExchangeRates();
});

calcToggle?.addEventListener('click', handleExchangeTogglea);
calcAdd?.addEventListener('click', handleExchangeData);

document.addEventListener('DOMContentLoaded', () => {
  updateExchangeRates();
  debounceCalculation(calculateExchangeFromGive);
});
