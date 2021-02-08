import _ from 'lodash';

export default function resetMesh(mesh) {
  if (mesh.actions) {
    _.forEach(mesh.actions, (action) => {
      action.setEffectiveWeight(0);
      action.setEffectiveTimeScale(1);
      action.stop();
    });
  }

  if (mesh.mixer) {
    mesh.mixer.time = 0;
    mesh.mixer.timeScale = 1;
  }

  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  mesh.scale.set(1, 1, 1);

  mesh.visible = true;

  return mesh;
}
