import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Typography, Snackbar } from '@mui/material';
import { Videocam, VideocamOff, Camera, PersonAdd, PersonSearch } from '@mui/icons-material';
import axios from 'axios';

const Webcam = ({ setVidEmo, setFaceDetected, setIdentityMatch }) => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setError('Failed to access webcam');
    }
  };

  const stopRecording = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsRecording(false);
  };

  const captureScreenshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImages(prev => [...prev, dataUrl]);
      return dataUrl;
    }
  };

  const sendToBackend = async (imageDataUrl) => {
    try {
      const response = await axios.post('http://localhost:9000/getVideoEmotion', {
        img: imageDataUrl
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Emotion detection success:', response.data);
      setVidEmo(response.data.emotion);
      return response.data;
    } catch (error) {
      console.error('Error in emotion detection:', error);
      setError('Failed to detect emotion');
      throw error;
    }
  };

  const initializeIdentity = async () => {
    if (capturedImages.length !== 2) {
      setError('Need exactly 2 images for identity initialization');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9000/initializeIdentity', {
        images: capturedImages
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Identity initialization success:', response.data);

      if(response.data.status === "Face Identity has been established"){
        setFaceDetected("True")
      }
      return response.data;
    } catch (error) {
      console.error('Error in identity initialization:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        setError(`Server error: ${error.response.status}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response received from server');
      } else {
        console.error('Error message:', error.message);
        setError(`Request setup error: ${error.message}`);
      }
      throw error;
    }
  };

  const checkIdentity = async () => {
    const imageDataUrl = captureScreenshot();
    if (!imageDataUrl) {
      setError('Failed to capture image for identity check');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9000/checkIdentity', {
        img: imageDataUrl
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Identity check success:', response.data);
      setIdentityMatch(response.data.status)
      return response.data;
    } catch (error) {
      console.error('Error in identity check:', error);
      setError('Failed to check identity');
      throw error;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography variant="h5" gutterBottom>
        Webcam Recorder
      </Typography>
      <Box sx={{ 
        width: '100%', 
        maxWidth: 640, 
        aspectRatio: '16/9', 
        bgcolor: 'black', 
        borderRadius: '16px', 
        overflow: 'hidden' 
      }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color={isRecording ? 'secondary' : 'primary'}
          startIcon={isRecording ? <VideocamOff /> : <Videocam />}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Camera />}
          onClick={() => {
            const dataUrl = captureScreenshot();
            sendToBackend(dataUrl);
          }}
          disabled={!isRecording}
        >
          Capture & Detect Emotion
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAdd />}
          onClick={initializeIdentity}
          disabled={capturedImages.length !== 2}
        >
          Initialize Identity
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonSearch />}
          onClick={checkIdentity}
          disabled={!isRecording}
        >
          Check Identity
        </Button>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Box>
  );
};

export default Webcam;