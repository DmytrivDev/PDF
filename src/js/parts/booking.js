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
