import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCK9svsUCYeGLT8BXw76_zsMuH9byrjPfc",
  authDomain: "email-js-253f3.firebaseapp.com",
  projectId: "email-js-253f3",
  storageBucket: "email-js-253f3.appspot.com",
  messagingSenderId: "346391937927",
  appId: "1:346391937927:web:87d62bceca1d4968cd4922",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
