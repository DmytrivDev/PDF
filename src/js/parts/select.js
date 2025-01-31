import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.default.css';

const tomSelect = document.querySelectorAll('.tom-select');

tomSelect?.forEach(select => {
  const options = Array.from(select.options);

  const sortedOptions = options.sort((a, b) => {
    if (a.text === select.options[0].text) return -1;
    if (b.text === select.options[0].text) return 1;
    return a.text.localeCompare(b.text);
  });

  select.innerHTML = '';

  sortedOptions.forEach(option => {
    select.appendChild(option);
  });

  new TomSelect(select, {
    create: false,
    controlInput: false,
    allowEmptyOption: true,
    searchField: [],
    render: {
      item: function (data, escape) {
        return `<div>${select.dataset.txt} ${escape(data.text)}</div>`;
      },
    },
    onDropdownOpen: function () {
      this.dropdown.classList.add('isOpen');
    },
    onDropdownClose: function () {
      this.dropdown.classList.remove('isOpen');
    },
  });
});

// <select class="tom-select" data-txt="All:">
//   <option value="">All</option>
//   <option value="1">Nikola</option>
//   <option value="2">Nikola Tesla</option>
//   <option value="3">Thomas Edison</option>
// </select>
