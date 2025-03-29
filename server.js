require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const dbConfig = require('./database/config');

const app = express();
const PORT = process.env.PORT || 7777;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection(dbConfig);

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
    
    // Create movies table if not exists
    const createMoviesTableQuery = `
        CREATE TABLE IF NOT EXISTS movies (
            movie_id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            release_year INT,
            rating DECIMAL(3,1),
            genre VARCHAR(50),
            poster_url VARCHAR(255),
            is_featured BOOLEAN DEFAULT FALSE,
            views INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    // Create user_library table if not exists
    const createLibraryTableQuery = `
        CREATE TABLE IF NOT EXISTS user_library (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            movie_id INT NOT NULL,
            date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
            UNIQUE KEY unique_user_movie (user_id, movie_id)
        )
    `;
    
    // Create tables
    db.query(createMoviesTableQuery, (err) => {
        if (err) {
            console.error('Error creating movies table:', err);
            return;
        }
        console.log('Movies table created or already exists');
        
        // Create library table after movies table
        db.query(createLibraryTableQuery, (err) => {
            if (err) {
                console.error('Error creating user_library table:', err);
                return;
            }
            console.log('User library table created or already exists');
            
            // Check if movies table is empty
            db.query('SELECT COUNT(*) as count FROM movies', (err, results) => {
                if (err) {
                    console.error('Error checking movies count:', err);
                    return;
                }
                
                if (results[0].count === 0) {
                    // Insert sample movies with view counts
                    const insertQuery = `
                        INSERT INTO movies (title, description, release_year, rating, genre, poster_url, is_featured, views) VALUES
                        ('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 2008, 9.0, 'Action', 'https://example.com/dark-knight.jpg', true, 1500000),
                        ('Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 2010, 8.8, 'Sci-Fi', 'https://example.com/inception.jpg', true, 1200000),
                        ('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', 2014, 8.6, 'Sci-Fi', 'https://example.com/interstellar.jpg', false, 900000),
                        ('The Matrix', 'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.', 1999, 8.7, 'Sci-Fi', 'https://example.com/matrix.jpg', false, 800000),
                        ('Pulp Fiction', 'Various interconnected stories of criminals in Los Angeles.', 1994, 8.9, 'Drama', 'https://example.com/pulp-fiction.jpg', false, 700000)
                    `;
                    
                    db.query(insertQuery, (err) => {
                        if (err) {
                            console.error('Error inserting sample movies:', err);
                            return;
                        }
                        console.log('Sample movies inserted successfully');
                    });
                } else {
                    console.log('Movies table already contains data');
                }
            });
        });
    });
});

// Routes
// Get featured movies (for hero section)
app.get('/api/featured-movies', (req, res) => {
    const query = `
        SELECT * FROM movies 
        WHERE is_featured = TRUE 
        ORDER BY rating DESC, release_year DESC 
        LIMIT 7
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching featured movies:', err);
            res.status(500).json({ error: 'Error fetching featured movies' });
            return;
        }
        res.json(results);
    });
});

