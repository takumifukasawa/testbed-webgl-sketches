
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

#define PI 3.1415;

varying vec2 v_uv;

uniform float u_time;

vec3 sample(float t, float time) {
  float angle = t * time * 2. * PI;
  vec2 rot = vec2(cos(angle), sin(angle));
  float z = t;
  return vec3(rot, z);
}

void main() {
  v_uv = uv;

  vec3 pos = position + (normal * snoise3(position * vec3(1.01) + u_time * .8) * 8.) + sample(position.z, 1.) * 1.;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
