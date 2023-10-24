const {Pool} = require('pg'); // Pool is from Postgres and is going to initialize our server with his metadata
const pool = new Pool({
    host: 'db',
    port: 5432,
    user: 'user123',
    password: 'password123',
    database: 'db123'
});

module.exports = pool;