
vec4 convRGBA(float depth) {
  float r = depth;
  float g = fract(r * 255.);
  float b = fract(g * 255.);
  float a = fract(b * 255.);
  float coef = 1. / 255.;
  r -= g * coef;
  g -= b * coef;
  b -= a * coef;
  return vec4(r, g, b, a);
}

#pragma glslify: export(convRGBA);
