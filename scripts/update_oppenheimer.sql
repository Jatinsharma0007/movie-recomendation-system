-- Insert Oppenheimer movie with the new image file
INSERT INTO movies (title, description, release_year, duration, rating, poster_url, backdrop_url, is_featured) 
VALUES (
    'Oppenheimer',
    'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    2023,
    180,
    8.9,
    'images/movies/oppenheimer.jpeg',
    'images/movies/oppenheimer.jpeg',
    TRUE
); 