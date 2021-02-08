
const glslify = require("glslify");

const vertexShader = glslify.file("./../../glsl/blurFilter.vert");
const fragmentShader = glslify.file("./../../glsl/blurFilter.frag");

export default function createBlurFilter() {
  const uniforms = {
    tDiffuse: {
      type: "t",
      value: null
    },
    uTime: {
      type: "f",
      value: 0
    }
  };

  return { uniforms, vertexShader, fragmentShader };
}
