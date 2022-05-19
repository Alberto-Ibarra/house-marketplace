import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPFZr3BujVzkb7Q498T1DbDbsM-ZNTjKc",
    authDomain: "house-marketplace-app-860dc.firebaseapp.com",
    projectId: "house-marketplace-app-860dc",
    storageBucket: "house-marketplace-app-860dc.appspot.com",
    messagingSenderId: "396196884783",
    appId: "1:396196884783:web:0a16774a43843999d3b1da"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()