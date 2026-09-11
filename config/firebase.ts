// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {initializeAuth,getReactNativePersistence}from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4HaOkxXLClOfWc2HhFccEjtqSHa2PpT0",
  authDomain: "expense-tracker-4d0aa.firebaseapp.com",
  projectId: "expense-tracker-4d0aa",
  storageBucket: "expense-tracker-4d0aa.firebasestorage.app",
  messagingSenderId: "187673923891",
  appId: "1:187673923891:web:9d73af6c633234ebd9ae46"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// This is for Authintication
export const auth=initializeAuth(app,{
    persistence:getReactNativePersistence(AsyncStorage)
})

//ekhane Data Base er kaj
export const firestore=getFirestore(app);