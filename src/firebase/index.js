// src/firebase/index.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAby_NJ7qzsZAlAgM0ZSYAlCaAD63zKQoQ",
  authDomain: "apis-practicas.firebaseapp.com",
  projectId: "apis-practicas",
  storageBucket: "apis-practicas.firebasestorage.app",
  messagingSenderId: "238597549460",
  appId: "1:238597549460:web:59d0b72e4b081c23a83381",
  measurementId: "G-5WHRV98FZN"
    
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
