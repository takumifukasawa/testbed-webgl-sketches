
precision mediump float;

attribute vec3 position;
attribute vec3 color;
attribute vec2 uv;
attribute vec2 positionUnit;
attribute vec2 scale;
attribute float time;
attribute float duration;
attribute float thick;

varying float vTransition;
varying vec2 vUv;
varying vec3 vColor;
varying float vThick;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float uTime;

void main() {
  vUv = uv;
  vColor = color;
  vThick = thick;

  float transition = clamp((uTime - time) / duration, 0., 1.);
  vTransition = transition;

  vec4 _position = modelViewMatrix * vec4(position, 1.);
  
  vec2 size = scale * transition;
  _position.xy += vec2(positionUnit.x * size.x, positionUnit.y * size.y);

  gl_Position = projectionMatrix * _position;
}
