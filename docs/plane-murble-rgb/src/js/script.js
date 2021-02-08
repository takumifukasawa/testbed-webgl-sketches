
import createTHREE from "./lib/createTHREE";
import createBorderTexture from "./lib/createBorderTexture";
import loadTexture from "./lib/loadTexture";

import createBloomFilter from "./lib/createBloomFilter";
import createLineToneFilter from "./lib/createLineToneFilter";

const glslify = require("glslify");
const vertexShader = glslify.file("./../glsl/output.vert");
const fragmentShader = glslify.file("./../glsl/output.frag");

const { renderer, composer, scene, camera } = createTHREE();
renderer.setClearColor(0x000000);

const renderScene = new THREE.RenderPass(scene, camera);
composer.addPass(renderScene);

const lineToneFilter = createLineToneFilter();
const lineToneEffect = new THREE.ShaderPass(lineToneFilter);
composer.addPass(lineToneEffect);

const bloomFilter = createBloomFilter();
const bloomEffect = new bloomFilter();
bloomEffect.renderToScreen = true;
composer.addPass(bloomEffect);

const wrapper = document.querySelector(".js-wrapper");
wrapper.appendChild(renderer.domElement);

camera.position.copy(new THREE.Vector3(0, 0, 12));
camera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const uniforms = {};
let sphere = null;

async function init() {
  const texture = await loadTexture("./assets/img/border2.png");
  //const texture = await createBorderTexture(512, 512, 8);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  uniforms.u_map = {
    type: "t",
    value: texture
  };
  uniforms.u_time = {
    type: "f",
    value: 0
  };

  const geometry = new THREE.SphereBufferGeometry(4, 32, 32);
  const material = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    side: THREE.DoubleSide,
  });

  sphere = new THREE.Mesh(geometry, material);
  sphere.position.copy(new THREE.Vector3(0, 0, 0));
  scene.add(sphere);
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);

  bloomEffect.setSize(width, height);
}

function tick(time) {
  sphere.rotation.y = time / 4000;
  uniforms.u_time.value = time / 1000;
  bloomEffect.blurUniforms.uTime.value = time / 1000;
  lineToneEffect.uniforms.uTime.value = time / 1000;
  controls.update();
  composer.render();
  requestAnimationFrame(tick);
}

async function main() {
  await init();
  onWindowResize();
  window.addEventListener("resize", onWindowResize);
  requestAnimationFrame(tick);
}

main();
