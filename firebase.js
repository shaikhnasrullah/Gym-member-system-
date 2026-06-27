import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// 🔽 Apna existing firebaseConfig yahan paste karo (jo pehle se tha)
const firebaseConfig = {
  apiKey: "AIzaSyBHSFdvPAI1kz91whHbTj0rgUefVhPthLc",
  authDomain: "loginpage1-16430.firebaseapp.com",
  projectId: "loginpage1-16430",
  storageBucket: "loginpage1-16430.firebasestorage.app",
  messagingSenderId: "438297643443",
  appId: "1:438297643443:web:a2a75a2873d2746613e3c6"
};    
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
