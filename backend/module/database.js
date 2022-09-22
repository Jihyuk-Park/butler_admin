import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
    host : process.env.MYSQL_HOST,
    user : 'butler_d',
    password : process.env.MYSQL_PASSWORD,
    database : 'butler',
    charset: 'utf8mb4',
});

connection.connect();

export default connection;