import { Client } from 'minio';
import dotenv from 'dotenv';

dotenv.config();

const {
  ENDPOINT_OBJECTSTORE,
  PORT_OBJECTSTORE,
  ACCESSKEY_OBJECTSTORE,
  SECRETKEY_OBJECTSTORE,
} = process.env;

if (!ENDPOINT_OBJECTSTORE || !PORT_OBJECTSTORE || !ACCESSKEY_OBJECTSTORE || !SECRETKEY_OBJECTSTORE) {
  throw new Error('Missing necessary environment variables for MinIO client configuration');
}

export const dataBaseObjectStore = new Client({
  endPoint: ENDPOINT_OBJECTSTORE,
  port: parseInt(PORT_OBJECTSTORE, 10),
  useSSL: false,
  accessKey: ACCESSKEY_OBJECTSTORE,
  secretKey: SECRETKEY_OBJECTSTORE,
});

export const bucketName = 'image-database';

const initializeBucket = async () => {
  const bucketExists = await dataBaseObjectStore.bucketExists(bucketName);
  if (!bucketExists) {
    await dataBaseObjectStore.makeBucket(bucketName);
  }
};

// Initialize bucket
initializeBucket().then(() => {
  console.log('Connected to ObjectStore');
});
