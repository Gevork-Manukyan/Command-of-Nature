// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7zxd0OLObTwgH5X8Tpuwz40qtHMvRDJ4",
  authDomain: "command-of-nature.firebaseapp.com",
  projectId: "command-of-nature",
  storageBucket: "command-of-nature.firebasestorage.app",
  messagingSenderId: "1010611850395",
  appId: "1:1010611850395:web:4fcbfa3cebeb2f09e4ca3e",
  measurementId: "G-36PTZ11GSH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firestore and Auth
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };