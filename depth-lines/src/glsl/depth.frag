
#pragma glslify: convRGBA = require(./convRGBA);
#pragma glslify: convCoord = require(./convCoord);

precision highp float;

varying vec2 vUv;
varying vec3 vPosition;

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float depthOffset;

const float near = .1;
const float far = 100.;
const float linearDepth = 1. / (far - near);

void main() {
  vec4 originalColor = texture2D(tDiffuse, vUv);
  float linear = linearDepth * length(vPosition);
  vec4 convColor = convRGBA(convCoord(linear, depthOffset));
  //gl_FragColor = vec4(normalize(vPosition), 1.);
  gl_FragColor = convColor;
  //gl_FragColor = originalColor;
}
