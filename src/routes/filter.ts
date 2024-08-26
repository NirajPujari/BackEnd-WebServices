import express, { Request, Response } from 'express';
import { createCanvas, loadImage } from 'canvas';
import multer from 'multer';
import { applyBlur, applyContrast, applyGrayscale, applyReflect, applySepia } from '../utils/filters';
import { Readable } from 'stream';

const router = express.Router();
const upload = multer();

router.post('/filter', upload.single('imageFile'), async (req: Request, res: Response) => {
  const { imageName, filter } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).send({ error: 'No file uploaded' });
  }
  const filteredImageBuffer = await applyFilter(imageFile.buffer, filter); // Pass the buffer

  res.set({
    'Content-Type': 'multipart/form-data',
    'Content-Disposition': `attachment; filename="filtered-${imageName}"`
  });

  const readableStream = new Readable();
  readableStream.push(filteredImageBuffer);
  readableStream.push(null);
  readableStream.pipe(res);

});

export default router

const applyFilter = async (imageBuffer: Buffer, filter: string): Promise<Buffer> => {
  try {
    const image = await loadImage(imageBuffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    switch (filter) {
      case 'greyscale':
        applyGrayscale(imageData.data);
        break;
      case 'sepia':
        applySepia(imageData.data);
        break;
      case 'reflect':
        applyReflect(imageData);
        break;
      case 'blur':
        applyBlur(imageData.data, imageData.width, imageData.height);
        break;
      case 'contrast':
        applyContrast(imageData.data);
        break;
      default:
        throw new Error('Unsupported filter type');
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas.toBuffer('image/png');
  } catch (error) {
    console.error('Error applying filter:', error);
    throw new Error('Failed to apply filter');
  }
};