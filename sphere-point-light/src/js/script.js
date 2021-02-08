
import createTHREE from "./lib/createTHREE";
import createBorderTexture from "./lib/createBorderTexture";
import loadTexture from "./lib/loadTexture";

const glslify = require("glslify");
const vertexShader = glslify.file("./../glsl/THREEBasic.vert");
const fragmentShader = glslify.file("./../glsl/output.frag");

const { renderer, scene, camera } = createTHREE();
renderer.setClearColor(0x000000);

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

  //const geometry = new THREE.IcosahedronGeometry(1, 6);
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

function tick(time) {
  uniforms.u_time.value = time / 1000;
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

async function main() {
  await init();
  requestAnimationFrame(tick);
}

main();
