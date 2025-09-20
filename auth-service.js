// Comprehensive Authentication Service for MahiLLM
import { auth, db, storage } from './firebase-config.js';
import { 
    GoogleAuthProvider, 
    FacebookAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification,
    deleteUser,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs,
    serverTimestamp,
    deleteDoc,
    increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Notification system
const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            .notification-success { background: #10a37f; }
            .notification-error { background: #ef4444; }
            .notification-warning { background: #f59e0b; }
            .notification-info { background: #3b82f6; }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
};

const showLoading = (message = 'Loading...') => {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>${message}</p>
        </div>
    `;
    
    // Add loading styles if not already added
    if (!document.getElementById('loading-styles')) {
        const style = document.createElement('style');
        style.id = 'loading-styles';
        style.textContent = `
            #loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .loading-content {
                background: white;
                padding: 2rem;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #e5e7eb;
                border-top: 4px solid #10a37f;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loading);
};

const hideLoading = () => {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
};

// Enhanced Authentication Service
class MahiLLMAuthService {
    constructor() {
        this.currentUser = null;
        this.authStateListeners = [];
        this.setupAuthStateListener();
        this.setupGoogleProvider();
        this.setupFacebookProvider();
    }

    setupGoogleProvider() {
        this.googleProvider = new GoogleAuthProvider();
        this.googleProvider.addScope('email');
        this.googleProvider.addScope('profile');
        this.googleProvider.setCustomParameters({
            prompt: 'select_account'
        });
    }

    setupFacebookProvider() {
        this.facebookProvider = new FacebookAuthProvider();
        this.facebookProvider.addScope('email');
        this.facebookProvider.addScope('public_profile');
    }

    setupAuthStateListener() {
        onAuthStateChanged(auth, async (user) => {
            const previousUser = this.currentUser;
            this.currentUser = user;

            if (user) {
                await this.ensureUserDocument(user);
                this.notifyAuthStateListeners('signIn', user, previousUser);
            } else {
                this.notifyAuthStateListeners('signOut', null, previousUser);
            }
        });
    }

    // Add auth state listener
    addAuthStateListener(callback) {
        this.authStateListeners.push(callback);
        // Call immediately with current state
        if (this.currentUser) {
            callback('signIn', this.currentUser, null);
        }
    }

    // Remove auth state listener
    removeAuthStateListener(callback) {
        const index = this.authStateListeners.indexOf(callback);
        if (index > -1) {
            this.authStateListeners.splice(index, 1);
        }
    }

    // Notify all auth state listeners
    notifyAuthStateListeners(event, user, previousUser) {
        this.authStateListeners.forEach(callback => {
            try {
                callback(event, user, previousUser);
            } catch (error) {
                console.error('Auth state listener error:', error);
            }
        });
    }

    // Google Sign-In
    async signInWithGoogle() {
        showLoading('Signing in with Google...');
        try {
            const result = await signInWithPopup(auth, this.googleProvider);
            const user = result.user;
            
            showNotification(`Welcome back, ${user.displayName || user.email}!`, 'success');
            
            return { success: true, user, provider: 'google' };
        } catch (error) {
            console.error('Google Sign-In error:', error);
            const errorMessage = this.formatAuthError(error);
            showNotification(errorMessage, 'error');
            return { success: false, error: errorMessage };
        } finally {
            hideLoading();
        }
    }

    // Facebook Sign-In
    async signInWithFacebook() {
        showLoading('Signing in with Facebook...');
        try {
            const result = await signInWithPopup(auth, this.facebookProvider);
            const user = result.user;
            
            showNotification(`Welcome back, ${user.displayName || user.email}!`, 'success');
            
            return { success: true, user, provider: 'facebook' };
        } catch (error) {
            console.error('Facebook Sign-In error:', error);
            const errorMessage = this.formatAuthError(error);
            showNotification(errorMessage, 'error');
            return { success: false, error: errorMessage };
        } finally {
            hideLoading();
        }
    }

    // Email/Password Sign-In
    async signInWithEmail(email, password) {
        showLoading('Signing in...');
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;
            
            showNotification('Welcome back!', 'success');
            
            return { success: true, user, provider: 'email' };
        } catch (error) {
            console.error('Email Sign-In error:', error);
            const errorMessage = this.formatAuthError(error);
            showNotification(errorMessage, 'error');
            return { success: false, error: errorMessage };
        } finally {
            hideLoading();
        }
    }

    // Email/Password Sign-Up
    async signUpWithEmail(email, password, displayName) {
        showLoading('Creating your account...');
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;
            
            // Update profile with display name
            if (displayName) {
                await updateProfile(user, { displayName });
            }
            
            // Send email verification
            await sendEmailVerification(user);
            
            showNotification('Account created successfully! Please check your email to verify your account.', 'success');
            
            return { success: true, user, provider: 'email' };
        } catch (error) {
            console.error('Email Sign-Up error:', error);
            const errorMessage = this.formatAuthError(error);
            showNotification(errorMessage, 'error');
            return { success: false, error: errorMessage };
        } finally {
            hideLoading();
        }
    }

    // Sign Out
    async signOutUser() {
        showLoading('Signing out...');
        try {
            await signOut(auth);
            showNotification('You have been signed out.', 'info');
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            const errorMessage = this.formatAuthError(error);
            showNotification(errorMessage, 'error');
            return { success: false, error: errorMessage };
        } finally {
            hideLoading();
        }
    }

    // Password Reset
    async resetPassword(email) {
        showLoading('Sending reset email...');
        try {
            await sendPasswordResetEmail(auth, email);
            showNotification('Password reset email sent! Check your inbox.', 'success');
            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            const errorMessage = this.formatAuthError(error);
            showNotification(errorMessage, 'error');
            return { success: false, error: errorMessage };
        } finally {
            hideLoading();
        }
    }

    // Update Password
    async updateUserPassword(currentPassword, newPassword) {
        showLoading('Updating password...');
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No user signed in');
            }

            // Re-authenticate user
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);

            showNotification('Password updated successfully!', 'success');
            return { success: true };
        } catch (error) {
            console.error('Password update error:', error);
            const errorMessage = this.formatAuthError(error);
            showNotification(errorMessage, 'error');
            return { success: false, error: errorMessage };
        } finally {
            hideLoading();
        }
    }

    // Delete Account
    async deleteAccount(password) {
        showLoading('Deleting account...');
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('No user signed in');
            }

            // Re-authenticate user if they have email/password
            if (user.email) {
                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);
            }

            // Delete user data from Firestore
            await this.deleteUserData(user.uid);

            // Delete user from Firebase Auth
            await deleteUser(user);

            showNotification('Account deleted successfully.', 'info');
            return { success: true };
        } catch (error) {
            console.error('Account deletion error:', error);
            const errorMessage = this.formatAuthError(error);
            showNotification(errorMessage, 'error');
            return { success: false, error: errorMessage };
        } finally {
            hideLoading();
        }
    }

    // Ensure user document exists in Firestore
    async ensureUserDocument(user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            // Create new user document
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0],
                photoURL: user.photoURL || null,
                provider: user.providerData[0]?.providerId || 'email',
                createdAt: serverTimestamp(),
                lastLoginAt: serverTimestamp(),
                emailVerified: user.emailVerified,
                role: 'user', // Default role
                preferences: {
                    theme: 'light',
                    notifications: true,
                    dataSharing: false,
                    newsletter: true
                },
                stats: {
                    reportsGenerated: 0,
                    chartsCreated: 0,
                    dataProcessed: 0,
                    apiCalls: 0,
                    lastActivityAt: serverTimestamp()
                },
                subscription: {
                    plan: 'free',
                    status: 'active',
                    startDate: serverTimestamp(),
                    usage: {
                        reportsThisMonth: 0,
                        apiCallsThisMonth: 0,
                        dataProcessedThisMonth: 0
                    }
                }
            };
            
            await setDoc(userRef, userData);
            console.log('User document created:', user.uid);
        } else {
            // Update last login time and email verification status
            await updateDoc(userRef, {
                lastLoginAt: serverTimestamp(),
                emailVerified: user.emailVerified
            });
        }
    }

    // Get user document from Firestore
    async getUserDocument(uid) {
        try {
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                return { success: true, data: userDoc.data() };
            } else {
                return { success: false, error: 'User document not found' };
            }
        } catch (error) {
            console.error('Error getting user document:', error);
            return { success: false, error: error.message };
        }
    }

    // Update user document
    async updateUserDocument(uid, updates) {
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating user document:', error);
            return { success: false, error: error.message };
        }
    }

    // Update user statistics
    async updateUserStats(uid, statsUpdate) {
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
                [`stats.${statsUpdate.type}`]: increment(statsUpdate.value || 1),
                'stats.lastActivityAt': serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating user stats:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete user data
    async deleteUserData(uid) {
        try {
            // Delete user document
            const userRef = doc(db, 'users', uid);
            await deleteDoc(userRef);

            // Delete user reports
            const reportsQuery = query(collection(db, 'reports'), where('userId', '==', uid));
            const reportsSnapshot = await getDocs(reportsQuery);
            const deletePromises = reportsSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);

            // Delete user analytics
            const analyticsQuery = query(collection(db, 'analytics'), where('userId', '==', uid));
            const analyticsSnapshot = await getDocs(analyticsQuery);
            const analyticsDeletePromises = analyticsSnapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(analyticsDeletePromises);

            console.log('User data deleted successfully:', uid);
            return { success: true };
        } catch (error) {
            console.error('Error deleting user data:', error);
            return { success: false, error: error.message };
        }
    }

    // Format error messages for display
    formatAuthError(error) {
        const errorMessages = {
            'auth/user-not-found': 'No account found with this email address.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/email-already-in-use': 'An account with this email already exists.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/network-request-failed': 'Network error. Please check your connection.',
            'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
            'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
            'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
            'auth/requires-recent-login': 'Please sign in again to complete this action.',
            'auth/operation-not-allowed': 'This sign-in method is not enabled.',
            'auth/account-exists-with-different-credential': 'An account already exists with this email but different sign-in method.'
        };
        
        return errorMessages[error.code] || 'An unexpected error occurred. Please try again.';
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
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

    // Get user ID token with force refresh
    async getIdTokenForceRefresh() {
        if (this.currentUser) {
            return await this.currentUser.getIdToken(true);
        }
        return null;
    }

    // Check if user is admin
    async isAdmin() {
        if (!this.currentUser) return false;
        
        try {
            const userDoc = await this.getUserDocument(this.currentUser.uid);
            return userDoc.success && userDoc.data.role === 'admin';
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    }
}

// Create and export auth service instance
export const mahiLLMAuth = new MahiLLMAuthService();

// Export individual functions for backward compatibility
export {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    FacebookAuthProvider,
    showNotification,
    showLoading,
    hideLoading
};
