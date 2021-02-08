
precision mediump float;

varying vec2 vUv;

uniform sampler2D uMap;

void main() {
  vec4 destColor = texture2D(uMap, vUv);
  gl_FragColor = destColor;
}
