// Get movie ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
console.log('Current URL:', window.location.href);
console.log('Movie ID from URL:', movieId);

// DOM Elements
const moviePoster = document.getElementById('movie-poster');
const movieTitle = document.getElementById('movie-title');
const movieYear = document.getElementById('movie-year');
const movieRating = document.getElementById('movie-rating');
const movieGenre = document.getElementById('movie-genre');
const movieDescription = document.getElementById('movie-description');
const movieViews = document.getElementById('movie-views');
const addToListBtn = document.getElementById('addToLibrary');
const movieBackdrop = document.querySelector('.movie-backdrop');
const playBtn = document.querySelector('.play-btn');
const relatedMoviesContainer = document.querySelector('.related-movies-container');
const recommendedMoviesContainer = document.querySelector('.recommended-movies-container');

// Log DOM elements to verify they exist
console.log('DOM Elements:', {
    moviePoster,
    movieTitle,
    movieYear,
    movieRating,
    movieGenre,
    movieDescription,
    movieViews,
    addToListBtn,
    movieBackdrop,
    playBtn,
    relatedMoviesContainer,
    recommendedMoviesContainer
});

// Fetch related movies
async function fetchRelatedMovies(movieId, genre) {
    try {
        console.log('=== Fetching Related Movies ===');
        console.log('Movie ID:', movieId);
        console.log('Genre:', genre);
        
        const url = `/api/movies/related/${movieId}`;
        console.log('Request URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            throw new Error(`Failed to fetch related movies: ${response.status}`);
        }
        
        const movies = await response.json();
        console.log('Related movies data:', movies);
        
        if (!movies || movies.length === 0) {
            console.log('No related movies found');
            if (relatedMoviesContainer) {
                relatedMoviesContainer.innerHTML = '<p class="no-related-movies">No related movies found</p>';
            }
            return;
        }
        
        displayRelatedMovies(movies);
    } catch (error) {
        console.error('Error fetching related movies:', error);
        if (relatedMoviesContainer) {
            relatedMoviesContainer.innerHTML = '<p class="error-message">Failed to load related movies</p>';
        }
    }
}

// Display related movies
function displayRelatedMovies(movies) {
    console.log('=== Displaying Related Movies ===');
    console.log('Movies to display:', movies);
    
    if (!relatedMoviesContainer) {
        console.error('Related movies container not found');
        return;
    }

    if (movies.length === 0) {
        console.log('No movies to display');
        relatedMoviesContainer.innerHTML = '<p class="no-related-movies">No related movies found</p>';
        return;
    }

    const html = movies.map(movie => `
        <a href="movie.html?id=${movie.movie_id}" class="related-movie-card">
            <div class="related-movie-poster">
                <img src="${movie.poster_url || 'images/placeholder.jpg'}" alt="${movie.title}">
            </div>
            <div class="related-movie-info">
                <h3 class="related-movie-title">${movie.title}</h3>
                <div class="related-movie-meta">
                    <div class="related-movie-rating">
                        <i class="fas fa-star"></i>
                        <span>${movie.rating || 'N/A'}</span>
                    </div>
                    <span>${movie.release_year || 'N/A'}</span>
                </div>
            </div>
        </a>
    `).join('');

    console.log('Generated HTML:', html);
    relatedMoviesContainer.innerHTML = html;
    console.log('Related movies displayed successfully');
}

// Fetch recommended movies
async function fetchRecommendedMovies(movieId) {
    try {
        console.log('=== Fetching Recommended Movies ===');
        console.log('Movie ID:', movieId);
        
        const url = `/api/movies/recommended/${movieId}`;
        console.log('Request URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch recommended movies: ${response.status}`);
        }
        
        const movies = await response.json();
        console.log('Recommended movies data:', movies);
        
        if (!movies || movies.length === 0) {
            console.log('No recommended movies found');
            if (recommendedMoviesContainer) {
                recommendedMoviesContainer.innerHTML = '<p class="no-recommended-movies">No recommended movies found</p>';
            }
            return;
        }
        
        displayRecommendedMovies(movies);
    } catch (error) {
        console.error('Error fetching recommended movies:', error);
        if (recommendedMoviesContainer) {
            recommendedMoviesContainer.innerHTML = '<p class="error-message">Failed to load recommended movies</p>';
        }
    }
}

// Display recommended movies
function displayRecommendedMovies(movies) {
    console.log('=== Displaying Recommended Movies ===');
    console.log('Movies to display:', movies);
    
    if (!recommendedMoviesContainer) {
        console.error('Recommended movies container not found');
        return;
    }

    if (movies.length === 0) {
        console.log('No movies to display');
        recommendedMoviesContainer.innerHTML = '<p class="no-recommended-movies">No recommended movies found</p>';
        return;
    }

    const html = movies.map(movie => `
        <a href="movie.html?id=${movie.movie_id}" class="recommended-movie-card">
            <div class="recommended-movie-poster">
                <img src="${movie.poster_url || 'images/placeholder.jpg'}" alt="${movie.title}">
            </div>
            <div class="recommended-movie-info">
                <h3 class="recommended-movie-title">${movie.title}</h3>
                <div class="recommended-movie-meta">
                    <div class="recommended-movie-rating">
                        <i class="fas fa-star"></i>
                        <span>${movie.rating || 'N/A'}</span>
                    </div>
                    <span>${movie.release_year || 'N/A'}</span>
                </div>
            </div>
        </a>
    `).join('');

    console.log('Generated HTML:', html);
    recommendedMoviesContainer.innerHTML = html;
    console.log('Recommended movies displayed successfully');
}

