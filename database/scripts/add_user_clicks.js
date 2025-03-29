require('dotenv').config();
const mysql = require('mysql2');
const dbConfig = require('../config');

// Create database connection
const db = mysql.createConnection(dbConfig);

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');

    // Add user_clicks column with default value 0
    const query = 'ALTER TABLE movies ADD COLUMN user_clicks INT DEFAULT 0';
    db.query(query, (err) => {
        if (err) {
            console.error('Error adding user_clicks column:', err);
            db.end();
            return;
        }
        console.log('Successfully added user_clicks column to movies table');

        // Verify the column was added
        db.query('SELECT movie_id, title, user_clicks FROM movies LIMIT 3', (err, results) => {
            if (err) {
                console.error('Error verifying column:', err);
                db.end();
                return;
            }

            console.log('\nSample of movies with user_clicks:');
            console.log('--------------------------------');
            results.forEach(movie => {
                console.log(`ID: ${movie.movie_id}`);
                console.log(`Title: ${movie.title}`);
                console.log(`User Clicks: ${movie.user_clicks}`);
                console.log('--------------------------------');
            });

            db.end();
        });
    });
}); 