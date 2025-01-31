import { disablePageScroll, enablePageScroll } from '@fluejs/noscroll';

let scrollLockCounter = 0;

export function lockScroll(target) {
  if (scrollLockCounter === 0) {
    disablePageScroll(target, { reserveScrollBarGap: true });
  }
  scrollLockCounter++;
}

export function unlockScroll() {
  if (scrollLockCounter > 0) {
    scrollLockCounter--;
  }
  if (scrollLockCounter === 0) {
    enablePageScroll();
  }
}
