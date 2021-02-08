
#extension GL_OES_standard_derivatives : enable

precision highp float;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

varying vec2 v_uv;
varying vec3 v_position;

uniform float u_time;
uniform sampler2D u_map;

void main() {
  vec4 destColor = texture2D(u_map, v_uv + u_time / 10.);

  vec3 tangent = dFdx(v_position);
  vec3 bitangent = dFdy(v_position);

  vec3 normal = normalize(cross(normalize(tangent), normalize(bitangent)));
  vec3 lightDirection = normalize(vec3(0., 0., 10.));
  float diffuse = pow(clamp(dot(lightDirection, normal), .1, 1.), .8);

  gl_FragColor = vec4(0., 0., normal.z * diffuse, 1.);

  //if(destColor.a < .9) discard;
}
