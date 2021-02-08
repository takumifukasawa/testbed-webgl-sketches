
varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float minBright;

void main() {
  vec4 smpColor = texture2D(tDiffuse, vUv);
  vec3 texel = max(vec3(0.), (smpColor - minBright).rgb);
  gl_FragColor = vec4(texel, 1.);
}

