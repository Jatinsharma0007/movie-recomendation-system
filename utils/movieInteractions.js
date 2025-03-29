require('dotenv').config();
const mysql = require('mysql2/promise'); // Using promise-based version for better async handling

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '8302',
    database: process.env.DB_NAME || 'moviestream'
};

// Function to increment user_clicks for a movie
async function incrementUserClicks(movieId) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log(`Attempting to increment user_clicks for movie ID: ${movieId}`);
        
        // First, get current value
        const [currentRows] = await connection.execute(
            'SELECT user_clicks FROM movies WHERE movie_id = ?',
            [movieId]
        );
        console.log('Current user_clicks:', currentRows[0]?.user_clicks);

        // Increment the value
        const [result] = await connection.execute(
            'UPDATE movies SET user_clicks = COALESCE(user_clicks, 0) + 1 WHERE movie_id = ?',
            [movieId]
        );
        
        console.log('Update result:', {
            affectedRows: result.affectedRows,
            changedRows: result.changedRows
        });

        // Verify the update
        const [updatedRows] = await connection.execute(
            'SELECT user_clicks FROM movies WHERE movie_id = ?',
            [movieId]
        );
        console.log('New user_clicks:', updatedRows[0]?.user_clicks);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error in incrementUserClicks:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Function to handle movie poster click
async function handlePosterClick(movieId) {
    try {
        console.log('Handling poster click for movie ID:', movieId);
        const result = await incrementUserClicks(movieId);
        console.log('Poster click handled:', result);
        return result;
    } catch (error) {
        console.error('Error handling poster click:', error);
        return false;
    }
}

// Function to handle movie search
async function handleMovieSearch(movieId) {
    try {
        console.log('Handling movie search for movie ID:', movieId);
        const result = await incrementUserClicks(movieId);
        console.log('Movie search handled:', result);
        return result;
    } catch (error) {
        console.error('Error handling movie search:', error);
        return false;
    }
}

// Function to handle movie details view
async function handleMovieDetailsView(movieId) {
    try {
        console.log('Handling movie details view for movie ID:', movieId);
        const result = await incrementUserClicks(movieId);
        console.log('Movie details view handled:', result);
        return result;
    } catch (error) {
        console.error('Error handling movie details view:', error);
        return false;
    }
}

// Function to get movie interaction stats
async function getMovieStats(movieId) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log(`Getting stats for movie ID: ${movieId}`);
        
        const [rows] = await connection.execute(
            'SELECT title, views, user_clicks FROM movies WHERE movie_id = ?',
            [movieId]
        );
        console.log('Retrieved stats:', rows[0]);
        return rows[0];
    } catch (error) {
        console.error('Error getting movie stats:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

module.exports = {
    handlePosterClick,
    handleMovieSearch,
    handleMovieDetailsView,
    getMovieStats
}; 