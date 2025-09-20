// Firebase Configuration and Setup
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    FacebookAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs,
    serverTimestamp
} from 'firebase/firestore';

// Firebase Configuration
// Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "mahillm-project.firebaseapp.com",
    projectId: "mahillm-project",
    storageBucket: "mahillm-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id-here",
    measurementId: "your-measurement-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Configure Auth Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');

// Authentication Service Class
export class FirebaseAuthService {
    constructor() {
        this.currentUser = null;
        this.setupAuthStateListener();
    }

    setupAuthStateListener() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.currentUser = user;
                await this.ensureUserDocument(user);
                this.onUserSignIn(user);
            } else {
                this.currentUser = null;
                this.onUserSignOut();
            }
        });
    }

    // Google Sign-In
    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Get additional user info
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            
            console.log('Google Sign-In successful:', user);
            return { success: true, user, token };
        } catch (error) {
            console.error('Google Sign-In error:', error);
            return { success: false, error: error.message };
        }
    }

    // Facebook Sign-In
    async signInWithFacebook() {
        try {
            const result = await signInWithPopup(auth, facebookProvider);
            const user = result.user;
            
            console.log('Facebook Sign-In successful:', user);
            return { success: true, user };
        } catch (error) {
            console.error('Facebook Sign-In error:', error);
            return { success: false, error: error.message };
        }
    }

    // Email/Password Sign-In
    async signInWithEmail(email, password) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;
            
            console.log('Email Sign-In successful:', user);
            return { success: true, user };
        } catch (error) {
            console.error('Email Sign-In error:', error);
            return { success: false, error: error.message };
        }
    }

    // Email/Password Sign-Up
    async signUpWithEmail(email, password, displayName) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;
            
            // Update profile with display name
            await updateProfile(user, { displayName });
            
            // Send email verification
            await sendEmailVerification(user);
            
            console.log('Email Sign-Up successful:', user);
            return { success: true, user };
        } catch (error) {
            console.error('Email Sign-Up error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign Out
    async signOut() {
        try {
            await signOut(auth);
            console.log('Sign out successful');
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // Password Reset
    async resetPassword(email) {
        try {
            await sendPasswordResetEmail(auth, email);
            console.log('Password reset email sent');
            return { success: true };
        } catch (error) {
            console.error('Password reset error:', error);
            return { success: false, error: error.message };
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
                    dataSharing: false
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
            // Update last login time
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

    // Get user statistics
    async getUserStats(uid) {
        try {
            const userRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return { success: true, stats: userData.stats };
            } else {
                return { success: false, error: 'User not found' };
            }
        } catch (error) {
            console.error('Error getting user stats:', error);
            return { success: false, error: error.message };
        }
    }

    // Update user statistics
    async updateUserStats(uid, statsUpdate) {
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
                [`stats.${statsUpdate.type}`]: statsUpdate.value,
                'stats.lastActivityAt': serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating user stats:', error);
            return { success: false, error: error.message };
        }
    }

    // Event handlers (to be overridden)
    onUserSignIn(user) {
        console.log('User signed in:', user.email);
        // This will be called when user signs in
        // Override this method in your app to handle sign-in events
    }

    onUserSignOut() {
        console.log('User signed out');
        // This will be called when user signs out
        // Override this method in your app to handle sign-out events
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
}

// Create and export auth service instance
export const authService = new FirebaseAuthService();

// Export individual functions for backward compatibility
export {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    FacebookAuthProvider
};

// Utility functions
export const authUtils = {
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
            'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.'
        };
        
        return errorMessages[error.code] || 'An unexpected error occurred. Please try again.';
    },

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate password strength
    validatePassword(password) {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            isValid: password.length >= minLength,
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar,
            strength: this.calculatePasswordStrength(password)
        };
    },

    // Calculate password strength
    calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 6) score += 1;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
        
        if (score <= 2) return 'weak';
        if (score <= 4) return 'medium';
        return 'strong';
    }
};
