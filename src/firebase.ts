// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// IMPORTANT: Replace with your own Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBG5ThopzP4nAM3oD4pPtH852I5yQKNXFg",
  authDomain: "control-de-stock-44861.firebaseapp.com",
  projectId: "control-de-stock-44861",
  storageBucket: "control-de-stock-44861.appspot.com",
  messagingSenderId: "336955632479",
  appId: "1:336955632479:web:47a9f32d72ffd0ef9524ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
