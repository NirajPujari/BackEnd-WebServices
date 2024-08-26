import express, { Request, Response } from 'express';
import multer from 'multer';
import { StoreImageInSQL, StoreImageInMongoDB, StoreImageInObjectStorage } from '../db'; // Ensure these functions are implemented

const router = express.Router();
const upload = multer();

router.post('/store', upload.single('imageFile'), async (req: Request, res: Response) => {
  const { imageName, option } = req.body;
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const storageResult = await applyStore(imageName, imageFile.buffer, option);
    if (storageResult instanceof Error) {
      return res.status(400).json({ error: storageResult.message });
    }
    res.status(200).json({ message: 'Image stored successfully', storageResult });
  } catch (error) {
    console.error('Error storing image:', error);
    res.status(500).json({ error: 'Failed to store image' });
  }
});

// Asynchronous function to handle storage
const applyStore = async (imageName: string, imageFile: Buffer, option: string) => {
  try {
    if (!option || !['sql', 'mongodb', 'objectstore'].includes(option.toLowerCase())) {
      return new Error('Invalid storage option');
    }

    let storageResult;
    switch (option.toLowerCase()) {
      case 'sql':
        storageResult = await StoreImageInSQL(imageName, imageFile);
        break;
      case 'mongodb':
        storageResult = await StoreImageInMongoDB(imageName, imageFile);
        break;
      case 'objectstore':
        storageResult = await StoreImageInObjectStorage(imageName, imageFile);
        break;
      default:
        return new Error('Unknown storage option');
    }

    return storageResult;
  } catch (error) {
    console.error('Error storing image:', error);
    return new Error('Failed to store image');
  }
};

export default router;
