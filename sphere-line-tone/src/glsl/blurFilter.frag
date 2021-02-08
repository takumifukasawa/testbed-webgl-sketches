
precision highp float;

varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float uTime;

#define SAMPLE_NUM 15
uniform float uWeights[SAMPLE_NUM];
uniform vec2 uOffset[SAMPLE_NUM];

void main() {
  vec4 destColor = vec4(0.);
  for(int i=0; i<SAMPLE_NUM; i++) {
    destColor += texture2D(tDiffuse, vUv + uOffset[i]) * uWeights[i];
  }
  gl_FragColor = destColor;
}

