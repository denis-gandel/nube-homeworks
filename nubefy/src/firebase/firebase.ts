import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDOZaZOblcCB1qAX0leo45NtGvMkHhpeWc",
  authDomain: "mobile-dev-2025.firebaseapp.com",
  databaseURL: "https://mobile-dev-2025-default-rtdb.firebaseio.com",
  projectId: "mobile-dev-2025",
  storageBucket: "mobile-dev-2025.firebasestorage.app",
  messagingSenderId: "55756156714",
  appId: "1:55756156714:web:9c6848f7056693750c7853",
  measurementId: "G-JW735C4BDB",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

export const db = getFirestore(app, "nubefy");
export const storage = getStorage(app)
