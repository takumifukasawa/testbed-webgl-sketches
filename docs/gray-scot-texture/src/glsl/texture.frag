
precision mediump float;

varying vec2 v_uv;

uniform float u_time;
uniform sampler2D u_map;
uniform vec2 u_offset[8];
uniform vec4 u_params;
uniform vec2 u_resolution;
uniform vec2 u_brush;

vec4 laplacian5(sampler2D tex, vec2 uv, vec2 size) {
  return vec4(
    texture2D(tex, uv + vec2(-size.x, 0.))
    + texture2D(tex, uv + vec2(size.x, 0.))
    - 4. * texture2D(tex, uv)
    + texture2D(tex, uv + vec2(0., -size.y))
    + texture2D(tex, uv + vec2(0., size.y))
  );
}

vec4 laplacian9(sampler2D tex, vec2 uv, vec2 size) {
  return vec4(
    texture2D(tex, uv + vec2(-size.x, -size.y))
    + texture2D(tex, uv + vec2(0., -size.y))
    + texture2D(tex, uv + vec2(size.x, -size.y))
    + texture2D(tex, uv + vec2(-size.x, 0.))
    - 8. * texture2D(tex, uv)
    + texture2D(tex, uv + vec2(size.x, 0.))
    + texture2D(tex, uv + vec2(-size.x, size.y))
    + texture2D(tex, uv + vec2(0., size.y))
    + texture2D(tex, uv + vec2(size.x, size.y))
  );
}

void main() {
  /*
  float f = u_params.x;
  float k = u_params.y;
  vec2 texel = vec2(1.) / u_resolution;
  vec4 v = texture2D(u_map, v_uv);
  vec2 lv = laplacian5(u_map, v_uv, texel).xy;
  float xyy = v.x * v.y * v.y;
  vec2 dv = vec2(
    0.2097 * lv.x - xyy + f * (1. - v.x),
    0.105 * lv.y + xyy - (f + k) * v.y
  );
  v.xy += dv * u_time;

  gl_FragColor = v;
  */

  /*
  //if(u_brush.x < 5.) {
  //  gl_FragColor = vec4(1., 0., 0., 1.);
  //  return;
  //}

  float feed = u_params.x;
  float kill = u_params.y;

  vec2 texel = vec2(1.) / u_resolution;
  float stepX = texel.x;
  float stepY = texel.y;

  vec2 uv = texture2D(u_map, v_uv).xy;
  vec2 uv0 = texture2D(u_map, v_uv + vec2(-stepX, 0.)).xy;
  vec2 uv1 = texture2D(u_map, v_uv + vec2(stepX, 0.)).xy;
  vec2 uv2 = texture2D(u_map, v_uv + vec2(0., -stepY)).xy;
  vec2 uv3 = texture2D(u_map, v_uv + vec2(0., stepY)).xy;

  vec2 lapl = (uv0 + uv1 + uv2 + uv3 - uv * 4.);
  float xyy = uv.x * uv.y * uv.y;
  float du = 0.2097 * lapl.x - xyy + feed * (1. - uv.x);
  float dv = 0.105 * lapl.y + xyy - (feed + kill) * uv.y;
  vec2 dest = uv + vec2(du, dv) * u_time* 1.;

  if(u_brush.x > 0.) {
    vec2 diff = (v_uv - u_brush) / texel;
    float dist = dot(diff, diff);
    if(dist < 5.) {
      dest.y = .9;
    }
  }

  gl_FragColor = vec4(dest, 0., 1.);
  */

  /*
  float feed = u_params.x;
  float kill = u_params.y;
  float currU = u_params.z;
  float currV = u_params.w;

  vec2 cp = texture2D(u_map, v_uv).xy;

  vec2 lapl = vec2(0.);
  for(int i=0; i<8; i++) {
    vec2 duv = v_uv + u_offset[i];
    lapl = lapl + texture2D(u_map, duv).xy;
  }
  lapl = lapl * (1. / 8.) - cp;

  vec2 dest = vec2(0.);

  float xxy = cp.x * cp.x * cp.y;

  dest.x = cp.x + xxy - (feed + kill) * cp.x + currU * lapl.x;
  dest.y = cp.y - xxy + feed * (1. - cp.y) * currV * lapl.y;

  gl_FragColor = vec4(clamp(dest, 0., 1.).xy, 0., 1.);
  */

  float feed = u_params.x;
  float kill = u_params.y;
  float du = u_params.z;
  float dv = u_params.w;

  float currU = texture2D(u_map, v_uv).r;
  float currV = texture2D(u_map, v_uv).g;

  vec2 texel = vec2(1.) / u_resolution;

  //vec2 laplacian = laplacian5(u_map, v_uv, texel).xy;
  vec2 laplacian = laplacian9(u_map, v_uv, texel).xy;
 
  vec2 cp = texture2D(u_map, v_uv).xy;
  float reactionRate = cp.x * cp.x * cp.y;

  float duDt = du * laplacian.x - reactionRate + feed * (1. - currU);
  float dvDt = dv * laplacian.y + reactionRate - kill * currV;

  float delta = mod(u_time / 10., 1.);

  vec2 dest = vec2(
    clamp(currU + delta * duDt, 0., 1.),
    clamp(currV + delta * duDt, 0., 1.)
  );

  gl_FragColor = vec4(dest, 0., 1.);
}
