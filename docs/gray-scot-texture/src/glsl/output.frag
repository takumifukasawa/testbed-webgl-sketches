
precision mediump float;

varying vec2 v_uv;

uniform sampler2D u_map;

void main() {
  vec4 destColor = texture2D(u_map, v_uv);
  gl_FragColor = destColor;
}
