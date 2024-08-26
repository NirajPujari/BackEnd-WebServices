import { ImageData } from "canvas";
export function applyGrayscale(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }
}
export function applySepia(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    // Apply sepia formula
    const sepiaRed = 0.393 * red + 0.769 * green + 0.189 * blue;
    const sepiaGreen = 0.349 * red + 0.686 * green + 0.168 * blue;
    const sepiaBlue = 0.272 * red + 0.534 * green + 0.131 * blue;

    data[i] = Math.min(255, sepiaRed);
    data[i + 1] = Math.min(255, sepiaGreen);
    data[i + 2] = Math.min(255, sepiaBlue);
  }
}
export function applyContrast(data: Uint8ClampedArray) {
  var factor = 4;
  for (let i = 0; i < data.length; i += 4) {
    data[i] = (data[i] - 128) * factor + 128;
    data[i + 1] = (data[i + 1] - 128) * factor + 128;
    data[i + 2] = (data[i + 2] - 128) * factor + 128;
  }
}
export function applyReflect(imageData: ImageData): ImageData {
  const { data, width, height } = imageData;
  const halfWidth = Math.floor(width / 2);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < halfWidth; x++) {
      const leftIndex = (y * width + x) * 4;
      const rightIndex = (y * width + (width - x - 1)) * 4;

      // Swap the pixels
      for (let i = 0; i < 4; i++) {
        const temp = data[leftIndex + i];
        data[leftIndex + i] = data[rightIndex + i];
        data[rightIndex + i] = temp;
      }
    }
  }

  return imageData;
}
export function applyBlur(data: Uint8ClampedArray, width: number, height: number) {
  const radius = 5
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let totalRed = 0,
        totalGreen = 0,
        totalBlue = 0,
        count = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          const ny = y + dy;

          if (
            nx >= 0 &&
            ny >= 0 &&
            nx < width &&
            ny < height
          ) {
            const index = (ny * width + nx) * 4;
            totalRed += data[index];
            totalGreen += data[index + 1];
            totalBlue += data[index + 2];
            count++;
          }
        }
      }

      const currentIndex = (y * width + x) * 4;
      data[currentIndex] = totalRed / count;
      data[currentIndex + 1] = totalGreen / count;
      data[currentIndex + 2] = totalBlue / count;
    }
  }
}