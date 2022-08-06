import * as THREE from 'three';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const gui = new dat.GUI();
const world = {
    plane: {
        width: 10,
        height: 10,
        widthSegments: 10,
        heightSegments: 10
    }
}

gui.add(world.plane, 'width', 1, 20).onChange(generatePlane);
gui.add(world.plane, 'height', 1, 20).onChange(generatePlane);
gui.add(world.plane, 'widthSegments', 1, 50).onChange(generatePlane);
gui.add(world.plane, 'heightSegments', 1, 50).onChange(generatePlane);

function generatePlane() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width,
        world.plane.height,
        world.plane.widthSegments,
        world.plane.heightSegments
    );

    const {array} = planeMesh.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];
        
        array[i + 2] = z + Math.random();
    }
}

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(planeMesh);

const {array} = planeMesh.geometry.attributes.position;
for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    
    array[i + 2] = z + Math.random();
}

const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(1, 0, 0);
}

planeMesh.geometry.setAttribute(
    'color', 
    new THREE.BufferAttribute(new Float32Array(colors), 3)
);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const mouse = {
    x: undefined,
    y: undefined,
}

addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / innerWidth * 2 - 1,
    mouse.y = -event.clientY / innerHeight * 2 + 1
});

function animate() {
    renderer.render(scene, camera);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeMesh);

    if (intersects.length > 0) {
        const {color} = intersects[0].object.geometry.attributes;

        // vertice 1
        color.setX(intersects[0].face.a, 0);
        color.setY(intersects[0].face.a, 0);
        color.setZ(intersects[0].face.a, 1);

        // vertice 2
        color.setX(intersects[0].face.b, 0);
        color.setY(intersects[0].face.b, 0);
        color.setZ(intersects[0].face.b, 1);

        // vertice 3
        color.setX(intersects[0].face.c, 0);
        color.setY(intersects[0].face.c, 0);
        color.setZ(intersects[0].face.c, 1);

        color.needsUpdate = true;
    }

    requestAnimationFrame(animate);
}

animate();
