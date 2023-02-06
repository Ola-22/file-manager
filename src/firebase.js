// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYXr46A2g1hkxwPueMCJtS8hWlrQ64L5Q",
  authDomain: "life-manager-cd72f.firebaseapp.com",
  databaseURL: "https://life-manager-cd72f-default-rtdb.firebaseio.com",
  projectId: "life-manager-cd72f",
  storageBucket: "life-manager-cd72f.appspot.com",
  messagingSenderId: "837015914800",
  appId: "1:837015914800:web:981ee301e54991989c60f5",
  measurementId: "G-NS25RWGMXS"
};

// Initialize Firebase


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export default getFirestore()

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getDatabase(app);
// export default getFirestore()