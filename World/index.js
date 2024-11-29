import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Инициализация сцены, камеры и рендера
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
// Создаем массив для отслеживания объектов с Raycast
const clickableObjects = [];

// Исходные позиции камеры
const initialPosition = new THREE.Vector3(5, 9, 5);
const initialLookAt = new THREE.Vector3(0, 0, 0);

// Глобальная цель камеры
let cameraTarget = {
    position: initialPosition.clone(),
    lookAt: initialLookAt.clone()
};

// Background must be #C3C6CB
const backgroundColor = 0xC3C6CB;
renderer.setClearColor(backgroundColor, 1);

const WIDTH = 370;
const HEIGHT = 250;
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);


// Загрузка текстур для изображений
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load('public/trans.png'); // Текстура флага
const posterTexture = textureLoader.load('public/poster1.png'); // Постер
const posterTexture2 = textureLoader.load('public/document.png'); // Постер
const windowTexture = textureLoader.load('public/window.png'); // Окно

function makeClickable(mesh, onClick) {
    const boundingBox = new THREE.Box3().setFromObject(mesh); // Границы объекта
    const center = boundingBox.getCenter(new THREE.Vector3()); // Центр объекта
    const size = boundingBox.getSize(new THREE.Vector3()); // Размеры объекта
    const distance = Math.max(size.x, size.y, size.z) * 1.5; // Расстояние камеры от объекта

    // Используем поворот объекта, чтобы корректно вычислить позицию камеры
    const rotation = mesh.rotation.y; // Берём угол поворота вокруг оси Y
    const cameraOffset = new THREE.Vector3(
        Math.sin(rotation) * distance, // Смещение камеры в зависимости от угла
        size.y / 2 + distance / 5,    // Поднимаем камеру немного вверх
        Math.cos(rotation) * distance // Смещение камеры в зависимости от угла
    );

    const cameraPosition = center.clone().add(cameraOffset);

    clickableObjects.push({
        mesh,
        onClick: () => {
            console.log(`Нажатие на объект: ${mesh.name || "без имени"}`);
            if (onClick) onClick(); // Дополнительное поведение
            cameraTarget.position.copy(cameraPosition); // Установка позиции камеры
            cameraTarget.lookAt.copy(center); // Камера смотрит на центр объекта
        },
    });
}
// Освещение
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 10, 5);
scene.add(light);

// Пол
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xD4A1FF }); // Цвет пола (пастельный фиолетовый)
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Стены (цвет пастельный фиолетовый)
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xD4A1FF });
const wall1 = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial);
wall1.position.set(0, 2.5, -5);
scene.add(wall1);

// Вторая стена (позади)
const wall2 = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial);
wall2.position.set(-5, 2.5, 0); // Стена на стороне
wall2.rotation.y = Math.PI / 2;
scene.add(wall2);

// Флаг на стене (Transgender Pride Flag)
const flagGeometry = new THREE.PlaneGeometry(4, 2);
const flagMaterial = new THREE.MeshStandardMaterial({ map: flagTexture });
const flag = new THREE.Mesh(flagGeometry, flagMaterial);
flag.position.set(-4.9, 3, 2.7);
flag.rotation.x = 0.2
flag.rotation.y = Math.PI / 2;
scene.add(flag);


// Ковер
const rugGeometry = new THREE.CircleGeometry(3, 32);
const rugMaterial = new THREE.MeshStandardMaterial({ color: 0xC3C3FF });
const rug = new THREE.Mesh(rugGeometry, rugMaterial);
rug.rotation.x = -Math.PI / 2;
rug.position.set(0, 0.01, 0);
scene.add(rug);

// Постер на стене
const posterGeometry = new THREE.PlaneGeometry(2, 3); // Размеры постера
const posterMaterial = new THREE.MeshStandardMaterial({ map: posterTexture, alphaTest: 0.5 });
const poster = new THREE.Mesh(posterGeometry, posterMaterial);
poster.position.set(3.4, 3, -4.9); // Размещение на стене
// poster.rotation.z = 0.1
scene.add(poster);

// Постер 2 на стене
const documentGeometry = new THREE.PlaneGeometry(2.9, 2); // Размеры документа
const documentMaterial = new THREE.MeshStandardMaterial({ map: posterTexture2, alphaTest: 0.5 });
const documentMesh = new THREE.Mesh(documentGeometry, documentMaterial);
documentMesh.position.set(0.5, 3, -4.9); // Размещение на стене
documentMesh.rotation.z = 0.1
scene.add(documentMesh);

// Окно
const windowGeometry = new THREE.PlaneGeometry(2, 2);
const windowMaterial = new THREE.MeshStandardMaterial({ map: windowTexture });
const window = new THREE.Mesh(windowGeometry, windowMaterial);
window.position.set(-4.9, 3, -3.5);
window.rotation.y = Math.PI / 2;
scene.add(window);

// Настройка камеры
camera.position.set(5, 9, 5);
camera.lookAt(0, 0, 0);

makeClickable(poster, () => console.log("Вы кликнули на постер 1!"));
makeClickable(documentMesh, () => console.log("Вы кликнули на постер 2!"));
makeClickable(window, () => console.log("Вы кликнули на окно!"));

document.addEventListener('click', (event) => {
    const raycaster = new THREE.Raycaster();
    const mousePosition = new THREE.Vector2();
    mousePosition.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mousePosition.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mousePosition, camera);
    const intersects = raycaster.intersectObjects(clickableObjects.map(o => o.mesh));

    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object; // First intersected object
        console.log("Intersected with:", clickedMesh);  // Log the intersected object
        const clickedObject = clickableObjects.find(o => o.mesh === clickedMesh);

        if (clickedObject && clickedObject.onClick) {
            clickedObject.onClick(); // Trigger the click handler
        } else {
            console.log("Handler not found for this object.");
        }
    } else {
        console.log("No intersections.");
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        console.log("Возврат камеры на исходную позицию");
        cameraTarget.position.copy(initialPosition);
        cameraTarget.lookAt.copy(initialLookAt);
    }
    else if (event.key === 'F') {
        light.color.set(0xff0000);
    }
});

// Анимация
function animate() {
    requestAnimationFrame(animate);

    renderer.shadowMap.enabled = true;
    light.castShadow = true;
    floor.receiveShadow = true;

    // Пример для объектов
    flag.castShadow = true;
    window.castShadow = true;

    // Плавное изменение положения камеры
    camera.position.lerp(cameraTarget.position, 0.05);
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    const smoothLookAt = currentLookAt.lerp(cameraTarget.lookAt.clone().sub(camera.position), 0.05);
    camera.lookAt(camera.position.clone().add(smoothLookAt));


    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(WIDTH, HEIGHT), 1.5, 0.4, 0.85);
    composer.addPass(bloomPass);
    
    // В рендере
    composer.render();

    renderer.render(scene, camera);
}


// Анимация флага
function animateFlag(mesh) {
    const time = Date.now() * 0.001;
    mesh.rotation.x = Math.sin(time) * 0.03;
    mesh.rotation.y = Math.PI / 2;
}

animate();

setInterval(() => {
    animateFlag(flag); 
}, 1);


// Обработка изменения размера окна
window.addEventListener('resize', () => {
    const aspect = WIDTH / HEIGHT;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
});
