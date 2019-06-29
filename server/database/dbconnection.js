import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_TEST,
} = process.env;
let connection;

const devConfig = {
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  max: 10,
  idleTimeoutMillis: 3000,
};

const testConfig = {
  user: DB_USER,
  database: DB_TEST,
  password: DB_PASSWORD,
  port: DB_PORT,
  max: 10,
  idleTimeoutMillis: 3000,
};
if (process.env.NODE_ENV === 'production') {
  connection = {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  };
} else if (process.env.NODE_ENV === 'test') {
  connection = testConfig;
} else {
  connection = devConfig;
}

const dbconnection = new Pool(connection);

export default dbconnection;
