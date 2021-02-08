
import _ from "lodash";

const glslify = require("glslify");

const vertexShader = glslify.file("./../../glsl/lineTone.vert");
const fragmentShader = glslify.file("./../../glsl/lineTone.frag");

export default function createLineToneFilter() {
  const uniforms = {
    tDiffuse: {
      type: "t",
      value: null
    },
    uLineScale: {
      type: "f",
      value: 0.4
    },
    uTime: {
      type: "f",
      value: 0
    }
  };
  return { vertexShader, fragmentShader, uniforms };
}