// Get popular movies (based on view count and recent release)
app.get('/api/movies/popular', (req, res) => {
    console.log('Fetching popular movies...');
    const query = `
        SELECT DISTINCT m.* 
        FROM movies m
        WHERE m.is_featured = FALSE
        AND m.movie_id IN (
            SELECT MIN(movie_id) 
            FROM movies 
            WHERE title = m.title
        )
        ORDER BY 
            CASE 
                WHEN m.views >= 1000000 THEN 1
                WHEN m.views >= 500000 THEN 2
                WHEN m.views >= 100000 THEN 3
                ELSE 4
            END,
            m.views DESC,
            m.release_year DESC
        LIMIT 6
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching popular movies:', err);
            res.status(500).json({ error: 'Error fetching popular movies' });
            return;
        }
        
        console.log(`Found ${results.length} popular movies`);
        
        // If less than 4 movies found, get additional movies
        if (results.length < 4) {
            const remainingCount = 4 - results.length;
            const additionalQuery = `
                SELECT * FROM movies 
                WHERE movie_id NOT IN (?)
                ORDER BY views DESC, release_year DESC 
                LIMIT ?
            `;
            
            const additionalParams = [results.map(m => m.movie_id), remainingCount];
            
            db.query(additionalQuery, additionalParams, (err, additionalResults) => {
                if (err) {
                    console.error('Error fetching additional popular movies:', err);
                    res.json(results);
                    return;
                }
                res.json([...results, ...additionalResults]);
            });
        } else {
            res.json(results);
        }
    });
});

// Get recommended movies (based on user interactions, genre matching, and ratings)
app.get('/api/movies/recommended', (req, res) => {
    console.log('Fetching recommended movies...');
    const query = `
        WITH high_click_movies AS (
            SELECT DISTINCT m.* 
            FROM movies m
            WHERE m.is_featured = FALSE
            AND m.user_clicks > 100
            AND m.movie_id IN (
                SELECT MIN(movie_id) 
                FROM movies 
                WHERE title = m.title
            )
        ),
        genre_matches AS (
            SELECT DISTINCT m.* 
            FROM movies m
            WHERE m.is_featured = FALSE
            AND m.movie_id NOT IN (SELECT movie_id FROM high_click_movies)
            AND m.genre IN (SELECT genre FROM high_click_movies WHERE genre IS NOT NULL)
            AND m.movie_id IN (
                SELECT MIN(movie_id) 
                FROM movies 
                WHERE title = m.title
            )
        )
        SELECT * FROM (
            -- High click movies first
            SELECT *, 1 as priority FROM high_click_movies
            UNION ALL
            -- Genre matches second
            SELECT *, 2 as priority FROM genre_matches
            UNION ALL
            -- Other movies
            SELECT DISTINCT m.*, 3 as priority
            FROM movies m
            WHERE m.is_featured = FALSE
            AND m.movie_id NOT IN (SELECT movie_id FROM high_click_movies)
            AND m.movie_id NOT IN (SELECT movie_id FROM genre_matches)
            AND m.movie_id IN (
                SELECT MIN(movie_id) 
                FROM movies 
                WHERE title = m.title
            )
        ) all_movies
        ORDER BY 
            priority,
            user_clicks DESC,
            rating DESC,
            release_year DESC
        LIMIT 6
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching recommended movies:', err);
            res.status(500).json({ error: 'Error fetching recommended movies' });
            return;
        }
        
        console.log(`Found ${results.length} recommended movies`);
        
        // If less than 4 movies found, get additional movies
        if (results.length < 4) {
            const remainingCount = 4 - results.length;
            const additionalQuery = `
                SELECT * FROM movies 
                WHERE movie_id NOT IN (?)
                ORDER BY rating DESC, release_year DESC 
                LIMIT ?
            `;
            
            const additionalParams = [results.map(m => m.movie_id), remainingCount];
            
            db.query(additionalQuery, additionalParams, (err, additionalResults) => {
                if (err) {
                    console.error('Error fetching additional recommended movies:', err);
                    res.json(results);
                    return;
                }
                res.json([...results, ...additionalResults]);
            });
        } else {
            res.json(results);
        }
    });
});

// Search movies
app.get('/api/search', async (req, res) => {
    try {
        const { q, genre, year, rating } = req.query;
        let query = 'SELECT * FROM movies WHERE 1=1';
        const params = [];

        // Add search term condition - search in title, description, and genre
        if (q && q !== '*') {
            query += ' AND (LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?) OR LOWER(genre) LIKE LOWER(?))';
            params.push(`%${q}%`, `%${q}%`, `%${q}%`);
        }

        // Add genre filter - using LIKE for case-insensitive matching
        if (genre) {
            query += ' AND (LOWER(genre) LIKE LOWER(?) OR LOWER(genre) LIKE LOWER(?) OR LOWER(genre) LIKE LOWER(?))';
            params.push(`%${genre}%`, `${genre},%`, `%,${genre},%`);
        }

        // Add year filter
        if (year) {
            query += ' AND release_year = ?';
            params.push(year);
        }

        // Add rating filter
        if (rating) {
            query += ' AND rating >= ?';
            params.push(rating);
        }

        console.log('Search Query:', query); // Debug log
        console.log('Search Parameters:', params); // Debug log

        // Use promise-based query
        const [results] = await db.promise().query(query, params);
        console.log('Search Results:', results); // Debug log

        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to search movies' });
    }
});

