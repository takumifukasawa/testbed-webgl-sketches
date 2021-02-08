
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

varying vec2 v_uv;

uniform sampler2D u_map;

void main() {
  vec4 destColor = texture2D(u_map, v_uv);
  // gl_FragColor = destColor;
  if(destColor.a < .9) discard;
  
  gl_FragColor = vec4(0. + v_uv.x * .6, .6, .9, 1.);

  if(gl_FragColor.a < .9) {
    discard;
  }
}
