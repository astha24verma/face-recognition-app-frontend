import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const RegisterForm = ({ handleRegistration }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistration(username); // Call the registerUser function in FaceRecognition.jsx
    console.log("RegisterForm.jsx : handleSubmit -> " + username);
    setUsername('');
  };

  return (
    <div className='text-center' >
      <h3 className='text-hightlight'>Not a member?</h3>
      <p>Capture your face and enter username to register </p>
      <div className="d-flex justify-content-center mb-5">
        <Form onSubmit={handleSubmit} method='post' name='register'>
          <InputGroup >
            <Form.Control type="text"
              size="sm"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
            <Button className="ms-2" variant="danger" size='sm' type="submit" name='submit'>Register</Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};

export default RegisterForm;