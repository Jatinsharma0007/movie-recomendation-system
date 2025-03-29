const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createTestUser() {
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        // Check if user already exists
        const [existingUsers] = await connection.execute(
            'SELECT * FROM users WHERE email = ?',
            ['test@example.com']
        );

        if (existingUsers.length > 0) {
            console.log('Test user already exists');
            return;
        }

        // Insert new test user
        await connection.execute(
            'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
            ['testuser', 'test@example.com', hashedPassword, 'Test User']
        );

        console.log('Test user created successfully');
        console.log('Email: test@example.com');
        console.log('Password: password123');
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        await connection.end();
    }
}

createTestUser(); 