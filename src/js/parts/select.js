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

  // ================================
  function calculateExchange() {
    const amount = parseFloat(giveInput.value) || 0;
    const result = (amount * getGive(giveSelect)) / getReceive(receiveSelect);

    if (amount !== 0) {
      receiveInput.value = result.toFixed(2);
    } else {
      receiveInput.value = '';
    }
  }

  // ================================
  giveInput.addEventListener('input', calculateExchange);

  giveSelect.addEventListener('change', calculateExchange);
  receiveSelect.addEventListener('change', calculateExchange);

  // ================================
  toggleButton.addEventListener('click', () => {
    giveInput.value = receiveInput.value;

    const giveValue = giveSelect.tomselect.getValue();
    const receiveValue = receiveSelect.tomselect.getValue();

    giveSelect.tomselect.setValue(receiveValue);
    receiveSelect.tomselect.setValue(giveValue);

    calculateExchange();
  });

  calculateExchange();
});