// Get movie details by ID
app.get('/movies/:id', (req, res) => {
    const movieId = req.params.id;
    console.log('Fetching movie details for ID:', movieId);
    
    const query = `
        SELECT * FROM movies 
        WHERE movie_id = ?
    `;
    
    db.query(query, [movieId], (err, results) => {
        if (err) {
            console.error('Error fetching movie details:', err);
            res.status(500).json({ error: 'Error fetching movie details' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }

        // Return the movie details with basic rating
        const movie = results[0];
        res.json({
            ...movie,
            rating: movie.rating || 0
        });
    });
});

// Handle movie click interaction
app.post('/api/movies/:id/click', (req, res) => {
    const movieId = req.params.id;
    const query = 'UPDATE movies SET user_clicks = COALESCE(user_clicks, 0) + 1 WHERE movie_id = ?';
    db.query(query, [movieId], (err, result) => {
        if (err) {
            console.error('Error updating movie clicks:', err);
            res.status(500).json({ error: 'Error updating movie clicks' });
            return;
        }
        res.json({ success: true });
    });
});

// Handle movie search interaction
app.post('/api/movies/:id/search', (req, res) => {
    const movieId = req.params.id;
    const query = 'UPDATE movies SET user_clicks = COALESCE(user_clicks, 0) + 1 WHERE movie_id = ?';
    db.query(query, [movieId], (err, result) => {
        if (err) {
            console.error('Error updating movie search clicks:', err);
            res.status(500).json({ error: 'Error updating movie search clicks' });
            return;
        }
        res.json({ success: true });
    });
});

// Handle movie view interaction
app.post('/api/movies/:id/view', (req, res) => {
    const movieId = req.params.id;
    const query = 'UPDATE movies SET user_clicks = COALESCE(user_clicks, 0) + 1, views = COALESCE(views, 0) + 1 WHERE movie_id = ?';
    db.query(query, [movieId], (err, result) => {
        if (err) {
            console.error('Error updating movie view clicks:', err);
            res.status(500).json({ error: 'Error updating movie view clicks' });
            return;
        }
        res.json({ success: true });
    });
});

// User registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = 'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)';
        db.query(query, [username, email, hashedPassword, fullName], (err, result) => {
            if (err) {
                console.error('Error registering user:', err);
                res.status(500).json({ error: 'Error registering user' });
                return;
            }
            res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error('Error fetching user:', err);
                res.status(500).json({ error: 'Error fetching user' });
                return;
            }
            if (results.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            const user = results[0];
            const validPassword = await bcrypt.compare(password, user.password);
            
            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            res.json({ token, user: { id: user.id, email: user.email, username: user.username } });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get related movies based on genre
app.get('/api/movies/related/:id', (req, res) => {
    const movieId = req.params.id;
    console.log('=== Related Movies Request ===');
    console.log('Movie ID:', movieId);
    
    // First, get the current movie's genre
    const getCurrentMovieQuery = 'SELECT genre FROM movies WHERE movie_id = ?';
    console.log('Fetching current movie genre with query:', getCurrentMovieQuery);
    
    db.query(getCurrentMovieQuery, [movieId], (err, results) => {
        if (err) {
            console.error('Error fetching current movie genre:', err);
            res.status(500).json({ error: 'Error fetching current movie genre' });
            return;
        }

        if (results.length === 0) {
            console.log('No movie found with ID:', movieId);
            res.status(404).json({ error: 'Movie not found' });
            return;
        }

        const currentMovieGenre = results[0].genre;
        console.log('Current movie genre:', currentMovieGenre);

        if (!currentMovieGenre) {
            console.log('No genre found for movie:', movieId);
            // Fallback: Get random movies if no genre
            const fallbackQuery = `
                SELECT * FROM movies 
                WHERE movie_id != ? 
                ORDER BY rating DESC, release_year DESC 
                LIMIT 4
            `;
            db.query(fallbackQuery, [movieId], (err, results) => {
                if (err) {
                    console.error('Error fetching fallback movies:', err);
                    res.status(500).json({ error: 'Error fetching fallback movies' });
                    return;
                }
                res.json(results);
            });
            return;
        }

        // Split genres into array and create LIKE conditions
        const genres = currentMovieGenre.split(',').map(g => g.trim());
        console.log('Split genres:', genres);
        
        const genreConditions = genres.map(g => 'genre LIKE ?').join(' OR ');
        console.log('Genre conditions:', genreConditions);
        
        const query = `
            SELECT * FROM movies 
            WHERE movie_id != ? 
            AND (${genreConditions})
            ORDER BY rating DESC, release_year DESC 
            LIMIT 6
        `;
        
        // Create parameters array with movieId and genre patterns
        const params = [movieId, ...genres.map(g => `%${g}%`)];
        console.log('Final query:', query);
        console.log('Query parameters:', params);
        
        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Error fetching related movies:', err);
                res.status(500).json({ error: 'Error fetching related movies' });
                return;
            }
            
            console.log(`Found ${results.length} related movies`);
            
            // If less than 4 movies found, get additional movies from other genres
            if (results.length < 4) {
                const remainingCount = 4 - results.length;
                const additionalQuery = `
                    SELECT * FROM movies 
                    WHERE movie_id != ? 
                    AND movie_id NOT IN (?)
                    AND (${genreConditions.replace(/LIKE/g, 'NOT LIKE')})
                    ORDER BY rating DESC, release_year DESC 
                    LIMIT ?
                `;
                
                const additionalParams = [movieId, results.map(m => m.movie_id), ...genres.map(g => `%${g}%`), remainingCount];
                
                db.query(additionalQuery, additionalParams, (err, additionalResults) => {
                    if (err) {
                        console.error('Error fetching additional movies:', err);
                        res.json(results);
                        return;
                    }
                    res.json([...results, ...additionalResults]);
                });
            } else {
                res.json(results);
            }
        });
    });
});

// Get random recommended movies
app.get('/api/movies/recommended/:id', (req, res) => {
    const movieId = req.params.id;
    console.log('=== Recommended Movies Request ===');
    console.log('Movie ID:', movieId);
    
    // First, get the current movie's genre to exclude related movies
    const getCurrentMovieQuery = 'SELECT genre FROM movies WHERE movie_id = ?';
    db.query(getCurrentMovieQuery, [movieId], (err, results) => {
        if (err) {
            console.error('Error fetching current movie genre:', err);
            res.status(500).json({ error: 'Error fetching current movie genre' });
            return;
        }

        if (results.length === 0) {
            console.log('No movie found with ID:', movieId);
            res.status(404).json({ error: 'Movie not found' });
            return;
        }

        const currentMovieGenre = results[0].genre;
        console.log('Current movie genre:', currentMovieGenre);

        // Split genres into array and create NOT LIKE conditions
        const genres = currentMovieGenre.split(',').map(g => g.trim());
        const genreConditions = genres.map(g => 'genre NOT LIKE ?').join(' AND ');
        
        // Query to get random movies excluding current movie and related movies
        const query = `
            SELECT * FROM movies 
            WHERE movie_id != ? 
            AND (${genreConditions})
            ORDER BY RAND()
            LIMIT 6
        `;
        
        // Create parameters array with movieId and genre patterns
        const params = [movieId, ...genres.map(g => `%${g}%`)];
        console.log('Executing query:', query);
        console.log('With parameters:', params);
        
        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Error fetching recommended movies:', err);
                res.status(500).json({ error: 'Error fetching recommended movies' });
                return;
            }
            
            console.log(`Found ${results.length} recommended movies`);
            
            // If less than 4 movies found, get additional movies from any genre
            if (results.length < 4) {
                const remainingCount = 4 - results.length;
                const additionalQuery = `
                    SELECT * FROM movies 
                    WHERE movie_id != ? 
                    AND movie_id NOT IN (?)
                    ORDER BY RAND()
                    LIMIT ?
                `;
                
                const additionalParams = [movieId, results.map(m => m.movie_id), remainingCount];
                
                db.query(additionalQuery, additionalParams, (err, additionalResults) => {
                    if (err) {
                        console.error('Error fetching additional movies:', err);
                        res.json(results);
                        return;
                    }
                    res.json([...results, ...additionalResults]);
                });
            } else {
                res.json(results);
            }
        });
    });
});

