-- First, clear the featured flag from all movies
UPDATE movies SET is_featured = FALSE;

-- Update featured movies with correct poster URLs
UPDATE movies 
SET is_featured = TRUE,
    poster_url = CONCAT('images/movies/', 
        CASE title
            WHEN 'Rise of the Planet of the Apes' THEN 'rise-of-the-planet-of-the-apes-2011.jpeg'
            WHEN 'Jumanji: Welcome to the Jungle' THEN 'jumanji-welcome-to-the-jungle-2017.jpeg'
            WHEN 'Life' THEN 'life-2017.jpeg'
            WHEN 'Hitman' THEN 'hitman-2007.jpeg'
            WHEN 'Star Wars: The Force Awakens' THEN 'star-wars-force-awakens-2015.jpeg'
            WHEN 'The Martian' THEN 'the-martian-2015.jpeg'
            WHEN 'Imaginary' THEN 'imaginary-2024.jpeg'
            WHEN 'Ghost Rider' THEN 'ghost-rider-2007.jpeg'
            WHEN 'The Conjuring 2' THEN 'the-conjuring-2-2016.jpeg'
            WHEN 'Crawl' THEN 'crawl-2019.jpeg'
            WHEN 'Terrifier 3' THEN 'terrifier-3-2024.jpeg'
            WHEN 'Annabelle Comes Home' THEN 'annabelle-comes-home-2019.jpeg'
            WHEN 'Chhaava' THEN 'chhaava-2024.jpeg'
            WHEN 'Logan' THEN 'logan-2017.jpeg'
            WHEN 'Black Adam' THEN 'black-adam-2022.jpeg'
            WHEN 'World War Z' THEN 'world-war-z-2013.jpeg'
            WHEN 'Rockstar' THEN 'rockstar-2011.jpeg'
            WHEN 'Fast & Furious 10' THEN 'fast-and-furious-10-2023.jpeg'
            WHEN 'Aladdin' THEN 'aladdin-2019.jpeg'
            WHEN 'Rampage' THEN 'rampage-2018.jpeg'
        END)
WHERE title IN (
    'Rise of the Planet of the Apes',
    'Jumanji: Welcome to the Jungle',
    'Life',
    'Hitman',
    'Star Wars: The Force Awakens',
    'The Martian',
    'Imaginary',
    'Ghost Rider',
    'The Conjuring 2',
    'Crawl',
    'Terrifier 3',
    'Annabelle Comes Home',
    'Chhaava',
    'Logan',
    'Black Adam',
    'World War Z',
    'Rockstar',
    'Fast & Furious 10',
    'Aladdin',
    'Rampage'
); 