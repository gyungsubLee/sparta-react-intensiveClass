import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCp8mlKL4SAmWQBmwno6-XoGHW5LwtLyVs",
  authDomain: "image-comm-91fe0.firebaseapp.com",
  projectId: "image-comm-91fe0",
  storageBucket: "image-comm-91fe0.appspot.com",
  messagingSenderId: "763082454391",
  appId: "1:763082454391:web:9613516a3d9048ee439d72",
  measurementId: "G-67427CPVFP"
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export{auth, apiKey, firestore, storage};