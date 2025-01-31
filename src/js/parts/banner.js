const bannerCarousels = document.querySelectorAll('.banner__carousel');

function initCalcSpeedCarse() {
  bannerCarousels?.forEach(carousel => {
    const carousellPartF = carousel.querySelector('.carsePartF');
    const carousellPartS = carousel.querySelector('.carsePartS');

    const listWidthPartF = carousellPartF.scrollWidth; // Повна ширина списку carsePartF
    const carousellWidth = carousel.clientWidth; // Ширина видимої області
    const moveValue = listWidthPartF - carousellWidth;

    const computedStyle = window.getComputedStyle(carousellPartF);
    const gap = parseFloat(computedStyle.gap || 0);
    const totalGap = (gap / 16) * 2;

    carousel.style.setProperty('--moveP', `${Math.abs(moveValue)}px`);
    carousel.style.setProperty('--moveM', `-${Math.abs(moveValue)}px`);
    carousel.style.setProperty('--gap', `${totalGap}rem`);

    const dataSpeed = parseFloat(carousel.getAttribute('data-speed')) || 10;
    const dataFactor = parseFloat(carousel.getAttribute('data-factor')) || 1.5;
    const reverse = carousel.hasAttribute('data-reverse');

    const calcSpeed = (listWidthPartF / 1000) * dataSpeed;
    const speed = window.innerWidth > 960 ? calcSpeed : calcSpeed * dataFactor;

    const direction = reverse ? 'reverse' : 'normal';

    carousellPartF.style.animationDelay = `-${speed}s`;
    carousellPartS.style.animationDelay = `-${speed / 2}s`;
    carousellPartF.style.webkitAnimationDelay = `-${speed}s`;
    carousellPartS.style.webkitAnimationDelay = `-${speed / 2}s`;

    carousellPartF.style.animationDuration = `${speed}s`;
    carousellPartS.style.animationDuration = `${speed}s`;
    carousellPartF.style.webkitAnimationDuration = `${speed}s`;
    carousellPartS.style.webkitAnimationDuration = `${speed}s`;

    carousellPartF.style.animationDirection = direction;
    carousellPartS.style.animationDirection = direction;
    carousellPartF.style.webkitAnimationDirection = direction;
    carousellPartS.style.webkitAnimationDirection = direction;
  });
}

window.addEventListener('resize', initCalcSpeedCarse);
document.addEventListener('DOMContentLoaded', initCalcSpeedCarse);
