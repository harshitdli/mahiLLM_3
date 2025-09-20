# MahiLLM - OpenAI-Inspired AI Platform

A comprehensive AI-powered data analysis platform with Firebase Authentication, advanced features, and OpenAI-inspired design.

## 🚀 Features

### 🔐 Authentication System
- **Firebase Authentication** with Google, Facebook, and Email/Password
- **Secure Session Management** with JWT tokens
- **User Database** with Firestore integration
- **Role-based Access Control** (Admin/User roles)
- **Password Reset** and Email Verification

### 🎨 OpenAI-Inspired Design
- **Modern Typography** with Inter font family
- **Interactive Backgrounds** with mouse-following effects
- **Smooth Animations** and scroll-triggered reveals
- **Gradient Elements** and animated blobs
- **Responsive Design** for all devices

### 🤖 Advanced AI Features
- **Integrated AI Chatbot** with contextual responses
- **On-Site Content Generation** (Text, Insights, Charts)
- **Personalized Experience** with user memory
- **Real-time Analytics** and usage tracking

### 📊 Dashboard & Analytics
- **User Dashboard** with file upload and statistics
- **Admin Panel** for user and system management
- **Real-time Notifications** and activity feeds
- **Usage Analytics** and performance metrics

## 🛠️ Setup Instructions

### 1. Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project named "mahillm-project"

2. **Enable Authentication**
   - Go to Authentication > Sign-in method
   - Enable Google, Facebook, and Email/Password providers
   - Add your domain to authorized domains

3. **Setup Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)

4. **Get Configuration**
   - Go to Project Settings > General
   - Copy your Firebase config
   - Replace the config in `firebase-config.js`

### 2. Firebase Configuration

Update `firebase-config.js` with your Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "mahillm-project.firebaseapp.com",
    projectId: "mahillm-project",
    storageBucket: "mahillm-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id-here",
    measurementId: "your-measurement-id"
};
```

### 3. Firestore Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admins can read all user data
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User reports
    match /reports/{reportId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // API keys (user-specific)
    match /api-keys/{keyId} {
      allow read, write, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### 4. Social Authentication Setup

#### Google Authentication
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `http://localhost:8000` (for development)
   - `https://yourdomain.com` (for production)

#### Facebook Authentication
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs

### 5. Backend API Setup

The project includes a mock API system. For production:

1. **Deploy Backend API**
   - Use Vercel, Netlify, or your preferred platform
   - Update `backend-api.js` with your actual API URL

2. **Environment Variables**
   ```env
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   ```

### 6. Local Development

1. **Start Local Server**
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

2. **Access Application**
   - Main site: `http://localhost:8000`
   - Authentication: `http://localhost:8000/auth.html`
   - Dashboard: `http://localhost:8000/dashboard.html`

### 7. Production Deployment

#### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   ```bash
   vercel env add FIREBASE_API_KEY
   vercel env add FIREBASE_AUTH_DOMAIN
   # ... add all Firebase config variables
   ```

#### Deploy to Netlify

1. **Build Command**: `echo "No build required"`
2. **Publish Directory**: `.`
3. **Environment Variables**: Add all Firebase config

## 📁 File Structure

```
mahillm/
├── index.html              # Main homepage
├── auth.html               # Authentication page
├── dashboard.html          # User dashboard
├── styles.css              # Main stylesheet
├── script.js               # Main JavaScript
├── firebase-config.js      # Firebase configuration
├── firebase-auth.js        # Authentication system
├── backend-api.js          # Backend API integration
├── advanced-features.js    # Advanced OpenAI features
├── dashboard.js            # Dashboard functionality
├── auth.js                 # Legacy auth (deprecated)
└── api.js                  # Mock API (development)
```

## 🔧 Configuration

### Authentication Providers

Edit `firebase-config.js` to enable/disable providers:

```javascript
// Enable Google Auth
const googleProvider = new GoogleAuthProvider();

// Enable Facebook Auth  
const facebookProvider = new FacebookAuthProvider();

// Email/Password is enabled by default
```

### User Roles

Users are assigned roles in Firestore:

```javascript
// Default user role
role: 'user'

// Admin role (manually assigned)
role: 'admin'
```

### Subscription Plans

Configure plans in `firebase-config.js`:

```javascript
subscription: {
    plan: 'free', // free, plus, enterprise
    status: 'active',
    usage: {
        reportsThisMonth: 0,
        apiCallsThisMonth: 0,
        dataProcessedThisMonth: 0
    }
}
```

## 🎨 Customization

### Colors and Themes

Edit CSS variables in `styles.css`:

```css
:root {
    --color-primary: #10a37f;
    --color-secondary: #ff6b6b;
    --color-accent: #4dabf7;
    /* ... other variables */
}
```

### Typography

Change fonts in `styles.css`:

```css
:root {
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### Animations

Modify animation settings in `advanced-features.js`:

```javascript
// Particle count
this.maxParticles = 50;

// Animation speed
animation: float 20s infinite ease-in-out;
```

## 📊 Analytics & Monitoring

### User Analytics

Track user activity:

```javascript
// Track user action
await backendAPI.trackUsage({
    action: 'report_generated',
    metadata: { reportType: 'sales' }
});
```

### System Monitoring

Monitor system health:

```javascript
// Get system metrics
const health = await backendAPI.getSystemHealth();
```

## 🔒 Security Best Practices

1. **Firebase Security Rules**: Implement proper Firestore rules
2. **API Authentication**: Always validate Firebase ID tokens
3. **Input Validation**: Validate all user inputs
4. **Rate Limiting**: Implement API rate limiting
5. **HTTPS**: Always use HTTPS in production

## 🚀 Performance Optimization

1. **Image Optimization**: Use WebP format for images
2. **Code Splitting**: Implement lazy loading for modules
3. **Caching**: Use service workers for caching
4. **CDN**: Use a CDN for static assets

## 📱 Mobile Optimization

The design is fully responsive with:

- **Mobile-first CSS**: Optimized for mobile devices
- **Touch-friendly UI**: Large touch targets
- **Progressive Web App**: Can be installed on mobile

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Config Error**
   - Check Firebase configuration
   - Verify API keys are correct

2. **Authentication Not Working**
   - Check authorized domains in Firebase
   - Verify OAuth redirect URIs

3. **Firestore Permission Denied**
   - Check security rules
   - Verify user authentication

### Debug Mode

Enable debug mode in `firebase-config.js`:

```javascript
// Enable debug mode
import { connectFirestoreEmulator } from 'firebase/firestore';
```

## 📞 Support

For support and questions:

- **Email**: btech10130.23@bitmesra.ac.in
- **Phone**: +91 9508743874
- **Location**: BIT Mesra, Ranchi

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🙏 Acknowledgments

- **OpenAI** for design inspiration
- **Firebase** for authentication and database
- **Inter** for typography
- **Font Awesome** for icons

---

Built with ❤️ using LLaMA 2-7B and modern web technologies.
