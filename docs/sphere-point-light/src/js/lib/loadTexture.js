
export default async function loadTexture(src) {
  function loader() {
    return new Promise(resolve => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(src, (texture) => {
        texture.needsUpdate = true;
        resolve(texture);
      });
    });
  }

  return await loader();
}
