import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import { getAuth, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDkb8gaMrYs4i5l7a9tNgAjNsFGjiAddFE",
  authDomain: "qwitter-f3963.firebaseapp.com",
  projectId: "qwitter-f3963",
  storageBucket: "qwitter-f3963.appspot.com",
  messagingSenderId: "649466289915",
  appId: "1:649466289915:web:f0ef209333ddb599a75a5e",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default db;
