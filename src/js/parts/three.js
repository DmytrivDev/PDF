import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 1️⃣ Создаем сцену
const scene = new THREE.Scene();

// 2️⃣ Камера
const camera = new THREE.PerspectiveCamera(75, 1900 / 900, 0.1, 1000);
camera.position.set(0, 0, 6);
// camera.position.set(5, 1, 5);

// 3️⃣ Рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(1900, 900);

const threeGraph = document.querySelector('.three-graph');
if (threeGraph) threeGraph.appendChild(renderer.domElement);

// 4️⃣ Свет
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(2, 2, 2);
scene.add(light);

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
    const fixedScale = 25;
    model.scale.set(fixedScale, fixedScale, fixedScale);

    // ✅ Ставим модель ровно
    // model.rotation.set(
    //   THREE.MathUtils.degToRad(15),
    //   THREE.MathUtils.degToRad(-40),
    //   THREE.MathUtils.degToRad(12)
    // );
    model.rotation.set(0, 0, 0);
    model.position.set(0, 0, 0); // Центрируем

    // 🎨 Меняем цвет модели
    model.traverse(child => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: 0x5200ff,
          transparent: true,
          opacity: 0.5, // Полупрозрачность
          metalness: 0.1, // Блеск
          roughness: 0.8, // Гладкость
        });
      }
    });

    scene.add(model);
  },
  undefined,
  error => {
    console.error('Ошибка загрузки модели:', error);
  }
);

// 7️⃣ Движение модели за мышью
window.addEventListener('mousemove', event => {
  if (!model) return;

  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;

  const rotationLimit = Math.PI * 0.03;
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
});

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
