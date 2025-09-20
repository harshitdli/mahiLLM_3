// Enhanced Firebase Authentication Integration
import { authService, authUtils } from './firebase-config.js';

class MahiLLMFirebaseAuth {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.userDocument = null;
        this.init();
    }

    async init() {
        try {
            // Override auth service event handlers
            authService.onUserSignIn = (user) => this.handleUserSignIn(user);
            authService.onUserSignOut = () => this.handleUserSignOut();
            
            this.isInitialized = true;
            console.log('Firebase Auth initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Firebase Auth:', error);
        }
    }

    // Handle user sign-in
    async handleUserSignIn(user) {
        try {
            this.currentUser = user;
            
            // Get user document from Firestore
            const userDocResult = await authService.getUserDocument(user.uid);
            if (userDocResult.success) {
                this.userDocument = userDocResult.data;
            }

            // Update UI
            this.updateUIForAuthenticatedUser(user);
            
            // Show welcome message
            this.showNotification('Welcome back!', 'success');
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            console.error('Error handling user sign-in:', error);
            this.showNotification('Error loading user data', 'error');
        }
    }

    // Handle user sign-out
    handleUserSignOut() {
        this.currentUser = null;
        this.userDocument = null;
        this.updateUIForUnauthenticatedUser();
        this.showNotification('Signed out successfully', 'info');
    }

    // Google Sign-In
    async signInWithGoogle() {
        if (!this.isInitialized) {
            this.showNotification('Authentication system not ready', 'error');
            return;
        }

        try {
            this.showLoading(true, 'Signing in with Google...');
            
            const result = await authService.signInWithGoogle();
            
            if (result.success) {
                console.log('Google sign-in successful');
                // handleUserSignIn will be called automatically
            } else {
                this.showNotification(authUtils.formatAuthError(result.error), 'error');
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            this.showNotification('Google sign-in failed', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Facebook Sign-In
    async signInWithFacebook() {
        if (!this.isInitialized) {
            this.showNotification('Authentication system not ready', 'error');
            return;
        }

        try {
            this.showLoading(true, 'Signing in with Facebook...');
            
            const result = await authService.signInWithFacebook();
            
            if (result.success) {
                console.log('Facebook sign-in successful');
                // handleUserSignIn will be called automatically
            } else {
                this.showNotification(authUtils.formatAuthError(result.error), 'error');
            }
        } catch (error) {
            console.error('Facebook sign-in error:', error);
            this.showNotification('Facebook sign-in failed', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Email/Password Sign-In
    async signInWithEmail(email, password) {
        if (!this.isInitialized) {
            this.showNotification('Authentication system not ready', 'error');
            return;
        }

        // Validate inputs
        if (!authUtils.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        if (!password || password.length < 6) {
            this.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            this.showLoading(true, 'Signing in...');
            
            const result = await authService.signInWithEmail(email, password);
            
            if (result.success) {
                console.log('Email sign-in successful');
                // handleUserSignIn will be called automatically
            } else {
                this.showNotification(authUtils.formatAuthError(result.error), 'error');
            }
        } catch (error) {
            console.error('Email sign-in error:', error);
            this.showNotification('Sign-in failed', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Email/Password Sign-Up
    async signUpWithEmail(email, password, displayName) {
        if (!this.isInitialized) {
            this.showNotification('Authentication system not ready', 'error');
            return;
        }

        // Validate inputs
        if (!authUtils.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        const passwordValidation = authUtils.validatePassword(password);
        if (!passwordValidation.isValid) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            return;
        }

        if (!displayName || displayName.trim().length < 2) {
            this.showNotification('Please enter your name', 'error');
            return;
        }

        try {
            this.showLoading(true, 'Creating account...');
            
            const result = await authService.signUpWithEmail(email, password, displayName.trim());
            
            if (result.success) {
                this.showNotification('Account created successfully! Please check your email for verification.', 'success');
                
                // Show email verification notice
                setTimeout(() => {
                    this.showEmailVerificationNotice();
                }, 2000);
            } else {
                this.showNotification(authUtils.formatAuthError(result.error), 'error');
            }
        } catch (error) {
            console.error('Email sign-up error:', error);
            this.showNotification('Account creation failed', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Sign Out
    async signOut() {
        if (!this.isInitialized) {
            return;
        }

        try {
            const result = await authService.signOut();
            
            if (result.success) {
                console.log('Sign out successful');
                // handleUserSignOut will be called automatically
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                this.showNotification('Sign out failed', 'error');
            }
        } catch (error) {
            console.error('Sign out error:', error);
            this.showNotification('Sign out failed', 'error');
        }
    }

    // Password Reset
    async resetPassword(email) {
        if (!this.isInitialized) {
            this.showNotification('Authentication system not ready', 'error');
            return;
        }

        if (!authUtils.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        try {
            this.showLoading(true, 'Sending reset email...');
            
            const result = await authService.resetPassword(email);
            
            if (result.success) {
                this.showNotification('Password reset email sent! Check your inbox.', 'success');
            } else {
                this.showNotification(authUtils.formatAuthError(result.error), 'error');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            this.showNotification('Failed to send reset email', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Update UI for authenticated user
    updateUIForAuthenticatedUser(user) {
        // Update navigation buttons
        const loginBtn = document.querySelector('.btn-login');
        const signupBtn = document.querySelector('.btn-primary');
        
        if (loginBtn) {
            loginBtn.textContent = user.displayName || 'Dashboard';
            loginBtn.onclick = () => window.location.href = 'dashboard.html';
        }
        
        if (signupBtn && signupBtn.textContent.includes('Sign up')) {
            signupBtn.textContent = 'Dashboard';
            signupBtn.onclick = () => window.location.href = 'dashboard.html';
        }

        // Update user info in dashboard if present
        this.updateDashboardUserInfo(user);
    }

    // Update UI for unauthenticated user
    updateUIForUnauthenticatedUser() {
        const loginBtn = document.querySelector('.btn-login');
        const signupBtn = document.querySelector('.btn-primary');
        
        if (loginBtn) {
            loginBtn.textContent = 'Log in';
            loginBtn.onclick = () => window.location.href = 'auth.html';
        }
        
        if (signupBtn && signupBtn.textContent.includes('Dashboard')) {
            signupBtn.textContent = 'Sign up';
            signupBtn.onclick = () => window.location.href = 'auth.html';
        }
    }

    // Update dashboard user info
    updateDashboardUserInfo(user) {
        const userName = document.getElementById('userName');
        const userEmail = document.getElementById('userEmail');
        const userAvatar = document.getElementById('userAvatar');

        if (userName) userName.textContent = user.displayName || 'User';
        if (userEmail) userEmail.textContent = user.email || '';
        if (userAvatar) {
            userAvatar.textContent = (user.displayName || user.email || 'U').charAt(0).toUpperCase();
            if (user.photoURL) {
                userAvatar.style.backgroundImage = `url(${user.photoURL})`;
                userAvatar.style.backgroundSize = 'cover';
                userAvatar.style.backgroundPosition = 'center';
            }
        }
    }

    // Show loading state
    showLoading(show, message = 'Loading...') {
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            if (show) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${message}`;
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Submit';
            }
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10a37f' : type === 'error' ? '#ff6b6b' : '#4dabf7'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Show email verification notice
    showEmailVerificationNotice() {
        const modal = document.createElement('div');
        modal.className = 'email-verification-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Verify Your Email</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="verification-icon">
                            <i class="fas fa-envelope-open"></i>
                        </div>
                        <p>We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account.</p>
                        <p class="verification-note">Don't see the email? Check your spam folder or try signing in again.</p>
                        <div class="modal-actions">
                            <button class="btn-primary" onclick="window.location.href='auth.html'">Back to Sign In</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-overlay')) {
                modal.remove();
            }
        });
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get user document
    getUserDocument() {
        return this.userDocument;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get user ID token
    async getIdToken() {
        if (this.currentUser) {
            return await this.currentUser.getIdToken();
        }
        return null;
    }

    // Update user profile
    async updateUserProfile(updates) {
        if (!this.currentUser) {
            this.showNotification('No user logged in', 'error');
            return;
        }

        try {
            this.showLoading(true, 'Updating profile...');
            
            const result = await authService.updateUserDocument(this.currentUser.uid, updates);
            
            if (result.success) {
                this.showNotification('Profile updated successfully', 'success');
                this.userDocument = { ...this.userDocument, ...updates };
            } else {
                this.showNotification('Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            this.showNotification('Profile update failed', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    // Update user statistics
    async updateUserStats(statsUpdate) {
        if (!this.currentUser) {
            return;
        }

        try {
            const result = await authService.updateUserStats(this.currentUser.uid, statsUpdate);
            if (result.success) {
                console.log('User stats updated:', statsUpdate);
            }
        } catch (error) {
            console.error('Stats update error:', error);
        }
    }
}

// Create and export auth instance
export const mahiLLMAuth = new MahiLLMFirebaseAuth();

// Global functions for HTML onclick handlers
window.signInWithGoogle = () => mahiLLMAuth.signInWithGoogle();
window.signInWithFacebook = () => mahiLLMAuth.signInWithFacebook();
window.signOut = () => mahiLLMAuth.signOut();
window.resetPassword = (email) => mahiLLMAuth.resetPassword(email);

// Export for use in other modules
export default mahiLLMAuth;
