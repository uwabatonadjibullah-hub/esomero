// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCH1AKY9k0-Vu78knRgpgiYWDRJ7qBZ-ok",
  authDomain: "esomero-d4f01.firebaseapp.com",
  projectId: "esomero-d4f01",
  storageBucket: "esomero-d4f01.appspot.com",
  messagingSenderId: "864074142834",
  appId: "1:864074142834:web:cdcb65665d289434eadeeb",
  measurementId: "G-2VHTFMBY34"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };