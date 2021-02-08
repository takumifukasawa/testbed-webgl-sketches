
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

#define PI 3.1415;

varying vec2 v_uv;
varying float v_height;

uniform float u_time;

vec3 sample(float t, float time) {
  float angle = t * time * 2. * PI;
  vec2 rot = vec2(cos(angle), sin(angle));
  float z = t;
  return vec3(rot, z);
}

void main() {
  v_uv = uv;

  float height = pow(snoise2(vec2(sin(normalize(position)) / 1.8) + u_time / 1.4), 1.2);
  vec3 pos = position + normal * height;

  v_height = height;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
