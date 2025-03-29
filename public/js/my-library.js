// Get DOM elements
const libraryGrid = document.querySelector('.library-grid');
const emptyLibrary = document.querySelector('.empty-library');
const sortBySelect = document.getElementById('sort-by');
const filterGenreSelect = document.getElementById('filter-genre');

// Function to fetch user's library
async function fetchUserLibrary() {
    try {
        // TODO: Replace with actual user ID when authentication is implemented
        const userId = 1;
        console.log('Fetching library for user:', userId);
        
        const response = await fetch(`/api/users/${userId}/library`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch library');
        }
        
        const movies = await response.json();
        console.log('Library movies:', movies);
        displayLibrary(movies);
    } catch (error) {
        console.error('Error fetching library:', error);
        showEmptyLibrary();
    }
}

// Function to display library movies
function displayLibrary(movies) {
    if (!movies || movies.length === 0) {
        showEmptyLibrary();
        return;
    }

    libraryGrid.innerHTML = movies.map(movie => `
        <div class="movie-card">
            <a href="movie.html?id=${movie.movie_id}" class="movie-link">
                <div class="movie-poster">
                    <img src="${movie.poster_url || 'images/placeholder.jpg'}" alt="${movie.title}">
                    <div class="movie-poster-overlay">
                        <button class="play-btn">
                            <i class="fas fa-play"></i>
                        </button>
                    </div>
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-meta">
                        <div class="movie-rating">
                            <i class="fas fa-star"></i>
                            <span>${movie.rating || 'N/A'}</span>
                        </div>
                        <span class="movie-year">${movie.release_year || 'N/A'}</span>
                    </div>
                </div>
            </a>
        </div>
    `).join('');

    emptyLibrary.style.display = 'none';
    libraryGrid.style.display = 'grid';
}

// Function to show empty library state
function showEmptyLibrary() {
    libraryGrid.style.display = 'none';
    emptyLibrary.style.display = 'flex';
}

// Function to sort movies
function sortMovies(movies, sortBy) {
    switch (sortBy) {
        case 'date-added':
            return movies.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));
        case 'rating':
            return movies.sort((a, b) => b.rating - a.rating);
        case 'title':
            return movies.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return movies;
    }
}

// Function to filter movies by genre
function filterMovies(movies, genre) {
    if (genre === 'all') return movies;
    return movies.filter(movie => 
        movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
}

// Event listeners
sortBySelect.addEventListener('change', () => {
    // TODO: Implement sorting functionality
});

filterGenreSelect.addEventListener('change', () => {
    // TODO: Implement filtering functionality
});

// Initialize library
document.addEventListener('DOMContentLoaded', fetchUserLibrary); 