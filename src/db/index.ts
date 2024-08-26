import { dataBaseSQL, InsertResult } from './sql'
import { ResultSetHeader } from 'mysql2';
import { dataBaseMongo } from './mongo';
import { GridFSBucket, ObjectId } from 'mongodb';
import { bucketName, dataBaseObjectStore } from './objectStore';

export async function StoreImageInSQL(fileName: string, data: Buffer): Promise<InsertResult> {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO images (name, data) VALUES (?, ?)';

    console.log([fileName, data])
    dataBaseSQL.query(query, [fileName, data], (err, result: ResultSetHeader) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          insertId: result.insertId,
          affectedRows: result.affectedRows,
        });
      }
    });
  });
}

export async function StoreImageInMongoDB(fileName: string, file: Buffer): Promise<ObjectId> {
  if (!dataBaseMongo) {
    throw new Error("Database connection is not established");
  }

  const bucket = new GridFSBucket(dataBaseMongo, { bucketName: 'images' });
  const uploadStream = bucket.openUploadStream(fileName);

  return new Promise((resolve, reject) => {
    uploadStream.write(file, (err) => {
      if (err) {
        reject(err);
      } else {
        uploadStream.end(() => {
          resolve(uploadStream.id);
        });
      }
    });
  });
}

export async function StoreImageInObjectStorage(fileName: string, file: Buffer): Promise<any> {
  try {
    const metaData = {
      'Content-Type': 'image/jpeg',
    };

    const { etag, versionId } = await dataBaseObjectStore.putObject(bucketName, fileName, file, metaData);

    return { success: true, message: 'Image stored in object storage', etag, versionId };
  } catch (error) {
    console.error('Error storing image in object storage:', error);
    throw new Error('Failed to store image in object storage');
  }
}
