import dotenv from 'dotenv';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const config = dotenv.config({ path: `${process.cwd()}/.env.${env}` }).parsed;

export default config;
