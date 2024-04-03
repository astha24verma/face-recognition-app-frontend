// LoginForm.js
import React, { useState } from 'react';

const LoginForm = ({ handleLoginClick, setUser }) => {
  const [loginMessage, setLoginMessage] = useState('');

  const handleLogin = async () => {
    try {
      const user = await handleLoginClick();
      if (user) {
        setUser(user);
        setLoginMessage('Login successful. Welcome ' + user + '!')
      } else {
        setLoginMessage('User not recognized. Please try again or register.');
      }
    } catch (error) {
      setLoginMessage('Error occurred during login');
    }
  };

  return (
    <div>
      <p>Capture your face by keeping it center and click login</p>
      {loginMessage && <p>{setLoginMessage}</p>}
      <button className='btn' onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;