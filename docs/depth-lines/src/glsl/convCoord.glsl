
float convCoord(float depth, float offset) {
  float d = clamp(depth + offset, 0., 1.);
  if(d > .6) {
    d = 2.5 * (1. - d);
  } else if(d > .4) {
    d = 1.;
  } else {
    d * 2.5;
  }
  return d;
}

#pragma glslify: export(convCoord);
