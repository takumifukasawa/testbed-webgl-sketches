
// 3d-assets
import resetMesh from './resetMesh';
import createPolyMesh from './createPolyMesh';

export default function create(polyNum) {
  const materialOpts = {
    transparent: true,
    alphaTest: 0.01,
    depthTest: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  };

  const mesh = createPolyMesh(polyNum, materialOpts);

  return resetMesh(mesh);
};