// Fetch movie details
async function fetchMovieDetails() {
    try {
        console.log('Fetching movie details for ID:', movieId);
        const response = await fetch(`/movies/${movieId}`);
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const movie = await response.json();
        console.log('Movie details:', movie);
        displayMovieDetails(movie);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        showError('Failed to load movie details. Please try again later.');
    }
}

// Display movie details
function displayMovieDetails(movie) {
    console.log('Displaying movie details:', movie);
    
    // Update page title
    document.title = `${movie.title} - MovieStream`;

    // Update movie poster
    moviePoster.src = movie.poster_url || 'images/placeholder.jpg';
    moviePoster.alt = movie.title;

    // Update backdrop image
    if (movie.backdrop_url) {
        movieBackdrop.style.backgroundImage = `url('${movie.backdrop_url}')`;
    }

    // Update movie title
    movieTitle.textContent = movie.title;

    // Update movie meta information
    movieYear.querySelector('.meta-text').textContent = movie.release_year || 'N/A';
    movieRating.querySelector('.meta-text').textContent = movie.rating ? `${movie.rating}/10` : 'N/A';
    movieGenre.querySelector('.meta-text').textContent = movie.genre || 'Unknown Genre';

    // Update views count with proper formatting
    const views = movie.views || 0;
    const formattedViews = views >= 1000000 
        ? `${(views / 1000000).toFixed(1)}M views`
        : views >= 1000 
            ? `${(views / 1000).toFixed(1)}K views`
            : `${views} views`;
    movieViews.querySelector('span').textContent = formattedViews;

    // Update movie description
    movieDescription.textContent = movie.description || 'No description available.';

    // Fetch related and recommended movies after displaying main movie details
    fetchRelatedMovies(movieId, movie.genre);
    fetchRecommendedMovies(movieId);
}

// Handle add to library toggle
addToListBtn.addEventListener('click', async () => {
    try {
        const isInLibrary = addToListBtn.classList.contains('in-library');
        
        if (isInLibrary) {
            // Remove from library
            const response = await fetch(`/api/library/remove/${movieId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                updateButtonState(false, addToListBtn);
            } else {
                const data = await response.json();
                console.error(data.error || 'Failed to remove from My Library');
            }
        } else {
            // Add to library
            const response = await fetch('/api/library/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    movie_id: movieId
                })
            });

            if (response.ok) {
                updateButtonState(true, addToListBtn);
            } else {
                const data = await response.json();
                console.error(data.error || 'Failed to add to My Library');
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Update button state based on library status
function updateButtonState(inLibrary, button) {
    const addIcon = button.querySelector('.add-icon');
    const checkIcon = button.querySelector('.check-icon');
    const buttonText = button.querySelector('.button-text');
    
    if (inLibrary) {
        button.disabled = false;
        addIcon.style.display = 'none';
        checkIcon.style.display = 'inline-block';
        buttonText.textContent = 'Added to My Library';
        button.classList.add('in-library');
    } else {
        button.disabled = false;
        addIcon.style.display = 'inline-block';
        checkIcon.style.display = 'none';
        buttonText.textContent = 'Add to My Library';
        button.classList.remove('in-library');
    }
}

// Check if movie is in library
async function checkMovieInLibrary() {
    try {
        const response = await fetch(`/api/library/check/${movieId}`);
        if (!response.ok) {
            throw new Error('Failed to check library status');
        }
        const data = await response.json();
        updateButtonState(data.inLibrary, addToListBtn);
        return data.inLibrary;
    } catch (error) {
        console.error('Error checking library status:', error);
        return false;
    }
}

// Handle play button click
playBtn.addEventListener('click', async () => {
    try {
        // Increment view count
        const response = await fetch(`/api/movies/${movieId}/view`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to update view count');
        }

        // You can add video playback functionality here
        showError('Video playback feature coming soon!');
    } catch (error) {
        console.error('Error updating view count:', error);
        showError('Failed to update view count. Please try again.');
    }
});

// Show error message
function showError(message) {
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Add to page
    document.body.insertBefore(errorDiv, document.body.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Show success message
function showSuccess(message) {
    // Create success element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Add to page
    document.body.insertBefore(successDiv, document.body.firstChild);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Initialize
if (movieId) {
    fetchMovieDetails();
    checkMovieInLibrary(); // Check initial library status
} else {
    console.error('No movie ID provided');
    setTimeout(() => {
        window.location.href = '/index.html';
    }, 2000);
} 