import mysql from 'mysql';
import config from './config.js';

const connection = mysql.createConnection({
    host : config['MYSQL_HOST'],
    user : config['MYSQL_USERNAME'],
    password : process.env.MYSQL_PASSWORD,
    database : config['MYSQL_DATABASE'],
    charset: 'utf8mb4',
});

connection.connect();

export default connection;
