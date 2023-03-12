
import ReactDOM from 'react-dom';
import ApolloProvider from './ApolloProvider';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

ReactDOM.render(ApolloProvider, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAEsMAJI-2Z41FJWM0K0sBCHaiLXNiEtjA",
    authDomain: "learning-380319.firebaseapp.com",
    projectId: "learning-380319",
    storageBucket: "learning-380319.appspot.com",
    messagingSenderId: "99234643110",
    appId: "1:99234643110:web:243554314297358cf0c867"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);