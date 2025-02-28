import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarField from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";


const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);
THREE.ColorManagement.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;


const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);

new OrbitControls(camera, renderer.domElement);

const detail = 16;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("./textures/8k_earth_daymap.jpg"),
    specularMap: loader.load("./textures/8k_earth_specular_map.tif"),
    bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
    bumpScale: 0.04,
});


const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("./textures/8k_earth_nightmap.jpg"),
    blending: THREE.AdditiveBlending,
})
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("./textures/04_earthcloudmap.jpg"),
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load("./textures/05_earthcloudmaptrans.jpg"),
})
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const FresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, FresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarField();
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xfffff0);
scene.add(sunLight);
sunLight.position.set(-2, 0.5, 1.5);

function animate(t = 0) {
    requestAnimationFrame(animate);
    earthMesh.rotation.y += 0.002;
    lightsMesh.rotation.y += 0.002;
    cloudsMesh.rotation.y += 0.0022;
    glowMesh.rotation.y += 0.002;
    stars.rotation.y -= 0.0002;

    renderer.render(scene, camera);
    controls.update()
}
animate()

function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);