-- Use the correct database
USE moviestream;

-- Delete related records first
DELETE FROM movie_categories;
DELETE FROM user_ratings;
DELETE FROM watchlist;
DELETE FROM movies;

-- Insert all movies
INSERT INTO movies (title, description, release_year, duration, rating, poster_url) VALUES
('Rise of the Planet of the Apes', 'A substance designed to help the brain repair itself gives advanced intelligence to a chimpanzee who leads an ape uprising.', 2011, 105, 7.6, 'images/movies/rise-of-the-planet-of-the-apes-2011.jpeg'),
('Jumanji: Welcome to the Jungle', 'Four teenagers are sucked into a magical video game, and the only way they can escape is to work together to finish the game.', 2017, 119, 6.9, 'images/movies/jumanji-welcome-to-the-jungle-2017.jpeg'),
('Life', 'A team of scientists aboard the International Space Station discover a rapidly evolving life form that caused extinction on Mars and now threatens the crew and all life on Earth.', 2017, 104, 6.6, 'images/movies/life-2017.jpeg'),
('Hitman', 'A genetically engineered assassin, known as Agent 47, becomes a pawn in a political conspiracy.', 2007, 100, 6.1, 'images/movies/hitman-2007.jpeg'),
('Star Wars: The Force Awakens', 'Three decades after the defeat of the Galactic Empire, a new threat arises. The First Order attempts to rule the galaxy and only a ragtag group of heroes can stop them.', 2015, 135, 8.0, 'images/movies/star-wars-force-awakens-2015.jpeg'),
('The Martian', 'An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth that he is alive.', 2015, 144, 8.4, 'images/movies/the-martian-2015.jpeg'),
('Imaginary', 'When Jessica moves back into her childhood home with her family, her youngest stepdaughter Alice develops an eerie attachment to a stuffed bear named Chauncey she finds in the basement.', 2024, 104, 5.5, 'images/movies/imaginary-2024.jpeg'),
('Ghost Rider', 'When motorcycle rider Johnny Blaze sells his soul to the Devil to save his father''s life, he is transformed into the Ghost Rider, the Devil''s own bounty hunter.', 2007, 114, 5.3, 'images/movies/ghost-rider-2007.jpeg'),
('The Conjuring 2', 'Lorraine and Ed Warren travel to London, England, to help a mother who is raising four children alone in a house plagued by malicious spirits.', 2016, 134, 7.3, 'images/movies/the-conjuring-2-2016.jpeg'),
('Crawl', 'A young woman, while attempting to save her father during a category 5 hurricane, finds herself trapped in a flooding house with her father''s injured dog and a group of alligators.', 2019, 87, 6.1, 'images/movies/crawl-2019.jpeg'),
('Terrifier 3', 'Art the Clown is set to unleash chaos on the unsuspecting residents of Miles County as they peacefully drift off to sleep on Christmas Eve.', 2024, 120, 6.5, 'images/movies/terrifier-3-2024.jpeg'),
('Annabelle Comes Home', 'While babysitting the daughter of Ed and Lorraine Warren, a teenager and her friend unknowingly awaken an evil spirit trapped in a doll.', 2019, 106, 6.0, 'images/movies/annabelle-comes-home-2019.jpeg'),
('Chhaava', 'A historical drama based on the life of Chhatrapati Sambhaji Maharaj.', 2024, 150, 7.5, 'images/movies/chhaava-2024.jpeg'),
('Logan', 'In the near future, a weary Logan cares for an ailing Professor X in a hide out on the Mexican border. But Logan''s attempts to hide from the world and his legacy are up-ended when a young mutant arrives, being pursued by dark forces.', 2017, 137, 8.1, 'images/movies/logan-2017.jpeg'),
('Black Adam', 'Nearly 5,000 years after he was bestowed with the almighty powers of the Egyptian gods -- and imprisoned just as quickly -- Black Adam is freed from his earthly tomb, ready to unleash his unique form of justice on the modern world.', 2022, 125, 7.0, 'images/movies/black-adam-2022.jpeg'),
('World War Z', 'Former United Nations employee Gerry Lane traverses the world in a race against time to stop the Zombie pandemic that is toppling armies and governments, and threatening to destroy humanity itself.', 2013, 116, 7.0, 'images/movies/world-war-z-2013.jpeg'),
('Rockstar', 'A young man''s journey from a small town to becoming a rock star, and the price he pays for fame.', 2011, 159, 7.7, 'images/movies/rockstar-2011.jpeg'),
('Fast & Furious 10', 'Dom Toretto and his family are targeted by Dante, the son of drug kingpin Hernan Reyes, who seeks revenge for his father''s death.', 2023, 141, 6.2, 'images/movies/fast-and-furious-10-2023.jpeg'),
('Aladdin', 'A kind-hearted street urchin and a power-hungry Grand Vizier vie for a magic lamp that has the power to make their deepest wishes come true.', 2019, 128, 7.0, 'images/movies/aladdin-2019.jpeg'),
('Disney Collection', 'A collection of classic Disney animated films.', 2024, 120, 8.5, 'images/movies/disney-collection.jpeg'),
('Rampage', 'When three different animals become infected with a dangerous pathogen, a primatologist and a geneticist team up to stop them from destroying Chicago.', 2018, 107, 6.1, 'images/movies/rampage-2018.jpeg'); 