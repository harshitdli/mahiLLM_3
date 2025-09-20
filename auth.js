// auth.js

import { authService } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const googleSignUpBtn = document.getElementById('googleSignUp');

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            // Handle signup form submission (AJAX call to server)
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log('Signup data:', { firstName, lastName, username, email, password });

            // TODO: Send data to server for registration
            alert('Email Signup functionality not yet implemented. Check the console for the data.');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            // Handle login form submission (AJAX call to server)
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log('Login data:', { email, password });
            // TODO: Send data to server for authentication
            alert('Login functionality not yet implemented. Check the console for the data.');
        });
    }

    if (googleSignUpBtn) {
        googleSignUpBtn.addEventListener('click', async () => {
            try {
                const result = await authService.signInWithGoogle();
                if (result.success) {
                    console.log('Google sign-up successful:', result.user);
                    // TODO: Redirect to dashboard or update UI
                    alert('Google sign-up successful! Check the console for user data.');
                } else {
                    console.error('Google sign-up failed:', result.error);
                    alert('Google sign-up failed: ' + result.error);
                }
            } catch (error) {
                console.error('Google sign-up error:', error);
                alert('An error occurred during Google sign-up: ' + error);
            }
        });
    }
});