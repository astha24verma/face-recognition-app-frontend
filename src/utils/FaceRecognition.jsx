import React, { useRef, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

// const baseURI = 'http://localhost:5000';
const baseURI = 'https://face-recognition-app-backend-re21.onrender.com';


export const loadModels = async () => {
  // const MODEL_URL = process.env.PUBLIC_URL + '/models';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  ]);
};

export const captureFaceDescriptors = async (imageElement) => {
  try {
    if (imageElement instanceof HTMLImageElement) {
      const detections = await faceapi
        .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        console.log("detections =====> " + detections.descriptor);
        return detections.descriptor;
      } else {
        throw new Error('No face detected');
      }
    } else {
      throw new Error('Image element is not an instance of HTMLImageElement');
    }
  } catch (error) {
    console.error('Error : ', error);
  }
};

// function to detect face
export const FaceRecognition = ({ setUser }) => {

  const webcamRef = useRef(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [recognizedUser, setRecognizedUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);
  // const [capturedImage, setCapturedImage] = useState(null);       // for captured image to display
  const [capturedImageData, setCapturedImageData] = useState(null);  // for captured image data to send to server
  const [isWebcamActive, setIsWebcamActive] = useState(true);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const [show, setShow] = useState(true);


  useEffect(() => {
    loadModels();
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);  // Set isLoggedIn to true if token exists
  }, []);

  const captureImage = () => {
    return new Promise((resolve, reject) => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          const base64Image = imageSrc.split(',')[1]; // Extract base64 data from the data URL
          console.log("base64Image ==> " + base64Image);
          setCapturedImageData(base64Image);
          setIsWebcamActive(false); // Stop the webcam
          resolve(base64Image);
        } else {
          reject(new Error('Failed to capture screenshot'));
        }
      } else {
        reject(new Error('Webcam component not available'));
      }
    });
  };

  const restartWebcam = () => {
    setIsWebcamActive(true);
    setCapturedImageData(null);
  };

  const detectFace = async (type) => {
    console.log("isLoginInProgress => " + isLoginInProgress);
    if (isLoginInProgress) return;
    if (capturedImageData) {
      setIsLoginInProgress(true); // Set login in progress
      const imageElement = new Image();
      imageElement.src = `data:image/jpeg;base64,${capturedImageData}`;

      const descriptor = await captureFaceDescriptors(imageElement);
      console.log("descriptor :::> " + descriptor);
      const descriptors = [];
      console.log('type of descriptors :(detect face) ' + typeof (descriptors));
      console.log("descriptors :::> " + descriptors);
      descriptors.push(descriptor);
      console.log("capturedImgage => " + imageElement.src + " \n descriptors => " + descriptors);
      if (descriptors === undefined) return;

      console.log("recognizedUser => " + recognizedUser + " faceDetected => " + faceDetected);
      if (descriptors) {
        if (descriptors.length > 0) {
          if (type === "register") {
            const username = localStorage.getItem('username');
            if (capturedImageData && username) {
              const imageElement = new Image();
              imageElement.src = `data:image/jpeg;base64,${capturedImageData}`;
              if (descriptors) {
                await registerUser(username, descriptors);
              } else {
                console.error('Face descriptor or username is missing');
              }
            } else {
              console.error('No face detected');
            }
          } else if (type === "login") {
            try {
              if (capturedImageData) {
                const imageElement = new Image();
                imageElement.src = `data:image/jpeg;base64,${capturedImageData}`;
                if (descriptors) {
                  await loginUser(descriptors);
                } else {
                  console.error('Face descriptor is missing');
                }
              } else {
                console.log("No image captured yet (FaceRecognition)");
              }
            } catch (error) {
              console.error('Error recognizing face:', error);
            }
          }
        } else {
          console.log("No face detected");
          setFaceDetected(false);
          setRecognizedUser(null);
        }

      } else {
        console.log("descriptor is null");
      }
      setIsLoginInProgress(false); // Reset login in progress after completion
    } else {
      console.log("No image captured yet");
    }
  }

  const handleRegistration = async (username) => {
    localStorage.setItem('username', username);
    await detectFace("register");
  }

  const registerUser = async (username, descriptors) => {
    console.log('is array : ' + Array.isArray(descriptors));

    console.log('Registering user... & descriptors => ' + descriptors + ' username => ' + username);
    try {
      const response = await axios.post(`${baseURI}/api/register`, { username, descriptors })
      if (response.status === 201) {
        // Registration successful
        setShowSuccessAlert(true);
        setShowErrorAlert(false);
        setShow(true)
        // Reset form fields or perform other actions
      } else {
        // Registration failed
        setShowSuccessAlert(false);
        setShowErrorAlert(true);
        setShow(true);
      }
      restartWebcam();
    } catch (error) {

      console.error('Error registering user(faceRec):', error);
    }
  };

  const handleLoginClick = async () => {
    await detectFace("login");
  };

  const loginUser = async (descriptors) => {
    try {
      if (!descriptors) {
        console.error('No face detected');
        return;
      }
      console.log(typeof (descriptors) + " type");
      const response = await axios.post(`${baseURI}/api/login`, { descriptors }).then(console.log("Trying to login.."));
      if (response.data.user) {
        // get the token from the response and store it in local storage
        const token = response.data.token;
        Cookies.set('token', token, { expires: 7 });

        alert("Logged in successfully");

        setUser(response.data.user);
        console.log("User logged in successfully - " + response.data.user);
        restartWebcam();
        isLoggedIn(true);
        return response.data.user;
      } else {
        alert("Face Not Matched, Register first");
        console.log("No user found");
        return null;
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className='text-center'>
      <div>
        {isWebcamActive ? (
          <Webcam ref={webcamRef} style={{ width: 640, height: 480 }} />
        ) : capturedImageData ? (
          <img src={`data:image/jpeg;base64,${capturedImageData}`} alt="Captured" style={{ width: 640, height: 480 }} />
        ) : (
          <div>No image captured</div>
        )}
      </div>

      {showSuccessAlert && (
        <Alert variant="success" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>You're Registered</Alert.Heading>
        </Alert>

      )}
      {showErrorAlert && (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Registration Failed</Alert.Heading>
          <p>Try again with your face centered.</p>
        </Alert>
      )}

      <Button onClick={isWebcamActive ? captureImage : restartWebcam} variant="danger" size="sm">{isWebcamActive ? 'Capture Image' : 'Retake Image'}</Button>{' '}
      <LoginForm handleLoginClick={handleLoginClick} setUser={setUser} />
      <RegisterForm handleRegistration={handleRegistration} setUser={setUser} />
      {faceDetected && (
        <div>
          Face detected!
          {recognizedUser ? (
            <p>Recognized user: {recognizedUser.name}</p>
          ) : (
            <p>Unknown user</p>
          )}
        </div>
      )}
    </div>
  )
};


export default FaceRecognition;