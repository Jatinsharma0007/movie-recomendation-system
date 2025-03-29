-- Use the correct database
USE moviestream;

-- Update poster URL for The Conjuring 2
UPDATE movies 
SET poster_url = 'images/movies/the-conjuring-2-2016.jpeg'
WHERE title = 'The Conjuring 2' AND release_year = 2016;

-- If the movie doesn't exist, insert it
INSERT INTO movies (title, release_year, poster_url, description, rating, genre)
SELECT 'The Conjuring 2', 2016, 'images/movies/the-conjuring-2-2016.jpeg',
'Lorraine and Ed Warren travel to London, England, to help a mother who is raising four children alone in a house plagued by malicious spirits.',
7.3, 'Horror'
WHERE NOT EXISTS (
    SELECT 1 FROM movies WHERE title = 'The Conjuring 2' AND release_year = 2016
); 