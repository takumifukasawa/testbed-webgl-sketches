
export default function createTHREE() {
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    preserveDrawingBuffer: false,
    alpha: true,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: true,
  });
  const ratio = Math.min(1.75, window.devicePixelRatio);
  renderer.setPixelRatio(ratio);

  const camera = new THREE.PerspectiveCamera(
    60,
    1,
    0.1,
    10000
  );

  const scene = new THREE.Scene();

  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  onWindowResize();
  window.addEventListener("resize", onWindowResize);

  return {
    renderer, scene, camera
  };
}
