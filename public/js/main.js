const API_URL = 'http://localhost:7777/api';

// Add page tracking variables
let currentPopularPage = 1;
let currentRecommendedPage = 1;

// Function to fetch movies from the database
async function fetchMovies(endpoint) {
    try {
        console.log(`Fetching ${endpoint} movies from database...`); // Debug log
        const response = await fetch(`${API_URL}/movies/${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`${endpoint} movies data:`, data); // Debug log
        return data;
    } catch (error) {
        console.error(`Error fetching ${endpoint} movies:`, error);
        throw error;
    }
}

// Function to create movie cards
function createMovieCard(movie) {
    const placeholderImage = 'https://via.placeholder.com/300x450?text=No+Image';
    return `
        <div class="movie-card" data-movie-id="${movie.movie_id}">
            <a href="movie.html?id=${movie.movie_id}" class="movie-link">
                <div class="movie-poster">
                    <img src="${movie.poster_url || placeholderImage}" alt="${movie.title}">
                    <div class="movie-overlay">
                        <div class="movie-details">
                            <p class="movie-genre">${movie.genre || 'Unknown Genre'}</p>
                            <p class="movie-duration">${movie.duration ? movie.duration + ' min' : 'N/A'}</p>
                            <p class="movie-description">${movie.description || 'No description available.'}</p>
                        </div>
                    </div>
                </div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <div class="movie-meta">
                        <span class="rating">⭐ ${movie.rating || 'N/A'}</span>
                        <span class="year">${movie.release_year || 'N/A'}</span>
                    </div>
                </div>
            </a>
        </div>
    `;
}

// Function to show loading state
function showLoadingState(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading movies...</p>
            </div>
        `;
    }
}

// Function to show error state
function showErrorState(containerId, errorMessage) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>${errorMessage}</p>
                <button onclick="loadMovies()" class="retry-button">Try Again</button>
            </div>
        `;
    }
}

// Function to create scroll buttons
function createScrollButtons(containerId) {
    const leftBtn = document.createElement('button');
    leftBtn.className = 'scroll-btn left';
    leftBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';

    const rightBtn = document.createElement('button');
    rightBtn.className = 'scroll-btn right';
    rightBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';

    const container = document.getElementById(containerId);
    const grid = container.querySelector('.movie-grid');

    leftBtn.addEventListener('click', () => {
        grid.scrollBy({ left: -300, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
        grid.scrollBy({ left: 300, behavior: 'smooth' });
    });

    // Show/hide buttons based on scroll position
    grid.addEventListener('scroll', () => {
        leftBtn.style.display = grid.scrollLeft > 0 ? 'flex' : 'none';
        rightBtn.style.display = 
            grid.scrollLeft < (grid.scrollWidth - grid.clientWidth) ? 'flex' : 'none';
    });

    return { leftBtn, rightBtn };
}

// Function to load movies into the grid
async function loadMovies() {
    console.log('Loading movies...'); // Debug log
    const recommendedMoviesGrid = document.getElementById('recommendedMovies');
    const popularMoviesGrid = document.getElementById('popularMovies');

    // Function to setup movie grid with scroll buttons
    const setupMovieGrid = async (grid, endpoint) => {
        showLoadingState(grid.id);
        try {
            const movies = await fetchMovies(endpoint);
            console.log(`${endpoint} movies loaded:`, movies); // Debug log
            if (movies && movies.length > 0) {
                // Create a Set to track unique movie IDs
                const uniqueMovies = new Set();
                const uniqueMoviesList = movies.filter(movie => {
                    if (uniqueMovies.has(movie.movie_id)) {
                        return false;
                    }
                    uniqueMovies.add(movie.movie_id);
                    return true;
                });

                // Clear existing content
                grid.innerHTML = '';
                
                // Wrap grid in container for scroll buttons if not already wrapped
                if (!grid.parentNode.classList.contains('movie-grid-container')) {
                    const container = document.createElement('div');
                    container.className = 'movie-grid-container';
                    grid.parentNode.insertBefore(container, grid);
                    container.appendChild(grid);
                    
                    // Add scroll buttons
                    const { leftBtn, rightBtn } = createScrollButtons(grid.id);
                    container.insertBefore(leftBtn, grid);
                    container.appendChild(rightBtn);
                }

                uniqueMoviesList.forEach(movie => {
                    const movieCard = document.createElement('div');
                    movieCard.innerHTML = createMovieCard(movie);
                    grid.appendChild(movieCard.firstElementChild);
                });

                // Auto-hide left button initially
                const leftBtn = grid.parentNode.querySelector('.scroll-btn.left');
                if (leftBtn) {
                    leftBtn.style.display = 'none';
                }
            } else {
                grid.innerHTML = '<p class="no-movies">No movies available.</p>';
            }
        } catch (error) {
            console.error(`Error loading ${endpoint} movies:`, error);
            showErrorState(grid.id, `Failed to load ${endpoint} movies. Please try again later.`);
        }
    };

    // Load recommended movies
    if (recommendedMoviesGrid) {
        await setupMovieGrid(recommendedMoviesGrid, 'recommended');
    }

    // Load popular movies
    if (popularMoviesGrid) {
        await setupMovieGrid(popularMoviesGrid, 'popular');
    }
}

// Slider functionality
let currentSlide = 0;
let slideInterval;
let slides;
let dots;
let prevBtn;
let nextBtn;
let heroSlider;

function showSlide(index) {
    if (!slides || !dots) return;
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

function initializeSliderControls() {
    // Get fresh references to all slider elements
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    prevBtn = document.querySelector('.prev-slide');
    nextBtn = document.querySelector('.next-slide');
    heroSlider = document.querySelector('.hero-slider');

    if (!slides.length || !dots.length || !prevBtn || !nextBtn || !heroSlider) {
        console.error('Slider elements not found');
        return;
    }

    // Reset current slide
    currentSlide = 0;
    showSlide(0);

    // Remove any existing event listeners (if any)
    prevBtn.replaceWith(prevBtn.cloneNode(true));
    nextBtn.replaceWith(nextBtn.cloneNode(true));
    
    // Get fresh references after cloning
    prevBtn = document.querySelector('.prev-slide');
    nextBtn = document.querySelector('.next-slide');

    // Add event listeners for controls
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    // Pause auto-slide on hover
    heroSlider.addEventListener('mouseenter', stopAutoSlide);
    heroSlider.addEventListener('mouseleave', startAutoSlide);

    // Start auto-slide
    startAutoSlide();
}

// Function to create featured movie slide
function createFeaturedSlide(movie) {
    return `
        <div class="slide" data-movie-id="${movie.movie_id}">
            <div class="slide-content">
                <div class="slide-poster">
                    <img src="${movie.poster_url || 'images/placeholder.jpg'}" alt="${movie.title}">
                </div>
                <div class="slide-info">
                    <h2>${movie.title}</h2>
                    <p class="slide-description">${movie.description || 'No description available.'}</p>
                    <div class="slide-meta">
                        <span class="rating">⭐ ${movie.rating || 'N/A'}</span>
                        <span class="year">${movie.release_year || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to load featured movies
async function loadFeaturedMovies() {
    try {
        console.log('Loading featured movies...'); // Debug log
        const response = await fetch(`${API_URL}/featured-movies`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const movies = await response.json();
        console.log('Featured movies data:', movies); // Debug log
        
        if (movies.length > 0) {
            // Get the hero slider
            const heroSlider = document.querySelector('.hero-slider');
            if (!heroSlider) {
                console.error('Hero slider element not found');
                return;
            }

            // Filter out duplicate movies and limit to exactly 7 unique movies
            const uniqueMovies = movies.filter((movie, index, self) =>
                index === self.findIndex((m) => m.title === movie.title)
            ).slice(0, 7);

            // If we don't have enough unique movies, log a warning
            if (uniqueMovies.length < 7) {
                console.warn(`Only ${uniqueMovies.length} unique movies available for the slider`);
            }

            // Clear existing slides but keep the controls
            const sliderControls = heroSlider.querySelector('.slider-controls');
            const existingDots = heroSlider.querySelector('.slider-dots');
            heroSlider.innerHTML = '';
            
            // Restore the controls
            if (sliderControls) {
                heroSlider.appendChild(sliderControls);
            }
            
            // Create slides for each unique movie
            uniqueMovies.forEach((movie, index) => {
                const slide = document.createElement('div');
                slide.className = `slide ${index === 0 ? 'active' : ''}`;
                slide.dataset.movieId = movie.movie_id;
                slide.innerHTML = `
                    <div class="slide-bg" style="background-image: url('${movie.backdrop_url || movie.poster_url || 'https://via.placeholder.com/1920x1080?text=No+Image'}')"></div>
                    <div class="slide-content">
                        <div class="featured-movie">
                            <a href="movie.html?id=${movie.movie_id}" class="movie-link">
                                <div class="movie-poster">
                                    <img src="${movie.poster_url || 'https://via.placeholder.com/300x450?text=No+Image'}" alt="${movie.title}">
                                </div>
                            </a>
                            <div class="movie-info">
                                <h1 class="movie-title">${movie.title}</h1>
                                <div class="movie-meta">
                                    <span class="movie-rating">
                                        <i class="fas fa-star"></i> ${movie.rating || 'N/A'}
                                    </span>
                                    <span class="movie-year">${movie.release_year || 'N/A'}</span>
                                </div>
                                <p class="movie-description">${movie.description || 'No description available.'}</p>
                                <div class="movie-actions">
                                    <a href="movie.html?id=${movie.movie_id}" class="watch-now-btn">
                                        <i class="fas fa-play"></i> Watch Now
                                    </a>
                                    <button class="add-to-library-btn" data-movie-id="${movie.movie_id}">
                                        <i class="fas fa-plus add-icon"></i>
                                        <i class="fas fa-check check-icon" style="display: none;"></i>
                                        <span class="button-text">Add to My Library</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                heroSlider.appendChild(slide);
            });

            // Create or update dots for navigation
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'slider-dots';
            uniqueMovies.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = `dot ${index === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    stopAutoSlide();
                    showSlide(index);
                    startAutoSlide();
                });
                dotsContainer.appendChild(dot);
            });
            heroSlider.appendChild(dotsContainer);

            // Initialize library buttons for the new slides
            initializeLibraryButtons();

            // Initialize slider controls after creating all elements
            initializeSliderControls();
        }
    } catch (error) {
        console.error('Error loading featured movies:', error);
    }
}

// Search functionality
const searchForm = document.querySelector('.search-box');
const searchResultsSection = document.querySelector('.search-results-section');
const searchResultsGrid = document.querySelector('.search-results-grid');
const noResultsMessage = document.querySelector('.no-results');
const closeSearchBtn = document.querySelector('.close-search');
const genreFilter = document.getElementById('genreFilter');
const yearFilter = document.getElementById('yearFilter');
const ratingFilter = document.getElementById('ratingFilter');

// Function to build search URL with filters
function buildSearchUrl(searchTerm) {
    const params = new URLSearchParams();
    
    // Add search term if present
    if (searchTerm) {
        params.append('q', searchTerm);
    }
    
    // Add filters if they have values
    const genre = genreFilter.value;
    if (genre) {
        params.append('genre', genre);
    }
    
    const year = yearFilter.value;
    if (year) {
        params.append('year', year);
    }
    
    const rating = ratingFilter.value;
    if (rating) {
        params.append('rating', rating);
    }
    
    // If no search term but filters are active, use a default search
    if (!searchTerm && hasActiveFilters()) {
        params.append('q', '*'); // Use wildcard to match all movies
    }
    
    const url = `${API_URL}/search?${params.toString()}`;
    console.log('Built search URL:', url); // Debug log
    return url;
}

// Function to check if any filters are active
function hasActiveFilters() {
    return genreFilter.value || yearFilter.value || ratingFilter.value;
}

// Function to perform search
async function performSearch(searchTerm) {
    try {
        showLoadingState('searchResultsGrid');
        const url = buildSearchUrl(searchTerm);
        console.log('Searching with URL:', url); // Debug log
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const results = await response.json();
        console.log('Search results:', results); // Debug log
        
        // Always show the search results section when displaying results
        searchResultsSection.style.display = 'block';
        
        // Clear previous results
        searchResultsGrid.innerHTML = '';
        
        if (results && results.length > 0) {
            // Hide no results message
            noResultsMessage.style.display = 'none';
            
            // Create and append movie cards for each result
            results.forEach(movie => {
                const movieCard = document.createElement('div');
                movieCard.innerHTML = createMovieCard(movie);
                searchResultsGrid.appendChild(movieCard.firstElementChild);
            });
        } else {
            // Show no results message
            noResultsMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error searching:', error);
        showErrorState('searchResultsGrid', 'Failed to search movies. Please try again.');
    }
}

// Handle filter changes
[genreFilter, yearFilter, ratingFilter].forEach(filter => {
    filter.addEventListener('change', async () => {
        console.log('Filter changed:', filter.id, filter.value); // Debug log
        const searchInput = searchForm.querySelector('input');
        const searchTerm = searchInput.value.trim();
        
        // Update visual states
        updateFilterStates();
        
        // Always perform search when filters change
        await performSearch(searchTerm);
    });
});

// Handle search form submission
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchInput = searchForm.querySelector('input');
    const searchTerm = searchInput.value.trim();
    
    // Always perform search if there are active filters or search term
    await performSearch(searchTerm);
});

// Handle search input
const searchInput = searchForm.querySelector('input');
let searchTimeout;

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    // Set new timeout for search
    if (searchTerm.length > 0 || hasActiveFilters()) {
        searchTimeout = setTimeout(async () => {
            await performSearch(searchTerm);
        }, 500); // Wait 500ms after user stops typing
    } else {
        searchResultsSection.style.display = 'none';
    }
});

