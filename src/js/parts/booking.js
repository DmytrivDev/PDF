import { handleExchangeData } from './calc';

export function addBookingCurrency(modal) {
  if (modal.id !== 'modalBooking') return;

  const { currencyExchange, currencyReceived, reverseCourse } =
    handleExchangeData();

  const inputCurrencyExchange = modal.querySelector(
    'input[name="currencyExchange"]'
  );
  const inputCurrencyReceived = modal.querySelector(
    'input[name="currencyReceived"]'
  );
  const inputReverseCourse = modal.querySelector('input[name="reverseCourse"]');

  inputCurrencyExchange.value = currencyExchange;
  inputCurrencyReceived.value = currencyReceived;
  inputReverseCourse.value = reverseCourse;
}

export function addBookingCurrencyBtn(modal, btn) {
  if (modal.id !== 'modalBooking') return;

  const currencyExchange = btn.dataset.exchange;
  const currencyReceived = btn.dataset.received;
  const reverseCourse = btn.dataset.course;

  const inputCurrencyExchange = modal.querySelector(
    'input[name="currencyExchange"]'
  );
  const inputCurrencyReceived = modal.querySelector(
    'input[name="currencyReceived"]'
  );
  const inputReverseCourse = modal.querySelector('input[name="reverseCourse"]');

  inputCurrencyExchange.value = currencyExchange;
  inputCurrencyReceived.value = currencyReceived;
  inputReverseCourse.value = reverseCourse;
}
