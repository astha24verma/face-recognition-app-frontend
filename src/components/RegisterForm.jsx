import React, { useState } from 'react';

const RegisterForm = ({ handleRegistration }) => {
  console.log("RegisterForm.jsx");
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistration(username); // Call the registerUser function in FaceRecognition.jsx
    console.log("RegisterForm.jsx : handleSubmit -> " + username);
    setUsername('');
  };

  return (
    <div>
      <h3 className='text-hightlight'>Not a member?</h3>
      <p>Capture and enter username to register </p>
    <form onSubmit={handleSubmit} method='post' name='register'>
      <input className='input-box'
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button className='btn' type="submit" name='submit'>Register</button>
    </form>
    </div>
  );
};

export default RegisterForm;