// Function to update filter visual states
function updateFilterStates() {
    const filters = [genreFilter, yearFilter, ratingFilter];
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    // Update active state for each filter
    filters.forEach(filter => {
        if (filter.value) {
            filter.classList.add('active');
            console.log('Filter active:', filter.id, filter.value); // Debug log
        } else {
            filter.classList.remove('active');
            console.log('Filter inactive:', filter.id); // Debug log
        }
    });
    
    // Show/hide clear filters button
    if (hasActiveFilters()) {
        clearFiltersBtn.style.display = 'flex';
        console.log('Clear filters button shown'); // Debug log
    } else {
        clearFiltersBtn.style.display = 'none';
        console.log('Clear filters button hidden'); // Debug log
    }
}

// Function to clear all filters
function clearAllFilters() {
    genreFilter.value = '';
    yearFilter.value = '';
    ratingFilter.value = '';
    updateFilterStates();
    performSearch('');
}

// Handle clear filters button
document.getElementById('clearFilters').addEventListener('click', () => {
    clearAllFilters();
});

// Handle close search button
closeSearchBtn.addEventListener('click', () => {
    searchResultsSection.style.display = 'none';
    searchForm.querySelector('input').value = '';
    clearAllFilters();
});

// Function to handle movie interactions
function setupMovieInteractions() {
    // Handle poster clicks
    document.addEventListener('click', async (e) => {
        const movieCard = e.target.closest('.movie-card');
        if (movieCard) {
            const movieId = movieCard.dataset.movieId;
            try {
                await fetch(`${API_URL}/movies/${movieId}/click`, { method: 'POST' });
            } catch (error) {
                console.error('Error tracking movie click:', error);
            }
        }
    });

    // Handle movie searches
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', async (e) => {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length > 0) {
                try {
                    const response = await fetch(`${API_URL}/movies/search?q=${encodeURIComponent(searchTerm)}`);
                    const results = await response.json();
                    if (results.length > 0) {
                        // Track search for the first matching movie
                        await fetch(`${API_URL}/movies/${results[0].movie_id}/search`, { method: 'POST' });
                    }
                } catch (error) {
                    console.error('Error tracking movie search:', error);
                }
            }
        });
    }

    // Handle movie details view
    document.addEventListener('click', async (e) => {
        const movieCard = e.target.closest('.movie-card');
        if (movieCard) {
            const movieId = movieCard.dataset.movieId;
            try {
                await fetch(`${API_URL}/movies/${movieId}/view`, { method: 'POST' });
            } catch (error) {
                console.error('Error tracking movie view:', error);
            }
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, initializing...'); // Debug log
    setupMovieInteractions();
    await loadFeaturedMovies(); // Wait for featured movies to load first
    loadMovies();
    initializeLibraryButtons(); // Initialize library buttons after all content is loaded
});

// Check if movie is in library
async function checkMovieInLibrary(movieId, button) {
    try {
        const response = await fetch(`/api/library/check/${movieId}`);
        if (!response.ok) {
            throw new Error('Failed to check library status');
        }
        const data = await response.json();
        updateButtonState(data.inLibrary, button);
        return data.inLibrary;
    } catch (error) {
        console.error('Error checking library status:', error);
        return false;
    }
}

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

// Handle add to library toggle
function handleLibraryToggle(button, movieId) {
    button.addEventListener('click', async () => {
        try {
            const isInLibrary = button.classList.contains('in-library');
            
            if (isInLibrary) {
                // Remove from library
                const response = await fetch(`/api/library/remove/${movieId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    updateButtonState(false, button);
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
                    updateButtonState(true, button);
                } else {
                    const data = await response.json();
                    console.error(data.error || 'Failed to add to My Library');
                }
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}

// Initialize library buttons
function initializeLibraryButtons() {
    const libraryButtons = document.querySelectorAll('.add-to-library-btn');
    libraryButtons.forEach(button => {
        const movieId = button.getAttribute('data-movie-id');
        if (movieId) {
            checkMovieInLibrary(movieId, button);
            handleLibraryToggle(button, movieId);
        }
    });
}

// Function to trigger shine effect
function triggerShineEffect(poster) {
    // Remove existing shine class
    poster.classList.remove('shine');
    
    // Force reflow
    void poster.offsetWidth;
    
    // Add shine class to trigger animation
    poster.classList.add('shine');
}

// Update the slide change logic
function changeSlide(direction) {
    const currentSlide = document.querySelector('.slide.active');
    const nextSlide = direction === 'next' 
        ? currentSlide.nextElementSibling || document.querySelector('.slide:first-child')
        : currentSlide.previousElementSibling || document.querySelector('.slide:last-child');
    
    // Remove active class from current slide
    currentSlide.classList.remove('active');
    
    // Add active class to next slide
    nextSlide.classList.add('active');
    
    // Trigger shine effect on the new slide's poster
    const poster = nextSlide.querySelector('.movie-poster');
    if (poster) {
        triggerShineEffect(poster);
    }
    
    // Update slide counter
    updateSlideCounter();
} 