// Constants
const API_URL = 'http://localhost:7777/api';
const form = document.querySelector('.register-form');
const errorMessage = document.querySelector('.error-message');
const successMessage = document.querySelector('.success-message');

// Create message elements if they don't exist
if (!errorMessage) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    form.insertBefore(errorDiv, form.firstChild);
}

if (!successMessage) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    form.insertBefore(successDiv, form.firstChild);
}

// Password strength indicator
const passwordInput = document.querySelector('input[name="password"]');
const confirmPasswordInput = document.querySelector('input[name="confirm_password"]');

// Password strength calculation
function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
}

// Update password strength indicator
passwordInput.addEventListener('input', () => {
    const strength = calculatePasswordStrength(passwordInput.value);
    passwordInput.style.color = '#cccccc'; // Reset color
    
    if (strength <= 2) {
        passwordInput.style.color = '#ff4444'; // Red for weak
    } else if (strength <= 4) {
        passwordInput.style.color = '#ffbb33'; // Yellow for medium
    } else {
        passwordInput.style.color = '#00C851'; // Green for strong
    }
});

// Form validation
function validateForm() {
    const username = form.querySelector('input[name="username"]').value;
    const fullName = form.querySelector('input[name="full_name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const terms = form.querySelector('input[name="terms"]').checked;

    let isValid = true;
    let errorMsg = '';

    // Username validation
    if (username.length < 3) {
        errorMsg = 'Username must be at least 3 characters long';
        isValid = false;
    }

    // Full name validation
    if (fullName.length < 2) {
        errorMsg = 'Please enter your full name';
        isValid = false;
    }

    // Email validation
    if (!isValidEmail(email)) {
        errorMsg = 'Please enter a valid email address';
        isValid = false;
    }

    // Password validation
    if (password.length < 8) {
        errorMsg = 'Password must be at least 8 characters long';
        isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
        errorMsg = 'Passwords do not match';
        isValid = false;
    }

    // Terms validation
    if (!terms) {
        errorMsg = 'Please agree to the Terms of Service';
        isValid = false;
    }

    if (!isValid) {
        showError(errorMsg);
    }

    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(message) {
    const errorDiv = document.querySelector('.error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.querySelector('.success-message');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const formData = {
        username: form.querySelector('input[name="username"]').value,
        full_name: form.querySelector('input[name="full_name"]').value,
        email: form.querySelector('input[name="email"]').value,
        password: passwordInput.value
    };

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
        } else {
            showError(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        showError('An error occurred. Please try again later.');
        console.error('Registration error:', error);
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Registration page initialized');
}); 