require('dotenv').config();
const Pool = require('pg').Pool

const pool = new Pool(
    // {
    //     user: 'postgres',
    //     host: 'localhost',
    //     database: 'XPos',
    //     password: 'root',
    //     port: 5432
    // }
    {
        user: process.env.PSQL_USER,
        host: process.env.PSQL_HOST,
        database: process.env.PSQL_DATABASE,
        password: process.env.PSQL_PASSWORD,
        port: process.env.PSQL_PORT
    }
)

module.exports = {
    pool
}