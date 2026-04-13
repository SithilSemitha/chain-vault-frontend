import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase config (get from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyAx-aGW0ZJWX82lhNTc92iG-5WNRRB4lTw",
  authDomain: "chainvault-873dc.firebaseapp.com",
  projectId: "chainvault-873dc",
  storageBucket: "chainvault-873dc.firebasestorage.app",
  messagingSenderId: "714224702888",
  appId: "1:714224702888:web:9ee9d470e7dec8771a399d",
  measurementId: "G-C4NRYCMJ1Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
