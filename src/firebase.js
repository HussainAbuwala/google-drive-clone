import firebase from 'firebase/compat/app';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
    getFirestore,
    serverTimestamp,
    collection,
    addDoc,
    getDoc,
    doc,
    query,
    where,
    onSnapshot,
    orderBy
 } 
from "firebase/firestore";
import { 
    getStorage, 
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject  } 
from "firebase/storage";



const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
const firestore = getFirestore(app);
export const storage = getStorage(app);

export const database = {
    folders: collection(firestore, "folders"),
    files: collection(firestore, "files"),
    addDoc: addDoc,
    getCurrentTimestamp: serverTimestamp,
    formatDoc: doc => {
        return { id: doc.id, ...doc.data() }
    },
    doc,
    getDoc,
    firestore,
    query,
    where,
    onSnapshot,
    orderBy,
    ref,
    uploadBytesResumable,
    storage,
    getDownloadURL
}

export default app