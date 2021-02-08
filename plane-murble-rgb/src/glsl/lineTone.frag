
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d);

varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float uLineScale;
uniform float uTime;

void main() {
  vec4 smpColor = texture2D(tDiffuse, vUv);
  vec2 coord = gl_FragCoord.xy * uLineScale;

  float d = length(normalize(smpColor.xyz));

  float s = abs(sin(snoise4(vec4(smpColor.xyz, uTime / 4.))));

  float a = clamp(pow(d, .1), 0., 1.) * s;

  float t = clamp((1. + clamp(floor(a / .2), 0., 4.)) * .3, 0., 1.);

  gl_FragColor = vec4(smpColor.xyz * t, 1.);
}
