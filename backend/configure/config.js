require('dotenv').config();
const Pool = require('pg').Pool

const pool = new Pool(
    // {
    //     user: 'postgres',
    //     host: 'localhost',
    //     database: 'xpos',
    //     password: 'root',
    //     port: 5432
    // }
    {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.PORT
    }
)

module.exports = {
    pool
}