const parallax = document.querySelectorAll('.prllx');

function calculateScrollPercentage(section) {
  if (!section) return;

  const parallaxList = section.querySelector('.prllx-list');

  const sectionRect = parallaxList.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const centerOfViewport = windowHeight / 2;

  // Відстань від верхнього краю секції до центру екрана
  const distanceToCenter = centerOfViewport - sectionRect.top;

  // Розрахунок відсотка прогресу від 0 до 100%
  let visibilityPercentage =
    (distanceToCenter / (sectionRect.height / 2)) * 100;

  // Обмежуємо значення від 0% до 100%
  visibilityPercentage = Math.max(0, Math.min(visibilityPercentage, 100));

  applyStylesParallax(parallaxList, visibilityPercentage.toFixed(0));
}

function applyStylesParallax(section, visibilityPercentage) {
  const isDesktop = window.innerWidth > 960;
  const items = section.querySelectorAll('& > li');

  let maxHeightItems = 0;

  items?.forEach(item => {
    item.style.height = 'auto';
  });

  items?.forEach(item => {
    const height = item.offsetHeight;
    if (height > maxHeightItems) maxHeightItems = height;
  });
  items?.forEach(item => {
    if (isDesktop) {
      item.style.height = `${maxHeightItems}px`;
    }
  });

  // Визначаємо коефіцієнт для кожного класу
  const topVars = {
    prllxF: isDesktop ? (visibilityPercentage / 100) * 3.75 : 0,
    prllxS: isDesktop ? (visibilityPercentage / 100) * 5 : 0,
    prllxT: isDesktop ? (visibilityPercentage / 100) * 6.25 : 0,
  };

  // Перевіряємо, чи має section відповідний клас
  const sectionClass = Object.keys(topVars).find(cls =>
    section.classList.contains(cls)
  );

  if (!sectionClass) return; // Вихід, якщо жоден клас не знайдено

  const topVar = topVars[sectionClass];

  // Функція для застосування стилів з перевіркою індексу
  const setItemTop = (index, multiplier) => {
    if (items[index]) items[index].style.top = `-${topVar * multiplier}rem`;
  };

  if (items.length === 4 || items.length === 8) {
    setItemTop(1, 1);
    setItemTop(3, 1);
    setItemTop(5, 1);
    setItemTop(7, 1);
  } else if (items.length === 3 || items.length === 6) {
    setItemTop(1, 1);
    setItemTop(4, 1);
  }
}

function initScrollAnim() {
  parallax?.forEach(section => {
    calculateScrollPercentage(section);
  });
}

window.addEventListener('scroll', initScrollAnim);
window.addEventListener('resize', initScrollAnim);
document.addEventListener('DOMContentLoaded', initScrollAnim);
