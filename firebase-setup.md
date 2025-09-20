# Firebase Setup Guide for MahiLLM

## 🚀 Quick Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name: `mahillm-ai-platform`
4. Enable Google Analytics (recommended)
5. Create project

### 2. Enable Authentication
1. In Firebase Console → Authentication → Sign-in method
2. Enable **Google** provider
3. Enable **Facebook** provider (optional)
4. Enable **Email/Password** provider

### 3. Create Firestore Database
1. In Firebase Console → Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select location closest to your users

### 4. Get Configuration
1. In Firebase Console → Project Settings → General
2. Scroll down to "Your apps"
3. Click "Web app" icon
4. Register app name: `mahillm-web`
5. Copy the config object

### 5. Configure Domain Authorization
1. In Authentication → Settings → Authorized domains
2. Add your domains:
   - `localhost` (for development)
   - `your-vercel-domain.vercel.app`
   - `your-custom-domain.com`

## 🔧 Configuration Template

Replace the values in `firebase-config.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

## 🔐 Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reports are user-specific
    match /reports/{reportId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Admin access for user management
    match /admin/{document} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🌐 Hosting Setup

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

### Environment Variables
Set these in your hosting platform (Vercel/Netlify):
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID`

## 📊 Database Schema

### Users Collection
```javascript
{
  uid: "user-id",
  email: "user@example.com",
  displayName: "User Name",
  photoURL: "https://...",
  providerId: "google.com",
  createdAt: "2024-01-01T00:00:00Z",
  lastLoginAt: "2024-01-01T00:00:00Z",
  role: "user", // "user" | "admin"
  usage: {
    reportsGenerated: 0,
    dataProcessedMB: 0,
    lastReportAt: "2024-01-01T00:00:00Z"
  },
  preferences: {
    theme: "light",
    notifications: true,
    newsletter: true
  }
}
```

### Reports Collection
```javascript
{
  id: "report-id",
  userId: "user-id",
  title: "Sales Report Q1 2024",
  description: "Quarterly sales analysis",
  data: {
    // Processed data
  },
  insights: [
    "Revenue increased by 23%",
    "Top performing category: Technology"
  ],
  charts: [
    {
      type: "line",
      data: {...}
    }
  ],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  status: "completed", // "processing" | "completed" | "failed"
  fileSize: 1024000, // bytes
  processingTime: 5.2 // seconds
}
```

## 🔑 Authentication Flow

### Google OAuth Setup
1. In Firebase Console → Authentication → Sign-in method
2. Enable Google provider
3. Add authorized domains
4. Configure OAuth consent screen in Google Cloud Console

### Facebook OAuth Setup (Optional)
1. Create Facebook App at [Facebook Developers](https://developers.facebook.com/)
2. Add Facebook Login product
3. Configure OAuth redirect URIs
4. Enable in Firebase Authentication

## 📱 Testing Credentials

### Test Users
- **Admin User**: `admin@mahillm.com` / `Admin123!`
- **Regular User**: `user@mahillm.com` / `User123!`
- **Google User**: Use any Google account
- **Facebook User**: Use any Facebook account

## 🚀 Deployment Checklist

- [ ] Firebase project created
- [ ] Authentication providers enabled
- [ ] Firestore database created
- [ ] Security rules configured
- [ ] Domain authorization set up
- [ ] Environment variables configured
- [ ] Hosting deployed
- [ ] Authentication flow tested
- [ ] Database operations tested
- [ ] Admin panel accessible

## 🔧 Troubleshooting

### Common Issues
1. **CORS errors**: Check authorized domains
2. **Permission denied**: Verify Firestore rules
3. **Auth errors**: Check provider configuration
4. **API key issues**: Verify config values

### Debug Mode
Enable debug logging:
```javascript
import { connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator } from "firebase/firestore";

if (location.hostname === 'localhost') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## 📞 Support
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support
- MahiLLM Issues: Create GitHub issue
