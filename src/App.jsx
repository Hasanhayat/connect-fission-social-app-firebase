import { useState } from 'react'
import './App.css'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


function App() {
  const [count, setCount] = useState(0)
  const firebaseConfig = {
    apiKey: "AIzaSyBJe4DHOGbe8AZNW-f7c_rb3oKz-9Olt1g",
    authDomain: "connectfission.firebaseapp.com",
    projectId: "connectfission",
    storageBucket: "connectfission.firebasestorage.app",
    messagingSenderId: "404496495034",
    appId: "1:404496495034:web:3568d32f4915d5bc686d83",
    measurementId: "G-XS7GCHLZDP"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  return (
    <>
      <h1>ConnectFission</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
       <button>SignUp</button>
      </div>
    </>
  )
}

export default App
