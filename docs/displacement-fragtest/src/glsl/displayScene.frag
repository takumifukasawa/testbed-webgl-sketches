
precision mediump float;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d);

varying vec2 vUv;

uniform sampler2D uBackgroundMap;
uniform sampler2D uFrontMap;
uniform sampler2D uFrontBlurXMap;
uniform sampler2D uFrontBlurYMap;
uniform vec2 uResolution;
uniform float uTime;

void main() {
  vec2 texel = vec2(.02);
  //vec2 texel = uResolution / 40000.;
  vec4 frontColor = texture2D(uFrontMap, vUv);
  float frontRate = texel.x * frontColor.r;

  vec4 uFrontBlurXColor = texture2D(uFrontBlurXMap, vUv);
  vec4 uFrontBlurYColor = texture2D(uFrontBlurYMap, vUv);
  vec4 blurColor = uFrontBlurXColor + uFrontBlurYColor;

  //float blurIntensity = length(blurColor);
  //float noise = snoise2(vec2(blurIntensity * sin(uTime))) * .5 - 1.;
  //vec2 offset = vec2(noise * .05);

  vec4 destColor = texture2D(uBackgroundMap, vUv);
  //destColor += blurColor * .2;
  
  destColor += texture2D(uBackgroundMap, vUv) * blurColor.x;
  destColor += vec4(vec3((frontColor.x + blurColor.x) * .2), 1.);

  gl_FragColor = destColor;
}
