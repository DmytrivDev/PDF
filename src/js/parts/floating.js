document.addEventListener('DOMContentLoaded', () => {
  const floating = document.querySelector('.floating');
  const closeBtn = document.querySelector('.floating__close');

  if (!floating) return;

  setTimeout(() => {
    floating.classList.add('isOpened');
  }, 500);

  closeBtn?.addEventListener('click', () => {
    floating.classList.remove('isOpened');
  });
});
