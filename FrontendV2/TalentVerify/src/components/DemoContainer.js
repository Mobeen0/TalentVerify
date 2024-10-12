import React, { useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import WebcamRecorder from './Webcam';
import VoiceRecorder from './Voicerecorder';

const AudioEmotionDisplay = ({ emotion }) => (
  <Paper 
    elevation={3} 
    sx={{ 
      p: 2, 
      mt: 2, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f4f8',
      borderRadius: '8px'
    }}
  >
    <MicIcon sx={{ mr: 1 }} />
    <Typography variant="h6" component="div">
      Detected Emotion: <strong>{emotion}</strong>
    </Typography>
  </Paper>
);

const VideoEmotionDisplay = ({ emotion, faceDetected, identityMatch }) => (
  <Paper 
    elevation={3} 
    sx={{ 
      p: 2, 
      mt: 2, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f0f4f8',
      borderRadius: '8px'
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <CameraAltIcon sx={{ mr: 1 }} />
      <Typography variant="h6" component="div">
        Detected Emotion: <strong>{emotion}</strong>
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <CameraAltIcon sx={{ mr: 1 }} />
      <Typography variant="body1" component="div">
        Face Detected: <strong>{faceDetected ? 'Yes' : 'No'}</strong>
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <PersonIcon sx={{ mr: 1 }} />
      <Typography variant="body1" component="div">
        Identity Match: <strong>{identityMatch}</strong>
      </Typography>
    </Box>
  </Paper>
);

function DemoContainer() {
  const [audEmo, setAudEmo] = useState('None');
  const [vidEmo, setVidEmo] = useState('None');
  const [faceDetected, setFaceDetected] = useState(false);
  const [identityMatch, setIdentityMatch] = useState('None');

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>Webcam Recorder</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <WebcamRecorder setVidEmo={setVidEmo} setFaceDetected={setFaceDetected} setIdentityMatch={setIdentityMatch} />
              <VideoEmotionDisplay emotion={vidEmo} faceDetected={faceDetected} identityMatch={identityMatch} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>Voice Recorder</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <VoiceRecorder setAudEmo={setAudEmo} />
              <AudioEmotionDisplay emotion={audEmo} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DemoContainer;