// Add movie to user's library
app.post('/api/library/add', (req, res) => {
    const { movie_id } = req.body;
    // TODO: Replace with actual user ID when authentication is implemented
    const userId = 1;
    
    console.log('Adding movie to library:', { userId, movie_id });
    
    // Check if movie is already in library
    const checkQuery = 'SELECT * FROM user_library WHERE user_id = ? AND movie_id = ?';
    db.query(checkQuery, [userId, movie_id], (err, results) => {
        if (err) {
            console.error('Error checking library:', err);
            res.status(500).json({ error: 'Error checking library' });
            return;
        }

        if (results.length > 0) {
            res.status(400).json({ error: 'Movie already in library' });
            return;
        }

        // Add movie to library
        const insertQuery = 'INSERT INTO user_library (user_id, movie_id, date_added) VALUES (?, ?, NOW())';
        db.query(insertQuery, [userId, movie_id], (err, result) => {
            if (err) {
                console.error('Error adding to library:', err);
                res.status(500).json({ error: 'Error adding to library' });
                return;
            }

            console.log('Movie added to library successfully');
            res.json({ message: 'Movie added to library successfully' });
        });
    });
});

// Get user's library
app.get('/api/users/:userId/library', (req, res) => {
    const userId = req.params.userId;
    console.log('Fetching library for user:', userId);
    
    const query = `
        SELECT m.*, ul.date_added 
        FROM movies m
        JOIN user_library ul ON m.movie_id = ul.movie_id
        WHERE ul.user_id = ?
        ORDER BY ul.date_added DESC
    `;
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching library:', err);
            res.status(500).json({ error: 'Error fetching library' });
            return;
        }
        
        console.log(`Found ${results.length} movies in library`);
        res.json(results);
    });
});

// Check if movie is in user's library
app.get('/api/library/check/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    // TODO: Replace with actual user ID when authentication is implemented
    const userId = 1;
    
    const query = 'SELECT * FROM user_library WHERE user_id = ? AND movie_id = ?';
    db.query(query, [userId, movieId], (err, results) => {
        if (err) {
            console.error('Error checking library:', err);
            res.status(500).json({ error: 'Error checking library' });
            return;
        }
        res.json({ inLibrary: results.length > 0 });
    });
});

// Remove movie from user's library
app.delete('/api/library/remove/:movieId', (req, res) => {
    const movieId = req.params.movieId;
    // TODO: Replace with actual user ID when authentication is implemented
    const userId = 1;
    
    const query = 'DELETE FROM user_library WHERE user_id = ? AND movie_id = ?';
    db.query(query, [userId, movieId], (err, result) => {
        if (err) {
            console.error('Error removing from library:', err);
            res.status(500).json({ error: 'Error removing from library' });
            return;
        }
        res.json({ message: 'Movie removed from library successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 