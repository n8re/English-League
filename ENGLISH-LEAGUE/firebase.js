import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyArZhI2_NjY9AU366tH133vBzVkVtX-7Uo",
  authDomain: "english-league-8584f.firebaseapp.com",
  projectId: "english-league-8584f",
  storageBucket: "english-league-8584f.firebasestorage.app",
  messagingSenderId: "613009575801",
  appId: "1:613009575801:web:bebd40e482975e495a29a8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };