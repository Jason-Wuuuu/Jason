// Profile picture: any uploaded image, shown pixelated. The pixel style is one of three presets, chosen in the admin.
// crop = [x, y, size] as fractions of the image's shorter side; width = display px on desktop / tablet / phone
// (chosen so each pixel is a whole number of screen pixels where possible).
export const AVATAR_STYLES = {
  "44-full": { label: "Chunky: 44px, whole picture", n: 44, crop: [0, 0, 1], width: [220, 132, 88] },
  "44-tight": { label: "Balanced: 44px, tighter crop (recommended)", n: 44, crop: [0.107, 0.06, 0.786], width: [220, 132, 88] },
  "64-tight": { label: "Fine: 64px, tighter crop", n: 64, crop: [0.107, 0.06, 0.786], width: [192, 128, 96] },
};
export const DEFAULT_STYLE = "44-tight";

// Downscales `img` to n×n with smoothing. A cut-out (transparent corners, like a memoji sticker) keeps its
// silhouette on a transparent background. Rounding, if any, is done by CSS (the "round" frame).
export function pixelate(img, n, [cx, cy, cs]) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = n;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  const s = Math.min(img.naturalWidth, img.naturalHeight);
  const ox = (img.naturalWidth - s) / 2, oy = (img.naturalHeight - s) / 2;
  ctx.drawImage(img, ox + cx * s, oy + cy * s, cs * s, cs * s, 0, 0, n, n);
  const data = ctx.getImageData(0, 0, n, n);
  const alpha = (x, y) => data.data[(y * n + x) * 4 + 3];
  const cutout = [[0, 0], [n - 1, 0], [0, n - 1], [n - 1, n - 1]].every(([x, y]) => alpha(x, y) < 32);
  if (cutout) for (let i = 3; i < data.data.length; i += 4) data.data[i] = data.data[i] >= 128 ? 255 : 0; // crisp pixel edges, not soft ones
  ctx.putImageData(data, 0, 0);
  return canvas;
}
