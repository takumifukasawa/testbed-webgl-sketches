
varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform float uLineScale;
uniform float uTime;

void main() {
  vec4 smpColor = texture2D(tDiffuse, vUv);
  //vec2 coord = gl_FragCoord.xy * (uLineScale + (1.5));
  vec2 coord = gl_FragCoord.xy * uLineScale;
  float f = sin(coord.x + coord.y);

  float d = length(normalize(smpColor.xyz));

  float s = .2;
  if(d > .7) {
    s = .3;
  } else if(d > .3) {
    s = .2;
  }

  gl_FragColor = vec4(smpColor.xyz * pow((d + s + f), 20.), 1.);
  //gl_FragColor = vec4(d, 1., 1., 1.);
}
