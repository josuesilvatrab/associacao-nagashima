import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKrF_8fGOhQqURtP1hvr3tB5dUpt-M49U",
  authDomain: "associacao-nagashima.firebaseapp.com",
  projectId: "associacao-nagashima",
  storageBucket: "associacao-nagashima.firebasestorage.app",
  messagingSenderId: "624466933586",
  appId: "1:624466933586:web:2136dfb14f01a472b2ac8b",
  measurementId: "G-L4ZQWFCNV6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
