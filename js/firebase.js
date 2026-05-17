import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-Qon2VZv-heyBTBYLCrpwC_C5MDMrNws",
  authDomain: "study-mri.firebaseapp.com",
  projectId: "study-mri",
  messagingSenderId: "231073050806",
  appId: "1:231073050806:web:7d68cdc26e940b54cd7617"
};

const app = initializeApp(firebaseConfig);

/* =========================
   Firebase本体
========================= */
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/* =========================
   グローバル公開（重要）
========================= */
window.firebaseDB = db;
window.firebaseAuth = auth;
window.firebaseProvider = provider;

/* Auth関数もまとめて公開（重要） */
window.firebaseAuthLib = {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
};

/* Firestore関数 */
window.firebaseFunctions = {
  doc,
  setDoc,
  getDoc,
  deleteDoc
};

console.log("Firebase ready");