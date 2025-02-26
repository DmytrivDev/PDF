import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';

const accord = document.querySelectorAll('.accord');

let globalIndex = 1;

accord?.forEach((list, index) => {
  const items = list.querySelectorAll('.ac');
  const openIndexes = Array.from(items, (_, i) => i);

  new Accordion(list, {
    openOnInit: openIndexes,
    duration: 400,
    showMultiple: true,
  });

  items.forEach(item => {
    const header = item.querySelector('.fqa__header');
    if (header) {
      const numberSpan = document.createElement('span');
      numberSpan.textContent = `${globalIndex}. `;
      header.prepend(numberSpan);
      globalIndex += 1;
    }
  });

  const secFaq = list.closest('.fqa');
  const btnMore = secFaq?.querySelector('.btn-def');

  if (index === 1) {
    btnMore?.addEventListener('click', () => {
      btnMore.style.display = 'none';
      list.classList.add('isOpened');
      scrollToList();
      setTimeout(() => {
        list.classList.add('isAnim');
      }, 100);
    });

    function scrollToList() {
      window.scrollTo({
        top: list.offsetTop - 300,
        behavior: 'smooth',
      });
    }
  }

  const panels = list.querySelectorAll('.ac-panel');
  panels.forEach(panel => {
    panel.addEventListener('click', event => {
      event.stopPropagation();
    });
  });
});
