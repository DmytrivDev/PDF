function addMoreBlocks(container) {
  const moreBlock = container?.querySelector('.moreBlock');
  const btnMore = container?.querySelector('.addMore');

  btnMore?.addEventListener('click', () => {
    if (moreBlock) {
      btnMore.style.display = 'none';
      moreBlock.classList.add('isOpened');
      setTimeout(() => {
        moreBlock.classList.add('isAnim');
      }, 100);
    }
  });
}

const advant = document.querySelector('.advant');
const assort = document.querySelector('.assort');
const swap = document.querySelector('.swap');

addMoreBlocks(advant);
addMoreBlocks(assort);
addMoreBlocks(swap);
