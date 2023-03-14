
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
  apiKey: "AIzaSyD0saFzPKOBe1sgmqIDuH9-v39_9wazxDk",
  authDomain: "cmpt474-95a5e.firebaseapp.com",
  projectId: "cmpt474-95a5e",
  storageBucket: "cmpt474-95a5e.appspot.com",
  messagingSenderId: "254653835170",
  appId: "1:254653835170:web:61694b7721765e9e1934fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);