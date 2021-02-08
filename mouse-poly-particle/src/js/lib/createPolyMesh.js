
import _ from 'lodash';

const glslify = require("glslify");

const vertexShader = glslify.file("./../../glsl/particle.vert");
const fragmentShader = glslify.file("./../../glsl/particle.frag");

export default (polyNum, materialOpts) => {

  const wrapperMesh = new THREE.Object3D();

  wrapperMesh.polyNum = polyNum;
  wrapperMesh.polyIndex = 0;

  const geometry = new THREE.BufferGeometry();

  const indices = new Uint16Array(_.flatMap(_.range(polyNum), (i) => {
    const index = i * 4;
    const unit = [
      index,
      index + 1,
      index + 2,
      index + 0,
      index + 2,
      index + 3,
    ];
    return unit;
  }));

  const positions = new Float32Array(_.flatMap(_.range(polyNum * 4), () => {
    const unit = [0, 0, 0];
    return unit;
  }));

  const colors = new Float32Array(_.flatMap(_.range(polyNum * 4), () => {
    const unit = [0, 0, 0];
    return unit;
  }));

  const uvs = new Float32Array(_.flatMap(_.range(polyNum), () => {
    const unit = [
      0, 0,
      1, 0,
      1, 1,
      0, 1,
    ];
    return unit;
  }));

  const times = new Float32Array(_.flatMap(_.range(polyNum), () => {
    const unit = [0, 0, 0, 0];
    return unit;
  }));

  const durations = new Float32Array(_.flatMap(_.range(polyNum), () => {
    const unit = [0, 0, 0, 0];
    return unit;
  }));

  const scales = new Float32Array(_.flatMap(_.range(polyNum * 2), () => {
    const unit = [0, 0, 0, 0];
    return unit;
  }));

  const opacities = new Float32Array(_.flatMap(_.range(polyNum), () => {
    const unit = [0, 0, 0, 0];
    return unit;
  }));

  const positionUnits = new Float32Array(_.flatMap(_.range(polyNum), () => {
    const unit = [
      -1, -1,
      1, -1,
      1, 1,
      -1, 1,
    ];
    return unit;
  }));

  const thicks = new Float32Array(_.flatMap(_.range(polyNum), () => {
    const unit = [0, 0, 0, 0];
    return unit;
  }));

  // for debug
  // console.log(polyNum, indices, positions, uvs, times, durations, scales, positionUnits)

  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.addAttribute('time', new THREE.BufferAttribute(times, 1));
  geometry.addAttribute('duration', new THREE.BufferAttribute(durations, 1));
  geometry.addAttribute('scale', new THREE.BufferAttribute(scales, 2));
  geometry.addAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
  geometry.addAttribute('positionUnit', new THREE.BufferAttribute(positionUnits, 2));
  
  // custom
  geometry.addAttribute('thick', new THREE.BufferAttribute(thicks, 1));

  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  const uniforms = {
    uTime: {
      type: 'f',
      value: 0,
    },
  };

  const material = new THREE.RawShaderMaterial(_.assign({
    vertexShader,
    fragmentShader,
    uniforms,
  }, materialOpts));

  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;

  wrapperMesh.add(mesh);

  wrapperMesh.update = (time) => {
    mesh.material.uniforms.uTime.needsUpdate = true;
    mesh.material.uniforms.uTime.value = time;

    mesh.geometry.dynamic = true;

    mesh.geometry.attributes.position.needsUpdate = true;
    mesh.geometry.attributes.color.needsUpdate = true;
    mesh.geometry.attributes.time.needsUpdate = true;
    mesh.geometry.attributes.duration.needsUpdate = true;
    mesh.geometry.attributes.scale.needsUpdate = true;
    mesh.geometry.attributes.opacity.needsUpdate = true;
    
    mesh.geometry.attributes.thick.needsUpdate = true;
  };

  wrapperMesh.addPoly = ({
    position,
    color,
    scale,
    opacity,
    duration,
    time,
    thick
  }) => {
    time = time != null ? time : window.performance.now() / 1000;

    duration = duration != null ? duration : 1;

    color = color != null ? color : new THREE.Vector3(1, 1, 1);

    thick = thick != null ? thick : 0;

    // polygon index
    const index = (wrapperMesh.polyIndex % polyNum) * 4;

    _.forEach(_.range(4), (i) => {
      const pi = index * 3 + i * 3;
      positions[pi] = position.x;
      positions[pi + 1] = position.y;
      positions[pi + 2] = position.z;

      const ci = index * 3 + i * 3;
      colors[ci] = color.x;
      colors[ci + 1] = color.y;
      colors[ci + 2] = color.z;

      const si = index * 2 + i * 2;
      scales[si] = scale.x;
      scales[si + 1] = scale.y;

      opacities[index + i] = opacity;

      times[index + i] = time;

      durations[index + i] = duration;
      
      thicks[index + i] = thick;
    });

    wrapperMesh.polyIndex += 1;
  };

  /*
  wrapperMesh.updateByIndex = ({
    polyIndex,
    position,
    scale,
    opacity,
  }) => {
    // polygon index
    const index = (polyIndex % polyNum) * 4;

    _.forEach(_.range(4), (i) => {
      if (position != null) {
        const pi = index * 3 + i * 3;
        positions[pi] = position.x;
        positions[pi + 1] = position.y;
        positions[pi + 2] = position.z;
      }

      if (opacity != null) {
        opacities[index + i] = opacity;
      }

      if (scale != null) {
        scales[index + i] = scale;
      }
    });
  };
  */

  return wrapperMesh;
};
