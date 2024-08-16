import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyC3UKn9J3YMip4sD36XqSqDVrTgpk-JSSs",
  authDomain: "hsflashcards-cc77e.firebaseapp.com",
  projectId: "hsflashcards-cc77e",
  storageBucket: "hsflashcards-cc77e.appspot.com",
  messagingSenderId: "53301500644",
  appId: "1:53301500644:web:f4bce6efdf530bb353aaf1",
  measurementId: "G-MM3SHMN720"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics;
if (typeof window !== 'undefined') {
  // Check if Analytics is supported in the current environment
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default db;
export { app, analytics };
