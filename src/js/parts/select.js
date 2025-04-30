import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.default.css';

import { updateSelectsOnChange } from './calc.js';

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
              <p>${escape(data.text.trim())}</p>
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

      updateSelectsOnChange();
    },
    onDropdownClose: function () {
      const par = container.closest('.calc__exchange').querySelector('p');
      par.style.zIndex = '5';
      this.dropdown.classList.remove('isOpen');
    },
  });

  return tomSelect;
}
