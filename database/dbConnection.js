const mysql = require('mysql');


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


const connectDB = async () => {
    try {
        await connection.connect();
        console.log('connected to db');
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = connection;