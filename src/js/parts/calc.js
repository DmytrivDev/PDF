// const giveExchang = document.querySelector('.give-exchang');
// const receiveExchang = document.querySelector('.receive-exchang');

// const giveSelect = giveExchang?.querySelector('select');
// const receiveSelect = receiveExchang?.querySelector('select');

// const giveInput = giveExchang?.querySelector('input');
// const receiveInput = receiveExchang?.querySelector('input');

// const calcToggle = document.querySelector('.calc__toggle');

// function initCalcExchange() {
//   function calcExchange() {
//     const giveRate = parseFloat(giveSelect.selectedOptions[0].dataset.rate);

//     const receiveRate = parseFloat(
//       receiveSelect.selectedOptions[0].dataset.rate
//     );

//     const amount = parseFloat(giveInput.value) || 0;

//     if (amount > 0) {
//       const result = (amount * giveRate) / receiveRate;
//       receiveInput.value = result.toFixed(2);
//     } else {
//       receiveInput.value = '';
//     }
//   }

//   toggleButton.addEventListener('click', () => {
//     giveInput.value = receiveInput.value;

//     const giveValue = giveSelect.tomselect.getValue();
//     const receiveValue = receiveSelect.tomselect.getValue();

//     giveSelect.tomselect.setValue(receiveValue);
//     receiveSelect.tomselect.setValue(giveValue);

//     calcExchange();
//   });

//   calcExchange();
// }

// document.addEventListener('DOMContentLoaded', initCalcExchange);
