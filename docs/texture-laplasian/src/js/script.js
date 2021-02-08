
import _ from "lodash";
import createTHREE from "./lib/createTHREE";
import createBorderTexture from "./lib/createBorderTexture";
import loadTexture from "./lib/loadTexture";

let width, height;

const glslify = require("glslify");

const standardVertexShader = glslify.file("./../glsl/standardVert.vert");
const textureFragmentShader = glslify.file("./../glsl/texture.frag");

const vertexShader = glslify.file("./../glsl/output.vert");
const fragmentShader = glslify.file("./../glsl/output.frag");

const { renderer, composer, scene, camera } = createTHREE();
renderer.setClearColor(0x000000);

//const renderScene = new THREE.RenderPass(scene, camera);
//composer.addPass(renderScene);

const bufferNum = 2;
let bufferIndex = 0;

const renderParams = {
  minFilter: THREE.LinearFilter,
  magFilter: THREE.LinearFilter,
  wrapS: THREE.RepeatWrapping,
  wrapT: THREE.RepeatWrapping,
  format: THREE.RGBAFormat
}

const renderBuffer = _.map(_.range(bufferNum), i => {
  return new THREE.WebGLRenderTarget(512, 512, renderParams);
});

const textureCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const textureScene = new THREE.Scene();

const wrapper = document.querySelector(".js-wrapper");
wrapper.appendChild(renderer.domElement);

camera.position.copy(new THREE.Vector3(0, 0, 12));
camera.lookAt(new THREE.Vector3(0, 0, 0));

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const uniforms = {};
const textureUniforms = {};
let sphere = null;
let baseTexture = null;

async function init() {
  //const texture = await loadTexture("./assets/img/pic.jpg");
  const texture = await loadTexture("./assets/img/pic2.jpg");
  baseTexture = texture;

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  textureUniforms.u_map = {
    type: "t",
    value: texture
  };
  textureUniforms.u_time = {
    type: "f",
    value: 0
  };
  textureUniforms.u_brush = {
    type: "v2",
    value: new THREE.Vector2(.5, .5)
  };

  const offset = .04;
  textureUniforms.u_offset = {
    type: "v2v",
    value: [
      new THREE.Vector2(-offset, offset),
      new THREE.Vector2(0, offset),
      new THREE.Vector2(offset, offset),
      new THREE.Vector2(-offset, 0),
      //new THREE.Vector2(0, 0),
      new THREE.Vector2(offset, 0),
      new THREE.Vector2(-offset, -offset),
      new THREE.Vector2(0, -offset),
      new THREE.Vector2(offset, -offset),
    ]
  };

  textureUniforms.u_params = {
    type: "v4",
    value: new THREE.Vector4(0.023, 0.079, 0.095, 0.03) // f, k, du, dv
  };
  textureUniforms.u_resolution = {
    type: "v2",
    value: new THREE.Vector2()
  };

  const textureQuad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      vertexShader: standardVertexShader,
      fragmentShader: textureFragmentShader,
      uniforms: textureUniforms,
      side: THREE.DoubleSide
    })
  );
  textureScene.add(textureQuad);

  uniforms.u_map = {
    type: "f",
    value: null
  };

  const geometry = new THREE.PlaneGeometry(8, 8);
  //const geometry = new THREE.SphereBufferGeometry(4, 32, 32);
  const material = new THREE.ShaderMaterial({
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

function onMouseMove(e) {
  textureUniforms.u_brush.value.x = e.clientX / width;
  textureUniforms.u_brush.value.y = e.clientY / height;
}

function onWindowResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  textureUniforms.u_resolution.value.x = width;
  textureUniforms.u_resolution.value.y = height;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);
}

function tick(time) {
  //sphere.rotation.y = time / 4000;
  controls.update();

  textureUniforms.u_time.value = (time / 1000);

  const buffer = renderBuffer[bufferIndex];

  renderer.render(textureScene, textureCamera, buffer, true);
  
  textureUniforms.u_map.value = baseTexture;
  //textureUniforms.u_map.value = buffer.texture;

  textureUniforms.u_brush.value = new THREE.Vector2(-10, -10);

  uniforms.u_map.value = buffer.texture;

  renderer.render(scene, camera);

  bufferIndex += 1;
  if(bufferIndex > renderBuffer.length - 1) {
    bufferIndex = 0;
  }

  //composer.render();
  
  requestAnimationFrame(tick);
}

async function main() {
  await init();
  onWindowResize();
  window.addEventListener("resize", onWindowResize);
  window.addEventListener("mousemove", onMouseMove);
  requestAnimationFrame(tick);
}

main();
