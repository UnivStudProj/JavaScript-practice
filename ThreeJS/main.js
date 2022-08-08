import * as THREE from 'three';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

const gui = new dat.GUI();
const world = {
    plane: {
        width: 19,
        height: 19,
        widthSegments: 17,
        heightSegments: 17
    }
}

gui.add(world.plane, 'width', 1, 50).onChange(generatePlane);
gui.add(world.plane, 'height', 1, 50).onChange(generatePlane);
gui.add(world.plane, 'widthSegments', 1, 50).onChange(generatePlane);
gui.add(world.plane, 'heightSegments', 1, 50).onChange(generatePlane);

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
let camera;

const planeGeometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
);
const planeMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,
    vertexColors: true
});
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);


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

    const colors = [];
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0, 0.19, 0.4);
    }

    planeMesh.geometry.setAttribute(
        'color', 
        new THREE.BufferAttribute(new Float32Array(colors), 3)
    );
}

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
addEventListener('resize', init);

// create main scene
function init() {
    camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(devicePixelRatio);

    console.log(document.querySelector('canvas'));
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    scene.add(planeMesh);
    camera.position.z = 5;
}

function animate() {
    renderer.render(scene, camera);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(planeMesh);

    if (intersects.length > 0) {
        const {color} = intersects[0].object.geometry.attributes;

        const hoverColor = {
            r: 0.1,
            g: 0.5,
            b: 1
        };

        const initialColor = {
            r: 0,
            g: 0.19,
            b: 0.4,
            duration: 1,
            onUpdate: () => {
                // vertice 1
                color.setX(intersects[0].face.a, hoverColor.r);
                color.setY(intersects[0].face.a, hoverColor.g);
                color.setZ(intersects[0].face.a, hoverColor.b);

                // vertice 2
                color.setX(intersects[0].face.b, hoverColor.r);
                color.setY(intersects[0].face.b, hoverColor.g);
                color.setZ(intersects[0].face.b, hoverColor.b);

                // vertice 3
                color.setX(intersects[0].face.c, hoverColor.r);
                color.setY(intersects[0].face.c, hoverColor.g);
                color.setZ(intersects[0].face.c, hoverColor.b);

                color.needsUpdate = true;
            }
        };

        gsap.to(hoverColor, initialColor);
    }

    requestAnimationFrame(animate);
}

init();
generatePlane();
animate();
