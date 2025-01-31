// import axios from 'axios';

import IMask from 'imask';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';

const forms = document.querySelectorAll('.submitForm');

forms?.forEach(form => {
  form.addEventListener('submit', submitForm);
});

// async function sendForm(form) {
//   const ajaxurl = '/wp-admin/admin-ajax.php';
//   const headers = { 'Content-Type': 'multipart/form-data' };
//   const myFormData = new FormData(form);
//   const params = Object.fromEntries(myFormData.entries());

//   try {
//     const responce = await axios.get(ajaxurl, { params }, { headers });
//     console.log(responce.data);
//     if (responce.data !== 'error') {
//       formEnd(form, true);
//     } else {
//       formEnd(form, false);
//     }
//   } catch (error) {
//     formEnd(form, false);
//   }
// }

function formEnd(form, status) {
  if (status) {
    const successUrl = form.data.success;

    window.location.href = successUrl;
  } else {
    alert('Форма не відправлена. Спробуйте ще раз');
  }
}

function submitForm(e) {
  e.preventDefault();

  removeErrors();

  const fileds = e.target.elements;
  let errors = 0;

  Array.from(fileds).forEach(field => {
    const isReq = field.dataset.required;

    if (isReq) {
      const type = field.type;
      const val = field.value;

      if (checkFields(field, type, val)) {
        errors += 1;

        field.addEventListener('change', () => removeErrors(field));

        if (type === 'text' || type === 'email' || type === 'tel') {
          field.addEventListener('input', () => {
            if (!checkFields(field, type, field.value)) {
              removeErrors(field);
            }
          });
        }
      }
    }
  });

  if (!errors) {
    setTimeout(() => e.target.reset(), 300);

    // sendForm(e.target);
  }
}

function checkFields(field, type, val) {
  let errors = false;

  if (type === 'text') {
    if (isEmpty(val)) {
      field.closest('label').classList.add('isRequire');
      errors = true;
    }
  }

  if (type === 'email') {
    if (isEmpty(val) || !isEmail(val)) {
      field.closest('label').classList.add('isRequire');
      errors = true;
    }
  }

  if (type === 'tel') {
    if (isEmpty(val) || !isMaskFilledTel(field)) {
      field.closest('label').classList.add('isRequire');
      errors = true;
    }
  }

  if (type === 'checkbox') {
    if (!field.checked) {
      field.closest('label').classList.add('isRequire');
      errors = true;
    }
  }

  if (field.tagName === 'SELECT') {
    if (!field.value || field.value === '') {
      field.closest('label').classList.add('isRequire');
      errors = true;
    }
  }

  return errors;
}

function removeErrors(field) {
  if (field) {
    const label = field.closest('label');
    if (label && label.classList.contains('isRequire')) {
      label.classList.remove('isRequire');
    }
  } else {
    document
      .querySelectorAll('.isRequire')
      .forEach(el => el.classList.remove('isRequire'));
  }
}

const maskOptionsTel = {
  mask: '+{38} (000) 000 00 00',
};

function isMaskFilledTel(field) {
  const phoneMask = IMask(field, maskOptionsTel);

  return phoneMask.masked.isComplete;
}

document.addEventListener('DOMContentLoaded', function () {
  const telInputs = document.querySelectorAll('input[type="tel"]');

  telInputs.forEach(input => {
    IMask(input, maskOptionsTel);
  });
});
