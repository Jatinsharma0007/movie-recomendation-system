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

    // Function to get movie stats
    function getMovieStats(movieId) {
        return new Promise((resolve, reject) => {
            db.query('SELECT movie_id, title, views, user_clicks FROM movies WHERE movie_id = ?', [movieId], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }

    // Test movie interactions
    async function testInteractions() {
        try {
            // Get initial stats for a test movie (using ID 1)
            console.log('\nTesting movie interactions...');
            console.log('===========================');
            
            const initialStats = await getMovieStats(1);
            console.log('\nInitial Stats:');
            console.log(`Movie: ${initialStats.title}`);
            console.log(`Views: ${initialStats.views}`);
            console.log(`User Clicks: ${initialStats.user_clicks}`);

            // Simulate a view
            await new Promise((resolve, reject) => {
                db.query('UPDATE movies SET views = views + 1, user_clicks = user_clicks + 1 WHERE movie_id = 1', (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            console.log('\nSimulated a view...');

            // Get final stats
            const finalStats = await getMovieStats(1);
            console.log('\nFinal Stats:');
            console.log(`Movie: ${finalStats.title}`);
            console.log(`Views: ${finalStats.views}`);
            console.log(`User Clicks: ${finalStats.user_clicks}`);

            // Calculate differences
            const difference = finalStats.user_clicks - initialStats.user_clicks;
            console.log('\nDifference in user_clicks:', difference);

            console.log('\nTest completed successfully!');
            console.log('===========================');

        } catch (error) {
            console.error('Error during test:', error);
        } finally {
            db.end();
        }
    }

    // Run the test
    testInteractions();
}); 