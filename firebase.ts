
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBfUOHNxENcxOuVwMLSNtNyHJFRk3GwewU",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gitgrad-30d33.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gitgrad-30d33",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gitgrad-30d33.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1092516836266",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1092516836266:web:52bb5f9e6f42b157c9f1d3",
    measurementId: "G-50QNV6BVDM"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);

// Initialize Firestore with experimentalForceLongPolling to resolve "Could not reach Cloud Firestore backend"
// This forces the client to use HTTP long-polling instead of WebSockets, which is more stable in some environments.
let firestore;
try {
    // Attempt to initialize with specific settings
    firestore = initializeFirestore(app, {
        experimentalForceLongPolling: true,
    });
} catch (e) {
    // If the SDK has already initialized Firestore (e.g. during hot reload), fallback to getting the existing instance
    firestore = getFirestore(app);
}

export const db = firestore;
