type Color = [number, number, number];

const canvas = document.createElement('canvas');

function getPixels(imgURL: string) {
  const img = new Image();
  img.crossOrigin = 'anonymous';

  return new Promise<ImageData>((resolve, reject) => {
    img.onload = () => {
      const { height, width } = img;

      canvas.height = height;
      canvas.width = width;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return reject();

      ctx.drawImage(img, 0, 0);
      resolve(ctx.getImageData(0, 0, width, height));
    };

    img.onerror = () => {
      reject('Failed to load image');
    };

    img.src = imgURL;
  });
}

export default async function createPalette(imageURL: string, slice?: number) {
  const { data } = await getPixels(imageURL);
  const bins: Color[][] = Array.from({ length: 27 }, () => []);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const x = Math.round((r / 255) * 2);
    const y = Math.round((g / 255) * 2);
    const z = Math.round((b / 255) * 2);

    const idx = z * 3 * 3 + y * 3 + x;
    bins[idx].push([r, g, b]);
  }

  return bins
    .filter((b) => b.length > 0)
    .sort((a, b) => b.length - a.length)
    .map(
      (bin) =>
        bin
          .reduce(
            (acc, [r, g, b]) => {
              acc[0] += r;
              acc[1] += g;
              acc[2] += b;
              return acc;
            },
            [0, 0, 0] as Color
          )
          .map((v) => Math.round(v / bin.length)) as Color
    )
    .slice(0, slice);
}
