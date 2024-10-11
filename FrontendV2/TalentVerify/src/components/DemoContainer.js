import React, { useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { Mic } from 'lucide-react';
import WebcamRecorder from './Webcam';
import VoiceRecorder from './Voicerecorder';

const EmotionDisplay = ({ emotion }) => (
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
    <Mic size={24} style={{ marginRight: '8px' }} />
    <Typography variant="h6" component="div">
      Detected Emotion: <strong>{emotion}</strong>
    </Typography>
  </Paper>
);

function DemoContainer() {
  const [audEmo, setAudEmo] = useState('None');

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>Webcam Recorder</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <WebcamRecorder />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>Voice Recorder</Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <VoiceRecorder setAudEmo={setAudEmo} />
              <EmotionDisplay emotion={audEmo} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DemoContainer;