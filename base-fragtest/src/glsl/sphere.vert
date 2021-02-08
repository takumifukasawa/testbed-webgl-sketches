
precision mediump float;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

#define PI 3.1514;

varying vec2 vUv;
varying vec3 vModelPosition;
varying vec3 vNormal;

uniform float uTime;

vec3 sample(float t, float time) {
  float angle = t * time * 2. * PI;
  vec2 rot = vec2(cos(angle), sin(angle));
  float z = t;
  return vec3(rot, z);
}

void main() {
  vUv = uv;

  float height = snoise2(vec2(sin(normalize(position)) / (1.2 + sin(uTime * .6) * .6)) + uTime / 4.);
  vec3 pos = position;
  //vec3 pos = position + normal * height;

  vModelPosition = (modelMatrix * vec4(pos, 1.)).xyz;
  vNormal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
