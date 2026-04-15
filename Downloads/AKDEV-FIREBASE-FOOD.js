import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics"; // 👈 1. Import it

const firebaseConfig = {
    apiKey: "AIzaSyA9z7TwrhnhTqQMzc42souF3H1LRt9zPcc",
    authDomain: "cit-food-finder-akdev.firebaseapp.com",
    projectId: "cit-food-finder-akdev",
    storageBucket: "cit-food-finder-akdev.firebasestorage.app",
    messagingSenderId: "1056653722309",
    appId: "1:1056653722309:web:3ade54fbd4357158ace6ac",
    measurementId: "G-JB4VM577H7"
};

const app = initializeApp(firebaseConfig);

// Export your services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app); // 👈 2. Initialize it