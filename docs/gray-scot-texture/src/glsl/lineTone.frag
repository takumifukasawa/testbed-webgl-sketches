
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d);

varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float uLineScale;
uniform float uTime;

void main() {
  vec4 smpColor = texture2D(tDiffuse, vUv);
  //vec2 coord = gl_FragCoord.xy * (uLineScale + (1.5));
  vec2 coord = gl_FragCoord.xy * uLineScale;

  float f = .2;
  float d = length(normalize(smpColor.xyz));

  float s = snoise4(vec4(smpColor.xyz * 2.2, uTime));

  gl_FragColor = vec4(smpColor.xyz * clamp(pow((d + f), .2), 0., 100.) * s, 1.);
}
