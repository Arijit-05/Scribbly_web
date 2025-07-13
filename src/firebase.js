import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD8qXvgtXYM67CCIQDnAsUMDZUOQRnny2w",
  authDomain: "scribbly-99889.firebaseapp.com",
  projectId: "scribbly-99889",
  storageBucket: "scribbly-99889.firebasestorage.app",
  messagingSenderId: "45763142237",
  appId: "1:45763142237:web:97a7bd6eff3a2d06c3a3b4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 