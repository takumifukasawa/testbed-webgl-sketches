
import _ from "lodash";

const glslify = require("glslify");

const blurVertexShader = glslify.file("./../../glsl/blurFilter.vert");
const blurFragmentShader = glslify.file("./../../glsl/blurFilter.frag");

const brightVertexShader = glslify.file("./../../glsl/bright.vert");
const brightFragmentShader = glslify.file("./../../glsl/bright.frag");

const bloomVertexShader = glslify.file("./../../glsl/bloomFilter.vert");
const bloomFragmentShader = glslify.file("./../../glsl/bloomFilter.frag");

export default function createBloomFilter() {
  const pass = function() {
    THREE.Pass.call(this);

    const sampleNum = 15;
    const d = 0.005;

    const tmpWeights = [];
    this.offsets = [];

    _.forEach(_.range(sampleNum), i => {
      const p = (i - (sampleNum - 1) * 0.5) * d;
      tmpWeights.push(Math.exp(-p * p / 2) / Math.sqrt(Math.PI * 2));
      this.offsets.push(p);
    });

    const total = _.reduce(tmpWeights, (sum, weight) => {
      return sum += weight;
    }, 0);

    this.weights = _.map(tmpWeights, weight => {
      return weight / total;
    });

    const rendererParams = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      //minFilter: THREE.NearestFilter,
      //magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      //wrapS: THREE.ClampToEdgeWrapping,
      //wrapT: THREE.ClampToEdgeWrapping,
    };

    this.blurTargetX = new THREE.WebGLRenderTarget(0, 0, rendererParams);
    this.blurTargetY = new THREE.WebGLRenderTarget(0, 0, rendererParams);
    this.brightTarget = new THREE.WebGLRenderTarget(0, 0, rendererParams);

    this.blurUniforms = {
      tDiffuse: {
        type: "t",
        value: null
      },
      uTime: {
        type: "f",
        value: 0
      },
      uWeights: {
        type: "fv1",
        value: this.weights
      },
      uOffset: {
        type: "v2v",
        value: []
      }
    };
    this.blurMaterial = new THREE.ShaderMaterial({
      vertexShader: blurVertexShader,
      fragmentShader: blurFragmentShader,
      uniforms: this.blurUniforms,
      depthTest: false,
      depthWrite: false
    });

    this.brightUniforms = {
      tDiffuse: {
        type: "t",
        value: null
      },
      minBright: {
        type: "f",
        value: 0.6
      }
    };
    this.brightMaterial = new THREE.ShaderMaterial({
      vertexShader: brightVertexShader,
      fragmentShader: brightFragmentShader,
      uniforms: this.brightUniforms,
      depthTest: false,
      depthWrite: false
    });

    this.bloomUniforms = {
      originalTexture: {
        type: "t",
        value: null
      },
      blurTexture: {
        type: "t",
        value: null
      },
      toneScale: {
        type: "f",
        value: 0.8
      }
    };
    this.bloomMaterial = new THREE.ShaderMaterial({
      vertexShader: bloomVertexShader,
      fragmentShader: bloomFragmentShader,
      uniforms: this.bloomUniforms,
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
      const div = 32;
      this.blurTargetX.setSize(width / div, height / div);
      this.blurTargetY.setSize(width / div, height / div);
      this.brightTarget.setSize(width / div, height / div);
    },

    render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
      const oldAutoClear = renderer.autoClear;
     
      // bright

      this.quad.material = this.brightMaterial;
      
      this.brightUniforms.tDiffuse.value = readBuffer.texture;

      renderer.render(this.scene, this.camera, this.brightTarget, false);

      // blurX
  
      this.quad.material = this.blurMaterial;
      
      this.blurUniforms.tDiffuse.value = this.brightTarget.texture;
      this.blurUniforms.uOffset.value = _.map(this.offsets, offset => {
        return new THREE.Vector2(offset, 0.0);
      });
      renderer.render(this.scene, this.camera, this.blurTargetX, false);

      // blurY

      this.blurUniforms.tDiffuse.value = this.blurTargetX.texture;
      this.blurUniforms.uOffset.value = _.map(this.offsets, offset => {
        return new THREE.Vector2(0.0, offset);
      });
      renderer.render(this.scene, this.camera, this.blurTargetY, false);

      // bloom

      this.quad.material = this.bloomMaterial;

      this.bloomUniforms.originalTexture.value = readBuffer.texture;
      this.bloomUniforms.blurTexture.value = this.blurTargetY.texture;

      if(this.renderToScreen) {
        renderer.render(this.scene, this.camera, null, this.clear);
      } else {
        renderer.render(this.scene, this.camera, writeBuffer, this.clear);
      }

      renderer.autoClear = oldAutoClear;
    }
  })

  return pass;
}
