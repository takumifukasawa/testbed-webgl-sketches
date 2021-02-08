
import _ from "lodash";
import createTHREE from "./lib/createTHREE";
import createBorderTexture from "./lib/createBorderTexture";
import loadTexture from "./lib/loadTexture";
import gui from "./lib/gui";

let width, height;

const glslify = require("glslify");

const sphereVertexShader = glslify.file("./../glsl/sphere.vert");
const sphereFragmentShader = glslify.file("./../glsl/sphere.frag");

const standardVertexShader = glslify.file("./../glsl/standardVert.vert");
const displaySceneFragmentShader = glslify.file("./../glsl/displayScene.frag");

const frontSceneVertexShader = glslify.file("./../glsl/frontScene.vert");
const frontSceneFragmentShader = glslify.file("./../glsl/frontScene.frag");

const frontBlurVertexShader = glslify.file("./../glsl/blurFilter.vert");
const frontBlurFragmentShader = glslify.file("./../glsl/blurFilter.frag");

const guiData = {};
guiData.blurBufferOptim = 8;
gui.add(guiData, "blurBufferOptim", 1, 10).onChange(() => {
  onWindowResize();
});
guiData.blurOffset = 0.002;
gui.add(guiData, "blurOffset", 0.0002, 0.004);

const { renderer, composer, scene, camera, light } = createTHREE();
renderer.setClearColor(0x000000);

const backgroundScene = scene;
const backgroundCamera = camera;

const frontScene = new THREE.Scene();

//const renderScene = new THREE.RenderPass(scene, camera);
//composer.addPass(renderScene);

const bufferNum = 2;
let bufferIndex = 0;

const renderParams = {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  wrapS: THREE.ClampToEdgeWrapping,
  wrapT: THREE.ClampToEdgeWrapping,
  format: THREE.RGBAFormat
}

const frontBuffer = new THREE.WebGLRenderTarget(1, 1, renderParams);
const backgroundBuffer = new THREE.WebGLRenderTarget(1, 1, renderParams);
const frontBlurXBuffer = new THREE.WebGLRenderTarget(1, 1, renderParams);
const frontBlurYBuffer = new THREE.WebGLRenderTarget(1, 1, renderParams);

const wrapper = document.querySelector(".js-wrapper");
wrapper.appendChild(renderer.domElement);

backgroundCamera.position.copy(new THREE.Vector3(0, 0, 12));
backgroundCamera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new THREE.OrbitControls(backgroundCamera, renderer.domElement);

const sphereUniforms = {};
sphereUniforms.uTime = {
  type: "f",
  value: 0
};

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(5, 32, 32),
  new THREE.ShaderMaterial({
    vertexShader: sphereVertexShader,
    fragmentShader: sphereFragmentShader,
    uniforms: sphereUniforms,
  })
);
backgroundScene.add(sphere);

light.position.set(0, 0, 10);
backgroundScene.add(light);

const planeUniforms = {};

const frontCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10000);
const geometry = new THREE.PlaneGeometry(8, 4);
const material = new THREE.ShaderMaterial({
  vertexShader: frontSceneVertexShader,
  fragmentShader: frontSceneFragmentShader,
  uniforms: planeUniforms,
  transparent: true,
  side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(geometry, material);
plane.position.copy(new THREE.Vector3(0, 0, 0));
frontScene.add(plane);

const frontBlurCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const frontBlurScene = new THREE.Scene();

const frontBlurUniforms = {};
frontBlurUniforms.uWeights = {
  type: "fv1",
  value: []
};
frontBlurUniforms.uOffset = {
  type: "fv2",
  value: []
};
frontBlurUniforms.uMap = {
  type: "t",
  value: null
};

const frontBlurQuad = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    vertexShader: frontBlurVertexShader,
    fragmentShader: frontBlurFragmentShader,
    uniforms: frontBlurUniforms,
    side: THREE.DoubleSide
  })
);
frontBlurScene.add(frontBlurQuad);

const displayCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const displayScene = new THREE.Scene();

const displayUniforms = {};
displayUniforms.uBackgroundMap = {
  type: "t",
  value: null
};
displayUniforms.uFrontMap = {
  type: "t",
  value: null
};
displayUniforms.uFrontBlurXMap = {
  type: "t",
  value: null
};
displayUniforms.uFrontBlurYMap = {
  type: "t",
  value: null
};
displayUniforms.uResolution = {
  type: "v2",
  value: new THREE.Vector2()
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

  planeUniforms.uMap = {
    type: "t",
    value: texture
  };
}

//--------------------------------------------------------------------
// onWindowResize
//--------------------------------------------------------------------

function onWindowResize() {
  width = window.innerWidth;
  height = window.innerHeight;

  const aspect = width / height;

  const camFactor = 160;
  frontCamera.left = -width / camFactor;
  frontCamera.right = width / camFactor;
  frontCamera.top = height / camFactor;
  frontCamera.bottom = -height / camFactor;
  frontCamera.updateProjectionMatrix();
  
  backgroundCamera.aspect = aspect;
  backgroundCamera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
  composer.setSize(width, height);

  backgroundBuffer.setSize(width, height);
  frontBuffer.setSize(width, height);
  
  frontBlurXBuffer.setSize(width / guiData.blurBufferOptim, height / guiData.blurBufferOptim);
  frontBlurYBuffer.setSize(width / guiData.blurBufferOptim, height / guiData.blurBufferOptim);

  displayUniforms.uResolution.value.x = width;
  displayUniforms.uResolution.value.y = height;
}

//--------------------------------------------------------------------
// tick
//--------------------------------------------------------------------

function tick(time) {
  //sphere.position.x = Math.sin(time / 1000) * 5;
  controls.update();

  light.position.x = Math.sin(time / 1000) * 5;

  sphereUniforms.uTime.value = time / 1000;

  renderer.render(backgroundScene, backgroundCamera, backgroundBuffer, false);
  renderer.render(frontScene, frontCamera, frontBuffer, false);

  // blur

  frontBlurUniforms.uMap.value = frontBuffer.texture;

  const sampleNum = 15;
  
  const tmpWeights = [];
  const offsets = [];

  _.forEach(_.range(sampleNum), i => {
    const p = (i - (sampleNum - 1) * 0.5) * guiData.blurOffset;
    tmpWeights.push(Math.exp(-p * p / 2) / Math.sqrt(Math.PI * 2));
    offsets.push(p);
  });
  
  const total = _.reduce(tmpWeights, (sum, weight) => {
    return sum += weight;
  }, 0);

  frontBlurUniforms.uWeights.value = _.map(tmpWeights, weight => {
    return weight / total;
  });

  frontBlurUniforms.uOffset.value = _.map(offsets, offset => {
    return new THREE.Vector2(offset, 0.0);
  });

  renderer.render(frontBlurScene, frontBlurCamera, frontBlurXBuffer, false);
 
  frontBlurUniforms.uMap.value = frontBlurXBuffer.texture;
 
  frontBlurUniforms.uOffset.value = _.map(offsets, offset => {
    return new THREE.Vector2(0.0, offset);
  });

  renderer.render(frontBlurScene, frontBlurCamera, frontBlurYBuffer, false);

  // post process

  displayUniforms.uBackgroundMap.value = backgroundBuffer.texture;
  displayUniforms.uFrontMap.value = frontBuffer.texture;
  displayUniforms.uFrontBlurXMap.value = frontBlurXBuffer.texture;
  displayUniforms.uFrontBlurYMap.value = frontBlurYBuffer.texture;

  renderer.render(displayScene, displayCamera);
  
  //composer.render();
  
  requestAnimationFrame(tick);
}

//--------------------------------------------------------------------
// main
//--------------------------------------------------------------------

async function main() {
  await init();
  onWindowResize();
  window.addEventListener("resize", onWindowResize);
  requestAnimationFrame(tick);
}

main();
