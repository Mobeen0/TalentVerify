import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Videocam, VideocamOff, Camera } from '@mui/icons-material';

const Webcam = () => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);

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
      
      canvas.toBlob((blob) => {
        sendToBackend(blob, 'image/jpeg');
      }, 'image/jpeg');
    }
  };

  const sendToBackend = (data, contentType) => {
    const formData = new FormData();
    formData.append('file', data, 'screenshot.jpg');

    fetch('/api/upload', {  // Replace with your actual API endpoint
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
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
      <Box sx={{ display: 'flex', gap: 2 }}>
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
          onClick={captureScreenshot}
          disabled={!isRecording}
        >
          Capture Screenshot
        </Button>
      </Box>
    </Box>
  );
};

export default Webcam;