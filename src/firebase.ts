// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCemiJDmbLGkhXw5IGqeBmx-k7aTgpVimM",
  authDomain: "sentencegram.firebaseapp.com",
  projectId: "sentencegram",
  storageBucket: "sentencegram.appspot.com",
  messagingSenderId: "16323195765",
  appId: "1:16323195765:web:29308f97cd921f8716193c"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)