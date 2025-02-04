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
      type: 'fade',
      updateOnMove: false,
      cover: true,
    });
  }

  if (locSliderThumb && !locSliderThumbInstance) {
    locSliderThumbInstance = initSlider(locSliderThumb, {
      isNavigation: true,
      cover: true,
      // focus: 'center',
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

const destroySliders = () => {
  if (stepsSliderInstance) {
    stepsSliderInstance.destroy();
    stepsSliderInstance = null;
  }
};

const checkViewport = () => {
  initStepsSlider();
  if (window.innerWidth > 960) {
    destroySliders();
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
