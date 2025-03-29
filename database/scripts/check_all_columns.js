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

    // First, get the table structure
    db.query('DESCRIBE movies', (err, results) => {
        if (err) {
            console.error('Error getting table structure:', err);
            db.end();
            return;
        }

        console.log('\nMovies Table Structure:');
        console.log('----------------------');
        results.forEach(row => {
            console.log(`${row.Field}: ${row.Type} (Default: ${row.Default || 'None'})`);
        });

        // Then get a sample of the data
        db.query('SELECT movie_id, title, genre, views, user_clicks FROM movies LIMIT 3', (err, results) => {
            if (err) {
                console.error('Error getting sample data:', err);
                db.end();
                return;
            }

            console.log('\nSample Data:');
            console.log('------------');
            results.forEach(movie => {
                console.log(`ID: ${movie.movie_id}`);
                console.log(`Title: ${movie.title}`);
                console.log(`Genre: ${movie.genre}`);
                console.log(`Views: ${movie.views}`);
                console.log(`User Clicks: ${movie.user_clicks}`);
                console.log('------------');
            });

            db.end();
        });
    });
}); 