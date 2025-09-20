// auth.js

import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const googleSignUpBtn = document.getElementById('googleSignUp');

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

    if (googleSignUpBtn) {
        googleSignUpBtn.addEventListener('click', async () => {
            const provider = new GoogleAuthProvider();

            try {
                const result = await signInWithPopup(auth, provider);
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log('Google sign-up successful:', user);
                alert('Google sign-up successful! User: ' + user.displayName);
                // You can redirect to dashboard here
            } catch (error) {
                console.error('Google sign-up error:', error);
                alert('Google sign-up failed: ' + error.message);
            }
        });
    }
});