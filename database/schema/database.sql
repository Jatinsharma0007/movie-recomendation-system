-- Create the database
CREATE DATABASE IF NOT EXISTS moviestream;
USE moviestream;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Movies table
CREATE TABLE IF NOT EXISTS movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year INT,
    rating DECIMAL(3,1),
    poster_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Movie Categories (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS movie_categories (
    movie_id INT,
    category_id INT,
    PRIMARY KEY (movie_id, category_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- Watchlist table
CREATE TABLE watchlist (
    user_id INT,
    movie_id INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);

-- User Ratings table
CREATE TABLE IF NOT EXISTS user_ratings (
    user_id INT,
    movie_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
);

-- Insert sample categories
INSERT INTO categories (name) VALUES
('Action'),
('Comedy'),
('Drama'),
('Sci-Fi'),
('Romance'),
('Horror'),
('Documentary'),
('Animation');

-- Insert sample movies
INSERT INTO movies (title, description, release_year, rating, poster_url, is_featured) VALUES
('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 2008, 9.0, 'https://example.com/dark-knight.jpg', true),
('Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 2010, 8.8, 'https://example.com/inception.jpg', true),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', 2014, 8.6, 'https://example.com/interstellar.jpg', false),
('The Matrix', 'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.', 1999, 8.7, 'https://example.com/matrix.jpg', false),
('Pulp Fiction', 'Various interconnected stories of criminals in Los Angeles.', 1994, 8.9, 'https://example.com/pulp-fiction.jpg', false),
('Forrest Gump', 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.', 1994, 8.8, 'https://example.com/forrest-gump.jpg', false),
('The Shawshank Redemption', 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', 1994, 9.3, 'https://example.com/shawshank.jpg', true),
('The Godfather', 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 1972, 9.2, 'https://example.com/godfather.jpg', true),
('Fight Club', 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.', 1999, 8.4, 'https://example.com/fight-club.jpg', false),
('The Silence of the Lambs', 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.', 1991, 8.6, 'https://example.com/silence-lambs.jpg', false);

-- Insert movie categories
INSERT INTO movie_categories (movie_id, category_id) VALUES
(1, 1), -- The Dark Knight - Action
(1, 3), -- The Dark Knight - Drama
(2, 1), -- Inception - Action
(2, 4), -- Inception - Sci-Fi
(3, 3); -- Shawshank - Drama

-- Update some existing movies to be featured
UPDATE movies SET is_featured = TRUE WHERE movie_id IN (1, 2, 3);

-- Insert additional featured movies if needed
INSERT INTO movies (title, description, poster_url, backdrop_url, release_date, is_featured) VALUES
('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 'images/movies/dark-knight.jpg', 'images/backdrops/dark-knight-bg.jpg', '2008-07-18', TRUE),
('Inception', 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', 'images/movies/inception.jpg', 'images/backdrops/inception-bg.jpg', '2010-07-16', TRUE),
('Interstellar', 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', 'images/movies/interstellar.jpg', 'images/backdrops/interstellar-bg.jpg', '2014-11-07', TRUE),
('The Matrix', 'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.', 'images/movies/matrix.jpg', 'images/backdrops/matrix-bg.jpg', '1999-03-31', TRUE),
('Pulp Fiction', 'Various interconnected stories of criminals in Los Angeles.', 'images/movies/pulp-fiction.jpg', 'images/backdrops/pulp-fiction-bg.jpg', '1994-10-14', TRUE);

-- Add categories to the new featured movies
INSERT INTO movie_categories (movie_id, category_id) VALUES
(6, 1), -- The Dark Knight - Action
(6, 2), -- The Dark Knight - Crime
(7, 1), -- Inception - Action
(7, 3), -- Inception - Sci-Fi
(8, 3), -- Interstellar - Sci-Fi
(8, 4), -- Interstellar - Drama
(9, 1), -- The Matrix - Action
(9, 3), -- The Matrix - Sci-Fi
(10, 2), -- Pulp Fiction - Crime
(10, 4); -- Pulp Fiction - Drama

-- Add some ratings for the new featured movies
INSERT INTO user_ratings (user_id, movie_id, rating) VALUES
(1, 6, 5.0), -- The Dark Knight
(2, 6, 4.8),
(1, 7, 4.7), -- Inception
(2, 7, 4.9),
(1, 8, 4.6), -- Interstellar
(2, 8, 4.7),
(1, 9, 4.8), -- The Matrix
(2, 9, 4.9),
(1, 10, 4.7), -- Pulp Fiction
(2, 10, 4.8);