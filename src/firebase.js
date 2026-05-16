import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBes4jevM_Cv6vVKZ-QEQG6ZbTsuPVQv0w",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "boutique-vetements-54434.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "boutique-vetements-54434",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "boutique-vetements-54434.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "872991677774",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:872991677774:web:1dc2f29ac0ae9143b9921f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
