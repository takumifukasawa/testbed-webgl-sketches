
varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float uLineScale;
uniform float uTime;

void main() {
  vec4 smpColor = texture2D(tDiffuse, vUv);
  float d = length(normalize(smpColor.xyz)) + 1.;

  gl_FragColor = vec4(smpColor.xyz * pow(d, 20.), 1.);
}
