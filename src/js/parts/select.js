import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.default.css';

const selectCalc = document.querySelectorAll('.calc__exchange select');

selectCalc?.forEach(select => {
  initTomSelect(select);
});

function initTomSelect(container) {
  const tomSelect = new TomSelect(container, {
    create: false,
    controlInput: false,
    allowEmptyOption: true,
    searchField: [],
    render: {
      item: function (data, escape) {
        const option = container.querySelector(`option[value="${data.value}"]`);
        const flagSrc = option?.dataset.flag;

        return flagSrc
          ? `<div>
              <span>
                <img src="${escape(flagSrc)}" alt="${escape(data.text.trim())}">
              </span>
              ${escape(data.text.trim())}
            </div>`
          : `<div>${escape(data.text.trim())}</div>`;
      },
      option: function (data, escape) {
        const option = container.querySelector(`option[value="${data.value}"]`);
        const fullname = option?.dataset.fullname || '';

        return `
        <div>
          <p>${escape(data.text.trim())}</p>
          <span>${escape(fullname)}</span>
        </div>
      `;
      },
    },

    onDropdownOpen: function () {
      const par = container.closest('.calc__exchange').querySelector('p');
      par.style.zIndex = '15';
      this.dropdown.classList.add('isOpen');
    },
    onDropdownClose: function () {
      const par = container.closest('.calc__exchange').querySelector('p');
      par.style.zIndex = '5';
      this.dropdown.classList.remove('isOpen');
    },
  });

  return tomSelect;
}

document.addEventListener('DOMContentLoaded', () => {
  const giveInput = document.querySelector('[name="input-give"]');
  const receiveInput = document.querySelector('[name="input-receive"]');
  const giveSelect = document.querySelector('.give-exchange select');
  const receiveSelect = document.querySelector('.receive-exchange select');
  const toggleButton = document.querySelector('.calc__toggle');

  // ================================
  function getGive(select) {
    return parseFloat(select.selectedOptions[0].dataset.give);
  }
  function getReceive(select) {
    return parseFloat(select.selectedOptions[0].dataset.receive);
  }

  let referral = true;

  // ================================
  function calculateExchange() {
    const amount = parseFloat(giveInput.value) || 0;
    if (amount === 0) return (receiveInput.value = '');

    let result;

    if (referral) {
      result = (amount * getGive(giveSelect)) / getGive(receiveSelect);
    } else {
      result = (amount * getReceive(giveSelect)) / getReceive(receiveSelect);
    }

    receiveInput.value = result.toFixed(2);
  }

  // ================================
  giveInput.addEventListener('input', calculateExchange);
  receiveInput.addEventListener('input', calculateExchange);

  giveSelect.addEventListener('change', () => {
    referral = true;
    calculateExchange();
  });
  receiveSelect.addEventListener('change', () => {
    referral = true;
    calculateExchange();
  });

  // ================================
  toggleButton.addEventListener('click', () => {
    giveInput.value = receiveInput.value;

    const giveValue = giveSelect.tomselect.getValue();
    const receiveValue = receiveSelect.tomselect.getValue();

    giveSelect.tomselect.setValue(receiveValue);
    receiveSelect.tomselect.setValue(giveValue);

    referral = !referral;
    calculateExchange();
  });

  calculateExchange();
});
