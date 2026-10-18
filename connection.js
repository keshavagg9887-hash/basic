
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err.message);
});

const connectDB = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('PostgreSQL connected successfully:', result.rows[0].now);
    } catch (error) {
        console.error('PostgreSQL connection failed:', error.message);
        throw error;
    }
};

module.exports = { pool, connectDB };
