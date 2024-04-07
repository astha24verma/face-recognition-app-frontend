import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const LoginForm = ({ handleLoginClick, setUser, user, isLoginInProgress }) => {
  const [loginMessage, setLoginMessage] = useState('');

  const handleLogin = async () => {
    try {
      const username = await handleLoginClick();
      if (username) {
        setUser(username);
        setLoginMessage('Login successful. Welcome ' + username + '!')
      } else {
        setLoginMessage('User not recognized. Please try again or register.');
      }
    } catch (error) {
      setLoginMessage('Error occurred during login');
    }
  };

  return (
    <>
    <div className='mt-2 mb-3'>
      <p>Capture your face and login</p>
      {loginMessage && <p>{setLoginMessage}</p>}
      
      {
      isLoginInProgress ? 
      (<Spinner animation="grow" variant="dark" />) : 
      (<Button variant="success" size='sm' onClick={handleLogin} disabled={isLoginInProgress}> Login  </Button>)
      }      
      
    </div>
    </>

  );
};

export default LoginForm;