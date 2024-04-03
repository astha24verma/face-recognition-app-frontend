import React, { useEffect } from 'react';
import { FaceRecognition } from '../utils/FaceRecognition.jsx';

const WebcamComponent = ({ setUser, webcamRef }) => {

  return (
    <div>
      <FaceRecognition setUser={setUser} webcamRef={webcamRef} />
    </div>
  );
};

export default WebcamComponent;