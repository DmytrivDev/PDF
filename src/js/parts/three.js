import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 1️⃣ Создаем сцену
const scene = new THREE.Scene();

// 2️⃣ Камера
const camera = new THREE.PerspectiveCamera(75, 1900 / 900, 0.1, 1000);
camera.position.set(0, 0, 6);

// 3️⃣ Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(1900, 900);

const threeGraph = document.querySelector('.three-graph');
if (threeGraph) threeGraph.appendChild(renderer.domElement);

// 4️⃣ Свет
const light = new THREE.DirectionalLight(0xffffff, 2); // Направленное освещение
light.position.set(2, 2, 2);
scene.add(light);

// Добавим дополнительные источники света

// Загальне освітлення (ambient light)
const ambientLight = new THREE.AmbientLight(0x404040, 0.6); // М'яке освітлення
scene.add(ambientLight);

// Точкове освітлення (point light)
const pointLight = new THREE.DirectionalLight(0xffffff, 1); // Трошки зменшена інтенсивність
light.position.set(2, 2, 2);
scene.add(pointLight);

// 5️⃣ Контролы камеры
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableRotate = false;
controls.enableZoom = false;

// 6️⃣ Загрузка GLB-модели
const loader = new GLTFLoader();
let model; // Храним модель глобально

loader.load(
  './img/model/logo_3d.glb',
  gltf => {
    model = gltf.scene;

    // ⬆️ Фиксируем размер (не даем его менять)
    const fixedScale = 26;
    model.scale.set(fixedScale, fixedScale, fixedScale);

    model.rotation.set(-0.4, -0.1, 0.15);
    model.position.set(0, 0, 0); // Центрируем

    // 🎨 Меняем цвет модели
    model.traverse(child => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0x7c25cf, // Основний колір
          emissive: 0x4e1f88, // Більш м'яке світіння
          emissiveIntensity: 0.2, // Зменшена інтенсивність світіння
          transparent: true,
          opacity: 1,
          metalness: 0.3, // Легкий блиск
          roughness: 0.4, // М'якша поверхня
        });
      }
    });

    threeGraph.classList.add('show');
    scene.add(model);
  },
  undefined,
  error => {
    console.error('Ошибка загрузки модели:', error);
  }
);

let mouseX = 0;
let mouseY = 0;

// Отримуємо координати миші при завантаженні сторінки
window.addEventListener('load', () => {
  // Створюємо подію mousemove на самому початку
  document.addEventListener('mousemove', event => {
    // Записуємо координати на самому початку
    mouseX = event.clientX;
    mouseY = event.clientY;
    // Тепер можна видалити цей слухач, щоб не зловити перший рух миші
    // document.removeEventListener('mousemove', arguments.callee);
  });
});

// Функція для отримання координат миші
function getMousePosition() {
  console.log(mouseX, mouseY);
}

getMousePosition();

// 7️⃣ Движение модели за мышью
window.addEventListener('mousemove', event => {
  if (!model) return;

  modelPositionFunc(event.clientX, event.clientY);
});

function modelPositionFunc(clientX, clientY) {
  const x = (clientX / window.innerWidth) * 2 - 1.1;
  const y = -(clientY / window.innerHeight) * 2 + 0.6;

  const rotationLimit = Math.PI * 0.2;
  model.rotation.y = THREE.MathUtils.clamp(
    x * rotationLimit,
    -rotationLimit,
    rotationLimit
  );
  model.rotation.x = THREE.MathUtils.clamp(
    y * rotationLimit,
    -rotationLimit,
    rotationLimit
  );
}

// 8️⃣ Анимация сцены
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 9️⃣ Адаптивный рендер при изменении окна
// window.addEventListener('resize', () => {
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
// });
