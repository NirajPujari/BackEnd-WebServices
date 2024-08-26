import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const dataBaseSQL = mysql.createConnection({
  host: process.env.HOST_SQL,
  user: process.env.USER_SQL,
  password: process.env.PASSWORD_SQL,
  database: process.env.DB_SQL,
});

// Optionally, connect to the database immediately
dataBaseSQL.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the SQL database');
});


export type InsertResult = {
  insertId: number;
  affectedRows: number;
};