import { MongoClient, Db, ServerApiVersion } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const { USER_MONGO, PASSWORD_MONGO, DB_MONGO } = process.env;
const MONGO_URI = `mongodb+srv://${USER_MONGO}:${PASSWORD_MONGO}@cluster0.sahsa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let dataBaseMongo: Db;

(async () => {
  try {
    const client = new MongoClient(MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();
    dataBaseMongo = client.db(DB_MONGO);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Exit process with failure
  }
})();

export { dataBaseMongo };
