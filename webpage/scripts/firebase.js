// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyB_i9G4r6SqvFqgBfU3gkCnLV3loWF7mDE",
authDomain: "mktanon-6b895.firebaseapp.com",
projectId: "mktanon-6b895",
storageBucket: "mktanon-6b895.appspot.com",
messagingSenderId: "172601852702",
appId: "1:172601852702:web:c21baaf23fb386563fff0f",
measurementId: "G-LD6Q341849"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
