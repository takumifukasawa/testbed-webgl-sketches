
import _ from "lodash";
import Color from "color";
import createTHREE from "./lib/createTHREE";
import createBorderTexture from "./lib/createBorderTexture";
import loadTexture from "./lib/loadTexture";
import createBillboardParticle from "./lib/createBillboardParticle";

let width, height;

let particleEmitTime = null;

let mouseProjectPos = null;

const glslify = require("glslify");

const standardVertexShader = glslify.file("./../glsl/standardVert.vert");
const displaySceneFragmentShader = glslify.file("./../glsl/displayScene.frag");

const { renderer, scene, camera } = createTHREE();
renderer.setClearColor(0x000000);

const mainScene = scene;
const mainCamera = camera;

const renderParams = {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  wrapS: THREE.ClampToEdgeWrapping,
  wrapT: THREE.ClampToEdgeWrapping,
  format: THREE.RGBAFormat
};
const mainBuffer = new THREE.WebGLRenderTarget(1, 1, renderParams);

const wrapper = document.querySelector(".js-wrapper");
wrapper.appendChild(renderer.domElement);

mainCamera.position.copy(new THREE.Vector3(0, 0, 12));
mainCamera.lookAt(new THREE.Vector3(0, 0, 0));

// const controls = new THREE.OrbitControls(mainCamera, renderer.domElement);

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(5, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xff0000
  })
);
//mainScene.add(sphere);

const particle = createBillboardParticle(100);
mainScene.add(particle);

const displayCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const displayScene = new THREE.Scene();

const displayUniforms = {};
displayUniforms.uMap = {
  type: "t",
  value: null
};
const displayQuad = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    vertexShader: standardVertexShader,
    fragmentShader: displaySceneFragmentShader,
    uniforms: displayUniforms,
    side: THREE.DoubleSide
  })
);
displayScene.add(displayQuad);

//--------------------------------------------------------------------
// init
//--------------------------------------------------------------------

async function init() {
  const texture = await loadTexture("./assets/img/text.png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
}

//--------------------------------------------------------------------
// onMouseMove
//--------------------------------------------------------------------

function onMouseMove(e) {
  const { clientX, clientY } = e;
  
  const v = new THREE.Vector3();
  v.set(
    clientX / width * 2 - 1,
    -clientY / height * 2 + 1,
    0.5
  );
  v.unproject(mainCamera);
  const dir = v.clone().sub(mainCamera.position.clone()).normalize();
  const distance = -mainCamera.position.z / dir.z;
  const pos = mainCamera.position.clone().add(dir.multiplyScalar(distance));

  mouseProjectPos = pos.clone();
}

//--------------------------------------------------------------------
// onWindowResize
//--------------------------------------------------------------------

function onWindowResize() {
  width = window.innerWidth;
  height = window.innerHeight;

  mainCamera.aspect = width / height;
  mainCamera.updateProjectionMatrix();
  
  renderer.setSize(width, height);

  mainBuffer.setSize(width, height);
}

//--------------------------------------------------------------------
// tick
//--------------------------------------------------------------------

function tick(time) {
  const t = time / 1000;

  const particleThrottle = 0.025;
  const num = 2;

  if(particleEmitTime + particleThrottle < t && mouseProjectPos != null) {
    for(let i=0; i<num; i++) {
      const scale = new THREE.Vector2(0.4 + Math.random() * 0.4, 0.4 + Math.random() * 0.4);
      const duration = 0.15 + scale.length() * 0.2;
      const h = Math.random() > .5 ? 5 : 35;
      const s = 100;
      const l = 50 + Math.random() * 30;
      const color = Color(`hsl(${h}, ${s}%, ${l}%)`);
      particle.addPoly({
        position: mouseProjectPos.clone().add(new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
        )),
        color: new THREE.Vector3(color.red() / 255, color.green() / 255, color.blue() / 255),
        scale,
        time: t,
        thick: i % 2 === 1 ? 0 : .4,
        duration
      });
    }
    // mouseProjectPos = null;
    particleEmitTime = t;
  }

  particle.update(t);
  
  // controls.update();

  // main

  renderer.render(mainScene, mainCamera, mainBuffer, false);
  
  // post process

  displayUniforms.uMap.value = mainBuffer.texture;

  renderer.render(displayScene, displayCamera);
  
  requestAnimationFrame(tick);
}

//--------------------------------------------------------------------
// main
//--------------------------------------------------------------------

async function main() {
  await init();
  onWindowResize();
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("mousemove", onMouseMove);
  requestAnimationFrame(tick);
}

main();
