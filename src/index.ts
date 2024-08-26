import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { dataBaseMongo } from './db/mongo';
import { dataBaseSQL } from './db/sql';
import { dataBaseObjectStore } from './db/objectStore';
import filter from './routes/filter';
import store from './routes/store';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use('/api', filter);
app.use('/api', store);

const DB = [dataBaseMongo, dataBaseSQL, dataBaseObjectStore]

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
