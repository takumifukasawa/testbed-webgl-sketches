
precision mediump float;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

varying vec2 vUv;
varying vec3 vModelPosition;
varying vec3 vNormal;

uniform float uTime;

void main() {
  vec3 normal = normalize(vNormal);

  float z = 8.;
  float d = 15.;

  vec3 pointLightDirR = normalize(vModelPosition.xyz - vec3(
    sin(uTime * 1.) * d,
    cos(uTime * 1.) * d,
    z
  ));
  vec3 pointLightDirG = normalize(vModelPosition.xyz - vec3(
    sin(uTime * 2.) * d,
    cos(uTime * 2.) * d,
    z
  ));
  vec3 pointLightDirB = normalize(vModelPosition.xyz - vec3(
    sin(uTime * 3.) * d,
    cos(uTime * 3.) * d,
    z
  ));

  vec3 directionalLightDir = normalize(vec3(0.) - vec3(0., 0., 10.));
  vec3 eyeDir = normalize(vec3(0.) - vec3(0., 0., 10.));
  
  vec3 halfEyeLight = normalize(-pointLightDirR - eyeDir);

  float directionalDiffuse = clamp(dot(-directionalLightDir, normal), 0., 1.);
  float directionalIntensity = 0.;
  float pointDiffuseR = clamp(dot(-pointLightDirR, normal), 0., 1.) * 1.;
  float pointDiffuseG = clamp(dot(-pointLightDirG, normal), 0., 1.) * 1.;
  float pointDiffuseB = clamp(dot(-pointLightDirB, normal), 0., 1.) * 1.;
  float specular = pow(clamp(dot(halfEyeLight, normal), 0., 1.), 40.) * 0.;
 
  vec3 diffuseColor = vec3(directionalDiffuse * directionalIntensity) + vec3(pointDiffuseR, pointDiffuseG, pointDiffuseB);
  vec3 specularColor = vec3(specular);
  vec3 ambientColor = vec3(0.);

  gl_FragColor = vec4(diffuseColor, 1.) + vec4(specularColor, 1.) + vec4(ambientColor, 1.);

  //if(destColor.a < .9) discard;
}
