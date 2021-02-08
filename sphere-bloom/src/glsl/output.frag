
#extension GL_OES_standard_derivatives : enable

precision highp float;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

varying vec2 v_uv;
varying vec3 v_position;
varying vec3 v_mPosition;

uniform float u_time;
uniform sampler2D u_map;

void main() {
  vec4 destColor = texture2D(u_map, v_uv + u_time / 10.);

  vec3 tangent = dFdx(v_position);
  vec3 bitangent = dFdy(v_position);

  vec3 normal = normalize(cross(normalize(tangent), normalize(bitangent)));
 
  vec3 pointLightDirR = normalize(v_mPosition.xyz - vec3(
    sin(u_time * 4.),
    sin(u_time * 3.),
    cos(u_time * 5.)
  ) * 10.);
  vec3 pointLightDirG = normalize(v_mPosition.xyz - vec3(
    sin(u_time * 5.),
    sin(u_time * 4.),
    cos(u_time * 3.)
  ) * 10.);
  vec3 pointLightDirB = normalize(v_mPosition.xyz - vec3(
    sin(u_time * 3.),
    sin(u_time * 5.),
    cos(u_time * 4.)
  ) * 10.);

  vec3 directionalLightDir = normalize(vec3(0.) - vec3(0., 0., 10.));
  vec3 eyeDir = normalize(vec3(0.) - vec3(0., 0., 10.));
  
  vec3 halfEyeLight = normalize(-pointLightDirR - eyeDir);

  float directionalDiffuse = clamp(dot(-directionalLightDir, normal), 0., 1.);
  float directionalIntensity = .1;
  float pointDiffuseR = clamp(dot(-pointLightDirR, normal), 0., 1.) * 1.;
  float pointDiffuseG = clamp(dot(-pointLightDirG, normal), 0., 1.) * 1.;
  float pointDiffuseB = clamp(dot(-pointLightDirB, normal), 0., 1.) * 1.;
  float specular = pow(clamp(dot(halfEyeLight, normal), 0., 1.), 40.);
 
  vec3 diffuseColor = vec3(directionalDiffuse * directionalIntensity) + vec3(pointDiffuseR, pointDiffuseG, pointDiffuseB);
  vec3 specularColor = vec3(specular);
  vec3 ambientColor = vec3(.1);

  gl_FragColor = vec4(diffuseColor, 1.) + vec4(specularColor, 1.) + vec4(ambientColor, 1.);
  //gl_FragColor = vec4(diffuseColor, 1.) + vec4(specularColor, 1.) + vec4(ambientColor, 1.);

  //if(destColor.a < .9) discard;
}
