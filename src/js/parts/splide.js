import { initSlider } from './splidecust';

let locSliderMainInstance;
let locSliderThumbInstance;
const locSliderMain = document.querySelector('.location__slider .slider__main');
const locSliderThumb = document.querySelector(
  '.location__slider .slider__thumb'
);
const initLocSliders = () => {
  if (locSliderMain && !locSliderMainInstance) {
    locSliderMainInstance = initSlider(locSliderMain, {
      type: 'loop',
      updateOnMove: false,
      cover: true,
      autoplay: true,
      interval: 2000,
      loop: true,
    });
  }

  if (locSliderThumb && !locSliderThumbInstance) {
    locSliderThumbInstance = initSlider(locSliderThumb, {
      isNavigation: true,
      cover: true,
    });
  }

  if (locSliderMainInstance && locSliderThumbInstance) {
    locSliderMainInstance.sync(locSliderThumbInstance);
  }
};
initLocSliders();

let stepsSliderInstance;
const steps = document.querySelector('.steps');
const initStepsSlider = () => {
  if (steps && !stepsSliderInstance) {
    stepsSliderInstance = initSlider(steps, {
      type: 'slide',
      gap: '0.5rem',
      pagination: true,
      perPage: 2,
      perMove: 1,
      breakpoints: {
        630: {
          perPage: 1,
        },
      },
    });
  }
};

const sliderRev = document.querySelectorAll('.slider-rev');
sliderRev?.forEach(container => {
  initSlider(container, {
    perPage: 3,
    gap: '1.5rem',
    pagination: true,
    perMove: 1,
    breakpoints: {
      960: {
        perPage: 2,
        perMove: 2,
        gap: '0.5rem',
      },
      775: {
        perPage: 1,
        perMove: 1,
      },
    },
  });
});

let assortSliderInstance;
const assort = document.querySelector('.assort');
const initAssortSlider = () => {
  if (assort && !assortSliderInstance) {
    assortSliderInstance = initSlider(assort, {
      type: 'slide',
      gap: '1.5rem',
      perPage: 4,
      perMove: 1,
      pagination: true,
    });
  }
};

const destroySlidersDesc = () => {
  if (stepsSliderInstance) {
    stepsSliderInstance.destroy();
    stepsSliderInstance = null;
  }
};
const destroySlidersMob = () => {
  if (assortSliderInstance) {
    assortSliderInstance.destroy();
    assortSliderInstance = null;
  }
};

const checkViewport = () => {
  initStepsSlider();
  initAssortSlider();
  if (window.innerWidth > 960) {
    destroySlidersDesc();
  }
  if (window.innerWidth < 960) {
    destroySlidersMob();
  }
};

window.addEventListener('resize', checkViewport);
document.addEventListener('DOMContentLoaded', checkViewport);

// const elemSplides = document.querySelectorAll('.elem');
// elemSplides?.forEach(container => {
//   initSlider(container, {
//     perPage: 2,
//     breakpoints: {
//       960: {},
//       500: {},
//     },
//   });
// });

// let elemSliderInstance;
// const elem = document.querySelector('.elem');

// const initOurproductSlider = () => {
//   if (elem && !elemSliderInstance) {
//     elemSliderInstance = initSlider(elem, {
//       perPage: 2,
//       breakpoints: {
//         960: {},
//         500: {},
//       },
//     });
//   }
// };
