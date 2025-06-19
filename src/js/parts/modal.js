import { lockScroll, unlockScroll } from './lockscroll.js';

import { closeMenu } from './mobmenu.js';
import { addBookingCurrency, addBookingCurrencyBtn } from './booking.js';

export const activeModals = new Set();
const initializedModals = new WeakSet();

function showModal(modal) {
  modal.classList.add('isOpened');
  lockScroll(modal);
  activeModals.add(modal);
}

export function closeModal(modal) {
  modal.classList.remove('isOpened');
  setTimeout(() => modal.classList.remove('isMess'), 150);
  activeModals.delete(modal);
  unlockScroll();
  resetFieldVisibilityClasses();
}

function initCloseModal(modal) {
  if (initializedModals.has(modal)) return;

  const modalContainer = modal.querySelector('.containerModal');
  const btnsCloseModal = modal.querySelectorAll('.closeModal');

  btnsCloseModal.forEach(btn => {
    btn.addEventListener('click', () => closeModal(modal));
  });

  if (modalContainer) {
    modalContainer.addEventListener('click', event => {
      if (event.target === modalContainer) {
        closeModal(modal);
      }
    });
  }

  initializedModals.add(modal);
}

export function openModal(modalId, btn) {
  const modal = document.getElementById(modalId);
  if (modal) {
    activeModals.forEach(activeModal => {
      if (activeModal !== modal) {
        closeModal(activeModal);
      }
    });

    if (!initializedModals.has(modal)) {
      initCloseModal(modal);
    }

    if (!modal.classList.contains('isOpened')) {
      closeMenu();
      if (!btn.classList.contains('assortModal')) {
        addBookingCurrency(modal);
      } else {
        addBookingCurrencyBtn(modal, btn);
      }
      showModal(modal);
    }
  }
}

function initOpenModal() {
  const btnsOpenModal = document.querySelectorAll('.openModal');
  btnsOpenModal.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.id;
      if (modalId) {
        openModal(modalId, btn);
      }
    });
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const lastModal = Array.from(activeModals).pop();
    if (lastModal) closeModal(lastModal);
  }
});

document.addEventListener('DOMContentLoaded', initOpenModal);

function resetFieldVisibilityClasses() {
  document.querySelectorAll('.showF, .hideF').forEach(el => {
    el.classList.remove('showF', 'hideF');
  });
}
