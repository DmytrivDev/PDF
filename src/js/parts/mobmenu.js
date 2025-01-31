import { lockScroll, unlockScroll } from './lockscroll.js';

const burger = document.querySelector('.burger');
const mobMenu = document.querySelector('.mobmenu');
const mobMenuBody = document.querySelector('.mobmenu__body');
const mobNavLinks = document.querySelectorAll('.mobmenu .navmenu__list a');

let isMenuOpened = false;

function toggleMenu() {
  if (burger && mobMenu) {
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

function closeMenu() {
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
      link.addEventListener('click', closeMenu);
    });
  }
}

document.addEventListener('DOMContentLoaded', initMenu);
