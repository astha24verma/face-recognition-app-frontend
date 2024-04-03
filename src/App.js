import React, { useState, useRef, useEffect } from 'react';
import WebcamComponent from './components/WebcamComponent';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  const [user, setUser] = useState("");
  const webcamRef = useRef(null);

  return (
    <div className="App">
      <h1 className='App-name'>Face Recognition App</h1>
      <WebcamComponent setUser={setUser} webcamRef={webcamRef} />
      {/* <LoginForm setUser={setUser} /> */}
      <br />

      </div>
  );
}

export default App;