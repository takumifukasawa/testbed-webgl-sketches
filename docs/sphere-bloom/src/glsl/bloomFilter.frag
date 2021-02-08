
precision highp float;

varying vec2 vUv;

uniform sampler2D originalTexture;
uniform sampler2D blurTexture;
uniform float toneScale;

void main() {
  vec4 destColor = vec4(0.);
  vec4 originalColor = texture2D(originalTexture, vUv);
  vec4 blurColor = texture2D(blurTexture, vUv);
  destColor += originalColor * toneScale;
  destColor += blurColor;
  gl_FragColor = destColor;
}
