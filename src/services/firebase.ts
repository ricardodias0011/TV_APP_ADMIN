import firebase, { initializeApp } from "firebase/app";
import { browserLocalPersistence, browserSessionPersistence, getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBESkrLIL-Pmb3NdVnvx-A8Z4QkbgwqlKc",
  authDomain: "nexus-tv-45ee6.firebaseapp.com",
  projectId: "nexus-tv-45ee6",
  storageBucket: "nexus-tv-45ee6.appspot.com",
  messagingSenderId: "387805062188",
  appId: "1:387805062188:web:5e93fc07af0b8804965d89"
};
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const dbFirestor = getFirestore(app);
