import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAN93RwM--VDaresds_kNIM7dnNBnmy_-M",
  authDomain: "octavian-bb02e.firebaseapp.com",
  projectId: "octavian-bb02e",
  storageBucket: "octavian-bb02e.firebasestorage.app",
  messagingSenderId: "63748427465",
  appId: "1:63748427465:web:e55608290b72eb073b4718",
  measurementId: "G-L463303XJL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db }; 