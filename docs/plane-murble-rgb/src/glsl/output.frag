
precision highp float;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

varying vec2 v_uv;
varying vec3 v_mPosition;
varying vec3 v_normal;

uniform float u_time;
uniform sampler2D u_map;

void main() {
  vec4 destColor = texture2D(u_map, v_uv + u_time / 10.);

  vec3 normal = normalize(v_normal);
 
  vec3 pointLightDirR = normalize(v_mPosition.xyz - vec3(
    sin(u_time * .4),
    sin(u_time * .8),
    cos(u_time * 1.2)
  ) * 10.);
  vec3 pointLightDirG = normalize(v_mPosition.xyz - vec3(
    sin(u_time * 1.6),
    sin(u_time * 2.0),
    cos(u_time * 2.4)
  ) * 10.);
  vec3 pointLightDirB = normalize(v_mPosition.xyz - vec3(
    sin(u_time * 2.8),
    sin(u_time * 3.2),
    cos(u_time * 3.6)
  ) * 10.);

  vec3 directionalLightDir = normalize(vec3(0.) - vec3(0., 0., 10.));
  vec3 eyeDir = normalize(vec3(0.) - vec3(0., 0., 10.));
  
  vec3 halfEyeLightR = normalize(-pointLightDirR - eyeDir);
  vec3 halfEyeLightG = normalize(-pointLightDirG - eyeDir);
  vec3 halfEyeLightB = normalize(-pointLightDirB - eyeDir);

  float directionalDiffuse = clamp(dot(-directionalLightDir, normal), 0., 1.);
  float directionalIntensity = .0;

  float pointDiffuseR = clamp(dot(-pointLightDirR, normal), 0., 1.) * .8;
  float pointDiffuseG = clamp(dot(-pointLightDirG, normal), 0., 1.) * .8;
  float pointDiffuseB = clamp(dot(-pointLightDirB, normal), 0., 1.) * .8;
  
  float specularR = pow(clamp(dot(halfEyeLightR, normal), 0., 1.), 40.) * .4;
  float specularG = pow(clamp(dot(halfEyeLightG, normal), 0., 1.), 40.) * .4;
  float specularB = pow(clamp(dot(halfEyeLightB, normal), 0., 1.), 40.) * .4;
 
  vec3 diffuseColor = vec3(directionalDiffuse * directionalIntensity) + vec3(pointDiffuseR, pointDiffuseG, pointDiffuseB);
  vec3 specularColor = vec3(specularR, specularG, specularB);
  vec3 ambientColor = vec3(.0);

  gl_FragColor = vec4(diffuseColor, 1.) + vec4(specularColor, 1.) + vec4(ambientColor, 1.);

  //if(destColor.a < .9) discard;
}
