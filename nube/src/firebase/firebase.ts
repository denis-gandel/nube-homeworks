// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  getAuth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOZaZOblcCB1qAX0leo45NtGvMkHhpeWc",
  authDomain: "mobile-dev-2025.firebaseapp.com",
  projectId: "mobile-dev-2025",
  storageBucket: "mobile-dev-2025.firebasestorage.app",
  messagingSenderId: "55756156714",
  appId: "1:55756156714:web:b62074477d8917dc0c7853",
  measurementId: "G-N89HKJ2RZY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
