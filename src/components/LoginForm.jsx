// LoginForm.js
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

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
    <div className='mt-2 mb-3'>
      <p>Capture your face and login</p>
      {loginMessage && <p>{setLoginMessage}</p>}
      <Button variant="success" size='sm' onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default LoginForm;