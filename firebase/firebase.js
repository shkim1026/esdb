
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyD3MgroGV7tj6Spb2VdadYR4dcAgGY_pww",
  authDomain: "esdb-4bc35.firebaseapp.com",
  projectId: "esdb-4bc35",
  storageBucket: "esdb-4bc35.firebasestorage.app",
  messagingSenderId: "693041236078",
  appId: "1:693041236078:web:6464c0fe14005ea489fe7f",
  measurementId: "G-Z5PKKM5HCH"
};

const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const gitHubProvider = new GithubAuthProvider();