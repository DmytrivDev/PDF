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
      pagination: false,
      arrows: false,
      cover: true,
    });
  }

  if (locSliderThumb && !locSliderThumbInstance) {
    locSliderThumbInstance = initSlider(locSliderThumb, {
      isNavigation: true,
      pagination: false,
      arrows: false,
      cover: true,
      focus: 'center',
    });
  }

  if (locSliderMainInstance && locSliderThumbInstance) {
    locSliderMainInstance.sync(locSliderThumbInstance);
  }
};

initLocSliders();

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

// const destroySliders = () => {
//   if (elemSliderInstance) {
//     elemSliderInstance.destroy();
//     elemSliderInstance = null;
//   }
// };

// const checkViewport = () => {
//   initOurproductSlider();
//   if (window.innerWidth > 960) {
//     destroySliders();
//   }
// };

// window.addEventListener('resize', checkViewport);
// document.addEventListener('DOMContentLoaded', checkViewport);
