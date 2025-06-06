require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '8302',
    database: process.env.DB_NAME || 'moviestream'
};

module.exports = dbConfig; 