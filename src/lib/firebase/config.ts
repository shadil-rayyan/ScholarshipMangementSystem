import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCJ4Ky6abQr_hlYFQAsEFhHKTKV3dm-ct8",
  authDomain: "darsana-11b75.firebaseapp.com",
  projectId: "darsana-11b75",
  storageBucket: "darsana-11b75.appspot.com",
  messagingSenderId: "982681301910",
  appId: "1:982681301910:web:0b9c449a15f31bb6af23b7",
  measurementId: "G-VMVTZDCKWK"
};

const firebaseApp: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
