import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, Paper, Grid, CircularProgress, Fade } from '@mui/material';
import { PlayArrow, Stop, Psychology, SentimentSatisfiedAlt } from '@mui/icons-material';
import axios from 'axios';

const AutomatedEmoDetector = () => {
  // States for managing the automation
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // States for storing results
  const [videoEmotion, setVideoEmotion] = useState('None');
  const [audioEmotion, setAudioEmotion] = useState('None');
  const [faceDetected, setFaceDetected] = useState('Initialized'); // Still tracking but not displaying
  const [identityMatch, setIdentityMatch] = useState('None');
  
  // Refs
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  // Emotion mapping for audio
  const emotionMapping = {
    "neu": "Neutral",
    "ang": "Angry",
    "hap": "Happy",
    "sur": "Surprised",
    "sad": "Sad",
    "exc": "Excited",
    "fru": "Frustrated"
  };

  // Initialize webcam and audio stream
  const initialize = async () => {
    try {
      setProcessing(true);
      
      // Initialize video stream
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(videoStream);
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }
      
      // Initialize audio stream and recorder
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(audio);
      mediaRecorderRef.current = new MediaRecorder(audio);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
        await processAudio(audioBlob);
      };
      
      // Start the interval for processing
      startProcessingInterval();
      setIsActive(true);
      setProcessing(false);
    } catch (error) {
      console.error('Error initializing:', error);
      setProcessing(false);
    }
  };

  // Stop all streams and intervals
  const stopAll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setIsActive(false);
  };

  // Start interval for processing video and audio
  const startProcessingInterval = () => {
    // Immediately process once
    processFrame();
    startAudioRecording();
    
    // Then set up interval
    intervalRef.current = setInterval(() => {
      processFrame();
      
      // For audio, stop current recording and start a new one
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      startAudioRecording();
      
      // Update timestamp
      setLastUpdated(new Date().toLocaleTimeString());
    }, 3000);
  };

  // Start audio recording
  const startAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
    }
  };

  // Process video frame
  const processFrame = async () => {
    if (videoRef.current && videoRef.current.readyState === 4) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      
      // Process emotions
      try {
        const emotionResponse = await axios.post('http://localhost:9000/getVideoEmotion', {
          img: dataUrl
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (emotionResponse.data && emotionResponse.data.emotion) {
          setVideoEmotion(emotionResponse.data.emotion);
        }
      } catch (error) {
        console.error('Error in emotion detection:', error);
      }
      
      // Process identity - still keeping this logic intact
      try {
        const identityResponse = await axios.post('http://localhost:9000/checkIdentity', {
          img: dataUrl
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (identityResponse.data) {
          setIdentityMatch(identityResponse.data.status);
          setFaceDetected(identityResponse.data.faceDetected ? 'Yes' : 'No'); // Still tracking but not displaying
        }
      } catch (error) {
        console.error('Error in identity check:', error);
      }
    }
  };

  // Process audio blob
  const processAudio = async (audioBlob) => {
    if (!audioBlob) return;
    
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    
    try {
      const response = await fetch('http://localhost:8000/AudioEmotion', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data && data.result && emotionMapping[data.result]) {
        setAudioEmotion(emotionMapping[data.result]);
      }
    } catch (error) {
      console.error('Error in audio emotion detection:', error);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={4} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#333' }}>
          Automated Emotion Analysis
        </Typography>
        
        <Grid container spacing={3}>
          {/* Video display */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              width: '100%', 
              maxWidth: 640, 
              aspectRatio: '16/9', 
              bgcolor: 'black', 
              borderRadius: '16px', 
              overflow: 'hidden',
              mx: 'auto'
            }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          </Grid>
          
          {/* Results display */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                height: '100%',
                bgcolor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 'bold', color: '#444' }}>
                <Psychology sx={{ mr: 1, verticalAlign: 'middle' }} />
                Emotion Analysis Results
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Fade in={true} timeout={800}>
                  <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#f0f8ff' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#555' }}>
                      Video Emotion:
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: '#1976d2',
                      fontSize: '1.5rem',
                      mt: 1
                    }}>
                      <SentimentSatisfiedAlt sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {videoEmotion}
                    </Typography>
                  </Paper>
                </Fade>
                
                <Fade in={true} timeout={800}>
                  <Paper elevation={2} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: '#fff0f5' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#555' }}>
                      Audio Emotion:
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: '#d81b60',
                      fontSize: '1.5rem',
                      mt: 1
                    }}>
                      {audioEmotion}
                    </Typography>
                  </Paper>
                </Fade>
                
                {/* Removed the Grid container with Face Detected display */}
                {/* Only showing Identity Match */}
                <Fade in={true} timeout={800}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 2, bgcolor: '#fff8e1' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#555' }}>
                      Identity Match:
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: '#f57c00',
                      mt: 1
                    }}>
                      {identityMatch}
                    </Typography>
                  </Paper>
                </Fade>
              </Box>
              
              {lastUpdated && (
                <Typography variant="caption" sx={{ mt: 2, textAlign: 'right', fontStyle: 'italic' }}>
                  Last updated: {lastUpdated}
                </Typography>
              )}
            </Paper>
          </Grid>
          
          {/* Controls */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color={isActive ? "error" : "primary"}
                size="large"
                startIcon={isActive ? <Stop /> : <PlayArrow />}
                onClick={isActive ? stopAll : initialize}
                disabled={processing}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  borderRadius: 8,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: 3
                }}
              >
                {processing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  isActive ? 'Stop Analysis' : 'Start Analysis'
                )}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AutomatedEmoDetector;