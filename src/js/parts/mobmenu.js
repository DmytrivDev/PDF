import { lockScroll, unlockScroll } from './lockscroll.js';

import { closeModal, activeModals } from './modal.js';

const burger = document.querySelector('.burger');
const mobMenu = document.querySelector('.mobmenu');
const mobMenuBody = document.querySelector('.mobmenu__body');
const mobNavLinks = document.querySelectorAll('.mobmenu .navmenu__list a');

let isMenuOpened = false;

function toggleMenu() {
  if (burger && mobMenu) {
    activeModals.forEach(activeModal => {
      closeModal(activeModal);
    });

    isMenuOpened = !isMenuOpened;
    burger.classList.toggle('isOpened');
    mobMenu.classList.toggle('isOpened');

    if (isMenuOpened) {
      lockScroll(mobMenuBody);
    } else {
      unlockScroll();
    }
  }
}

export function closeMenu() {
  if (burger && mobMenu && isMenuOpened) {
    isMenuOpened = false;
    burger.classList.remove('isOpened');
    mobMenu.classList.remove('isOpened');
    unlockScroll();
  }
}

function handleResize() {
  if (window.innerWidth > 960) {
    closeMenu();
  }
}

function initMenu() {
  if (burger && mobMenu) {
    window.addEventListener('resize', handleResize);
    burger.addEventListener('click', toggleMenu);
  }

  if (mobNavLinks) {
    mobNavLinks.forEach(link => {
      link.addEventListener('click', event => {
        const target = event.target;
        const itemChildren = target.closest('.menu-item');
        const subMenu = target.closest('.sub-menu');

        const hasItemChildren = itemChildren?.classList.contains(
          'menu-item-has-children'
        );
        const subMenuLink = subMenu?.querySelectorAll('a');

        if (!hasItemChildren || subMenuLink) {
          closeMenu();
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', initMenu);
