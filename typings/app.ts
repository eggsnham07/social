//@ts-ignore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
//@ts-ignore
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-analytics.js";
//@ts-ignore
import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js"
//@ts-ignore
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsCMFISCDYcpSSvpn-0Q2dxfoqkg5L5yc",
  authDomain: "eggposter-44d33.firebaseapp.com",
  databaseURL: "https://eggposter-44d33-default-rtdb.firebaseio.com",
  projectId: "eggposter-44d33",
  storageBucket: "eggposter-44d33.appspot.com",
  messagingSenderId: "444745368508",
  appId: "1:444745368508:web:546112a42058a37868a1b9",
  measurementId: "G-1VQTWNCH1D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase()
export const auth = getAuth()