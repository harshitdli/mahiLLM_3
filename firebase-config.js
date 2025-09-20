// Firebase Configuration and Setup for MahiLLM
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
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
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPzPkNxaEKFot_J2Rp_GxtkWdP2xx-8Fw",
    authDomain: "mahillm-ai-platform.firebaseapp.com",
    projectId: "mahillm-ai-platform",
    storageBucket: "mahillm-ai-platform.firebasestorage.app",
    messagingSenderId: "523805933280",
    appId: "1:523805933280:web:fb9de9776b34d2a35a1a85",
    measurementId: "G-BVME0L0FPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Initialize Analytics (only in production and if supported)
let analytics = null;
if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
        if (supported && !window.location.hostname.includes('localhost')) {
            analytics = getAnalytics(app);
        }
    });
}

// Configure Auth Providers
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Export individual functions for backward compatibility
export {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
};

// Export Firebase services and utilities
export { 
    storage, 
    analytics,
};

// Export app instance for advanced usage
export default app;