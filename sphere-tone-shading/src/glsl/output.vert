
precision highp float;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

#define PI 3.1514;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec2 v_uv;
varying vec3 v_mPosition;
varying vec3 v_normal;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float u_time;

vec3 sample(float t, float time) {
  float angle = t * time * 2. * PI;
  vec2 rot = vec2(cos(angle), sin(angle));
  float z = t;
  return vec3(rot, z);
}

void main() {
  v_uv = uv;

  float height = snoise3(vec3(vec2(sin(normalize(position))), u_time / 4.));
  //vec3 pos = position;
  vec3 pos = position + normal * height;

  v_mPosition = (modelMatrix * vec4(pos, 1.)).xyz;
  v_normal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
