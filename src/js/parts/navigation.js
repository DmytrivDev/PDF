import { toggle, up } from 'slide-element';

function handleMenuItemChildren() {
  const mobMenu = document.querySelector('.mobmenu');
  const footerList = document.querySelector('.footer__list');
  const isMobile = () => window.innerWidth < 960;

  function activateMenu(menuElement, handler) {
    if (!menuElement.dataset.hasEventListener) {
      menuElement.addEventListener('click', handler);
      menuElement.dataset.hasEventListener = 'true';
    }
  }

  function deactivateMenu(menuElement, handler) {
    if (menuElement.dataset.hasEventListener) {
      menuElement.removeEventListener('click', handler);
      menuElement.dataset.hasEventListener = 'false';
    }
  }

  function toggleMenu(event, menuSelector, linkSelector) {
    const target = event.target;
    const menuItem = target.closest(menuSelector);
    const menuLink = target.closest(`${menuSelector} > ${linkSelector}`);

    if (menuItem && menuLink === target) {
      event.preventDefault();

      const subMenu = menuItem.querySelector('.sub-menu');
      toggle(subMenu, { display: 'flex' });
      menuItem.classList.toggle('isOpened');

      const allOpenedItems = menuItem.parentElement.querySelectorAll(
        `${menuSelector}.isOpened`
      );
      allOpenedItems.forEach(item => {
        if (item !== menuItem) {
          up(item.querySelector('.sub-menu'));
          item.classList.remove('isOpened');
        }
      });
    }
  }

  function applyMenuLogic() {
    if (isMobile()) {
      if (mobMenu)
        activateMenu(mobMenu, event =>
          toggleMenu(event, '.menu-item-has-children', 'a')
        );
      if (footerList)
        activateMenu(footerList, event =>
          toggleMenu(event, '.menu-item-has-children', 'p')
        );
    } else {
      if (mobMenu)
        deactivateMenu(mobMenu, event =>
          toggleMenu(event, '.menu-item-has-children', 'a')
        );
      if (footerList)
        deactivateMenu(footerList, event =>
          toggleMenu(event, '.menu-item-has-children', 'p')
        );
    }
  }

  applyMenuLogic();
  window.addEventListener('resize', applyMenuLogic);
}

document.addEventListener('DOMContentLoaded', handleMenuItemChildren);
