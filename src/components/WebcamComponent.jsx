import { FaceRecognition } from '../utils/FaceRecognition.jsx';

const WebcamComponent = ({ setUser }) => {

  return (
    <div>
      <FaceRecognition setUser={setUser} />
    </div>
  );
};

export default WebcamComponent;