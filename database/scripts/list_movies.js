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

    // Get all movies with their details
    const query = `
        SELECT 
            m.movie_id,
            m.title,
            m.description,
            m.release_year,
            m.rating,
            m.genre,
            m.poster_url,
            m.is_featured,
            m.views,
            m.user_clicks,
            m.created_at
        FROM movies m
        ORDER BY m.release_year DESC, m.rating DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching movies:', err);
            db.end();
            return;
        }

        console.log('\nMovies List:');
        console.log('============');
        results.forEach(movie => {
            console.log(`\nID: ${movie.movie_id}`);
            console.log(`Title: ${movie.title}`);
            console.log(`Year: ${movie.release_year}`);
            console.log(`Rating: ${movie.rating}`);
            console.log(`Genre: ${movie.genre}`);
            console.log(`Views: ${movie.views}`);
            console.log(`User Clicks: ${movie.user_clicks}`);
            console.log(`Featured: ${movie.is_featured ? 'Yes' : 'No'}`);
            console.log('============');
        });

        console.log(`\nTotal Movies: ${results.length}`);
        db.end();
    });
}); 