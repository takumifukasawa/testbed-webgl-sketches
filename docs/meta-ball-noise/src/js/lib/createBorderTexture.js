
export default async function createBorderTexture(width, height, num, direction = "y") {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
 
  ctx.beginPath();
  //ctx.fillStyle = "#000000";
  //ctx.fillRect(0, 0, width, height);
   
  const max = num * 2 - 1;

  const w = direction === "y"
    ? width
    : width / max;

  const h = direction === "y"
    ? height / max
    : height;

  ctx.fillStyle = "#ffffff";
  
  for(let i=0; i<num; i++) {
    const index = i * 2;

    const x = direction === "y"
      ? 0
      : width / max * index;
    const y = direction === "y"
      ? height / max * index
      : 0;

    ctx.fillRect(x, y, w, h);
  }

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return Promise.resolve(texture);
}
