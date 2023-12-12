

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


 const firebaseConfig = {
   apiKey: "AIzaSyDqQbUsdoYMzoE2jHhDmd3FCrUG20ej2zQ",
   authDomain: "swingthenotes.firebaseapp.com",
   projectId: "swingthenotes",
   storageBucket: "swingthenotes.appspot.com",
   messagingSenderId: "559298323403",
   appId: "1:559298323403:web:087346ed7e6b5b6b718c4e"
 };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export{db}