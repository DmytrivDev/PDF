import { toggle, up } from 'slide-element';

function handleMenuItemChildren() {
  const isMobile = () => window.innerWidth < 960;

  function handleMenu(menuElement) {
    const links = menuElement.querySelectorAll('.menu-item-has-children > a');
    links.forEach(link => {
      if (link.getAttribute('href') === '#') {
        link.addEventListener('click', event => event.preventDefault());
      }
    });

    function toggleMenu(event) {
      const target = event.target;
      const menuItem = target.closest('.menu-item-has-children');
      const menuLink = target.closest('.menu-item-has-children > a');

      if (menuItem && menuLink === target) {
        event.preventDefault();
        const subMenu = menuItem.querySelector('& > .sub-menu');
        toggle(subMenu, { display: 'flex' });
        menuItem.classList.toggle('isOpened');

        const allOpenedItems = menuItem.parentElement.querySelectorAll(
          '.menu-item-has-children.isOpened'
        );
        allOpenedItems.forEach(item => {
          if (item !== menuItem) {
            up(item.querySelector('.sub-menu'));
            item.classList.remove('isOpened');
          }
        });
      }
    }

    function activateMenu() {
      if (menuElement.dataset.hasEventListener !== 'true') {
        menuElement.addEventListener('click', toggleMenu);
        menuElement.dataset.hasEventListener = 'true';
      }
    }

    function deactivateMenu() {
      if (menuElement.dataset.hasEventListener === 'true') {
        menuElement.removeEventListener('click', toggleMenu);
        menuElement.dataset.hasEventListener = 'false';

        menuElement
          .querySelectorAll('& > .menu-item-has-children')
          .forEach(item => item.classList.remove('isOpened'));
        menuElement.querySelectorAll('& > .sub-menu').forEach(subMenu => {
          subMenu.style.display = '';
        });
      }
    }

    function applyMenuLogic() {
      if (isMobile()) {
        activateMenu();
      } else {
        deactivateMenu();
      }
    }

    applyMenuLogic();
    window.addEventListener('resize', applyMenuLogic);
  }

  const mobMenu = document.querySelector('.mobmenu');
  const footerList = document.querySelector('.footer__list');

  if (mobMenu) handleMenu(mobMenu);
  if (footerList) handleMenu(footerList);
}

document.addEventListener('DOMContentLoaded', handleMenuItemChildren);
