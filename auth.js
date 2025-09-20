// auth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// Your web app's Firebase configuration
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
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('Sign up successful:', user);
                alert('Sign up successful! User: ' + user.email);
            } catch (error) {
                console.error('Sign up error:', error.message);
                alert('Sign up failed: ' + error.message);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log('Log in successful:', user);
                alert('Log in successful! User: ' + user.email);
                // Redirect to dashboard or other page after successful login
            } catch (error) {
                console.error('Log in error:', error.message);
                alert('Log in failed: ' + error.message);
            }
        });
    }
});