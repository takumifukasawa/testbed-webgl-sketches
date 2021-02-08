
precision mediump float;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

varying vec2 v_uv;

uniform float u_time;

void main() {
  v_uv = uv;

  float height = snoise3(vec3(vec2(sin(normalize(position))), u_time / 4.));
  vec3 pos = position;
  //vec3 pos = position + normal * height;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
