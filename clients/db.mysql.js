import mysql from "mysql2";

const {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_USER
} = process.env;

const dbConfig = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
}

const connection = mysql.createConnection(dbConfig);

export default connection.promise();