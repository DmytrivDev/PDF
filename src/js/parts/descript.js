const advant = document.querySelector('.advant');
const advantContent = advant?.querySelector('.advant__content');
const btnMore = advant?.querySelector('.btn-more');

btnMore?.addEventListener('click', () => {
  btnMore.style.display = 'none';
  advantContent.classList.add('isOpened');
  setTimeout(() => {
    advantContent.classList.add('isAnim');
  }, 100);
});
