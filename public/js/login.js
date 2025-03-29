const API_URL = 'http://localhost:7777/api';

// Get form elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');

// Create message elements
const errorMessage = document.createElement('div');
errorMessage.className = 'error-message';
loginForm.insertBefore(errorMessage, loginForm.firstChild);

const successMessage = document.createElement('div');
successMessage.className = 'success-message';
loginForm.insertBefore(successMessage, loginForm.firstChild);

// Check for saved credentials
document.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    
    if (savedEmail && savedPassword) {
        emailInput.value = savedEmail;
        passwordInput.value = savedPassword;
        rememberCheckbox.checked = true;
    }
});

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Basic validation
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        // Handle successful login
        if (rememberCheckbox.checked) {
            localStorage.setItem('savedEmail', email);
            localStorage.setItem('savedPassword', password);
        } else {
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
        }
        
        // Store the token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showSuccess('Login successful! Redirecting...');
        
        // Redirect to home page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'An error occurred during login');
    }
});

// Helper functions
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
}

// Add input validation
emailInput.addEventListener('input', () => {
    if (!emailInput.value.trim()) {
        emailInput.setCustomValidity('Email is required');
    } else if (!isValidEmail(emailInput.value)) {
        emailInput.setCustomValidity('Please enter a valid email address');
    } else {
        emailInput.setCustomValidity('');
    }
});

passwordInput.addEventListener('input', () => {
    if (!passwordInput.value) {
        passwordInput.setCustomValidity('Password is required');
    } else if (passwordInput.value.length < 6) {
        passwordInput.setCustomValidity('Password must be at least 6 characters long');
    } else {
        passwordInput.setCustomValidity('');
    }
});

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
} 