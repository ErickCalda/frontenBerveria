// src/firebase/index.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDiromxFjwKCIa34Jnu1YK_GFYB2I2Jy3A",
  authDomain: "barberia-3957b.firebaseapp.com",
  projectId: "barberia-3957b",
  storageBucket: "barberia-3957b.firebasestorage.app",
  messagingSenderId: "474302543051",
  appId: "1:474302543051:web:433a8e63f68870786a174e",
  measurementId: "G-NKXVP4EBYJ"
    
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
