import React, { useState, useRef, useEffect } from 'react';
import WebcamComponent from './components/WebcamComponent';
import UserProfile from './components/UserProfile';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [user, setUser] = useState("");
  const webcamRef = useRef(null);

  return (
    <div className="App">
      <div class="container h-100">
        <div class="row h-100 justify-content-center align-items-center">

          <h2 className='text-center mb-3'>Face Recognition App</h2>
          <WebcamComponent className='text-center' setUser={setUser} webcamRef={webcamRef} />
          {/* <LoginForm setUser={setUser} /> */}
          <br />

        </div>
      </div>
    </div>
  );
}

export default App;