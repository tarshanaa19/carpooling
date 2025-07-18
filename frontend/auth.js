// Authentication utility functions
const AuthUtils = {
    // Store user data in memory (since localStorage is not available)
    users: [
        { id: 1, fullName: 'John Doe', email: 'john@example.com', password: 'password123' },
        { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', password: 'password456' }
    ],

    currentUser: null,

    // Register new user
    register(userData) {
        // Check if user already exists
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        // Create new user
        const newUser = {
            id: this.users.length + 1,
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password
        };

        this.users.push(newUser);
        return newUser;
    },

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        this.currentUser = user;
        return user;
    },

    // Logout user
    logout() {
        this.currentUser = null;
    },

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    },

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
};

// Utility functions for UI
const UIUtils = {
    showMessage(elementId, message, type = 'error') {
        const messageEl = document.getElementById(elementId);
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `message ${type}`;
            messageEl.style.display = 'block';

            // Hide message after 5 seconds
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    },

    clearMessage(elementId) {
        const messageEl = document.getElementById(elementId);
        if (messageEl) {
            messageEl.style.display = 'none';
        }
    }
};

// Form validation utilities
const ValidationUtils = {
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validatePassword(password) {
        return password.length >= 6;
    },

    validateRequired(value) {
        return value && value.trim() !== '';
    }
};