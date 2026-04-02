import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYqfwS96DsY7coBovY3UQrmkfTrJe0hko",
  authDomain: "infinity-app-adab9.firebaseapp.com",
  projectId: "infinity-app-adab9",
  storageBucket: "infinity-app-adab9.firebasestorage.app",
  messagingSenderId: "897933664176",
  appId: "1:897933664176:web:eb955d1763c60524c54075"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();