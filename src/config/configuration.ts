import * as dotenv from 'dotenv';
dotenv.config();

const envVariables = () => ({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  API_PORT: process.env.API_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
});

export default envVariables;
