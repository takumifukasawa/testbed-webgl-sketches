
precision mediump float;

varying float vTransition;
varying vec2 vUv;
varying vec3 vColor;
varying float vThick;

uniform float uTime;

void main() {
  float a = clamp(1. - vTransition, 0., 1.);
  
  vec2 p = vUv - .5;

  float border = 0.;
  border += sign(clamp((abs(p.x) - vThick), 0., 1.));
  border += sign(clamp((abs(p.y) - vThick), 0., 1.));
  border = clamp(border, 0., 1.);

  if(border < .9) {
    discard;
  }

  vec4 destColor = vec4(vColor.xyz, a * border);
  gl_FragColor = destColor;
}

