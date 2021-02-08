
import _ from "lodash";

const glslify = require("glslify");

const vertexShader = glslify.file("./../../glsl/depth.vert");
const fragmentShader = glslify.file("./../../glsl/depth.frag");

export default function createBloomFilter(scene, camera) {
  
  const pass = function() {
    THREE.Pass.call(this);

    this.baseScene = scene;
    this.baseCamera = camera;

    const depthTexture = new THREE.DepthTexture();
    depthTexture.type = THREE.UnsignedShortType;

    const rendererParams = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      generateMipMaps: false,
      sencilBuffer: false,
      depthBuffer: false,
      depthTexture,
    };

    this.depthTarget = new THREE.WebGLRenderTarget(0, 0, rendererParams);

    this.uniforms = {
      tDiffuse: {
        type: "t",
        value: null
      },
      tDepth: {
        type: "t",
        value: null
      },
      depthOffset: {
        type: "f",
        value: 10.
      }
    };
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      depthTest: false,
      depthWrite: false
    });

    this.needsSwap = false;

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new THREE.Scene();

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), null);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
  }

  pass.prototype = Object.assign(Object.create(THREE.Pass.prototype), {
    constructor: pass,

    setSize: function(width, height) {
      this.depthTarget.setSize(width, height);
    },

    render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
      const oldAutoClear = renderer.autoClear;
     
      this.quad.material = this.material;
      
      renderer.render(this.baseScene, this.baseCamera, this.depthTarget, false);
 
      this.uniforms.tDiffuse.value = readBuffer.texture;
      this.uniforms.tDepth.value = this.depthTarget.depthTexture;
    
      if(this.renderToScreen) {
        renderer.render(this.scene, this.camera, null, this.clear);
      } else {
        renderer.render(this.scene, this.camera, writeBuffer, this.clear);
      }
    }
  })

  return pass;
}
