// Authentication System for MahiLLM
class AuthSystem {
    constructor() {
        this.apiBase = 'https://api.mahillm.com'; // Replace with your actual API
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Form submission
        const authForm = document.getElementById('authForm');
        if (authForm) {
            authForm.addEventListener('submit', (e) => this.handleSignIn(e));
        }

        // Google OAuth (mock implementation)
        if (typeof signInWithGoogle === 'undefined') {
            window.signInWithGoogle = () => this.signInWithGoogle();
        }

        // Facebook OAuth (mock implementation)
        if (typeof signInWithFacebook === 'undefined') {
            window.signInWithFacebook = () => this.signInWithFacebook();
        }
    }

    async handleSignIn(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            this.showLoading(true);
            
            // Simulate API call
            const response = await this.mockApiCall('/auth/signin', {
                email,
                password
            });

            if (response.success) {
                this.saveAuthData(response.user, response.token);
                this.showMessage('success', 'Welcome back! Redirecting...');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                this.showMessage('error', response.message || 'Invalid credentials');
            }
        } catch (error) {
            this.showMessage('error', 'An error occurred. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async signInWithGoogle() {
        try {
            this.showLoading(true);
            
            // Mock Google OAuth
            const response = await this.mockApiCall('/auth/google', {
                provider: 'google',
                token: 'mock_google_token'
            });

            if (response.success) {
                this.saveAuthData(response.user, response.token);
                this.showMessage('success', 'Signed in with Google! Redirecting...');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                this.showMessage('error', 'Google sign-in failed');
            }
        } catch (error) {
            this.showMessage('error', 'Google sign-in failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async signInWithFacebook() {
        try {
            this.showLoading(true);
            
            // Mock Facebook OAuth
            const response = await this.mockApiCall('/auth/facebook', {
                provider: 'facebook',
                token: 'mock_facebook_token'
            });

            if (response.success) {
                this.saveAuthData(response.user, response.token);
                this.showMessage('success', 'Signed in with Facebook! Redirecting...');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                this.showMessage('error', 'Facebook sign-in failed');
            }
        } catch (error) {
            this.showMessage('error', 'Facebook sign-in failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async mockApiCall(endpoint, data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock responses based on endpoint
        switch (endpoint) {
            case '/auth/signin':
                if (data.email === 'admin@mahillm.com' && data.password === 'admin123') {
                    return {
                        success: true,
                        user: {
                            id: '1',
                            email: 'admin@mahillm.com',
                            name: 'Admin User',
                            role: 'admin',
                            avatar: 'https://via.placeholder.com/40'
                        },
                        token: 'mock_jwt_token'
                    };
                } else if (data.email === 'user@example.com' && data.password === 'password123') {
                    return {
                        success: true,
                        user: {
                            id: '2',
                            email: 'user@example.com',
                            name: 'Demo User',
                            role: 'user',
                            avatar: 'https://via.placeholder.com/40'
                        },
                        token: 'mock_jwt_token'
                    };
                } else {
                    return {
                        success: false,
                        message: 'Invalid email or password'
                    };
                }

            case '/auth/google':
                return {
                    success: true,
                    user: {
                        id: '3',
                        email: 'user@gmail.com',
                        name: 'Google User',
                        role: 'user',
                        avatar: 'https://via.placeholder.com/40',
                        provider: 'google'
                    },
                    token: 'mock_jwt_token'
                };

            case '/auth/facebook':
                return {
                    success: true,
                    user: {
                        id: '4',
                        email: 'user@facebook.com',
                        name: 'Facebook User',
                        role: 'user',
                        avatar: 'https://via.placeholder.com/40',
                        provider: 'facebook'
                    },
                    token: 'mock_jwt_token'
                };

            default:
                return { success: false, message: 'Unknown endpoint' };
        }
    }

    saveAuthData(user, token) {
        localStorage.setItem('mahillm_user', JSON.stringify(user));
        localStorage.setItem('mahillm_token', token);
        localStorage.setItem('mahillm_auth_time', Date.now().toString());
    }

    getAuthData() {
        const user = localStorage.getItem('mahillm_user');
        const token = localStorage.getItem('mahillm_token');
        const authTime = localStorage.getItem('mahillm_auth_time');

        if (user && token && authTime) {
            // Check if token is still valid (24 hours)
            const tokenAge = Date.now() - parseInt(authTime);
            const tokenValid = tokenAge < 24 * 60 * 60 * 1000;

            if (tokenValid) {
                return {
                    user: JSON.parse(user),
                    token,
                    isAuthenticated: true
                };
            } else {
                this.clearAuthData();
            }
        }

        return { isAuthenticated: false };
    }

    clearAuthData() {
        localStorage.removeItem('mahillm_user');
        localStorage.removeItem('mahillm_token');
        localStorage.removeItem('mahillm_auth_time');
    }

    checkAuthStatus() {
        const authData = this.getAuthData();
        
        if (authData.isAuthenticated) {
            // User is already authenticated, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    }

    showMessage(type, message) {
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');

        // Hide all messages first
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';

        // Show appropriate message
        if (type === 'error' && errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        } else if (type === 'success' && successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
    }

    showLoading(show) {
        const submitBtn = document.querySelector('#authForm button[type="submit"]');
        if (submitBtn) {
            if (show) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            }
        }
    }

    // Public methods for external use
    static isAuthenticated() {
        const auth = new AuthSystem();
        return auth.getAuthData().isAuthenticated;
    }

    static getCurrentUser() {
        const auth = new AuthSystem();
        return auth.getAuthData().user;
    }

    static logout() {
        const auth = new AuthSystem();
        auth.clearAuthData();
        window.location.href = 'index.html';
    }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});

// Global functions for HTML onclick handlers
function showSignUp() {
    // Redirect to sign up page or show sign up modal
    window.location.href = 'signup.html';
}

function showForgotPassword() {
    // Show forgot password modal or redirect
    alert('Forgot password functionality would be implemented here');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}
