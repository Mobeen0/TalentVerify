import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Mic, Stop, Send } from '@mui/icons-material';

const mapping = {
  "neu":"Neutral",
  "ang":"Angry",
  "hap":"Happy",
  "sur":"Surprised",
  "sad":"Sad",
  "exc":"Excited",
  "fru":"Frustrated"
}

const Voicerecorder = ({setAudEmo}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);


  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const blob = new Blob([event.data], { type: 'audio/wav' });
          setAudioBlob(blob);
          setAudioURL(URL.createObjectURL(blob));
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      drawAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      cancelAnimationFrame(animationRef.current);
    }
  };

  const drawAudioLevel = () => {
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    analyserRef.current.fftSize = 256;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        canvasCtx.fillStyle = `rgb(50, ${barHeight + 100}, 50)`;
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  };

  const sendToBackend = () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');

      fetch('http://localhost:8000/AudioEmotion', {  // Replace with your actual API endpoint
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setAudEmo(mapping[data.result])
      })
      .catch((error) => console.error('Error:', error));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%', maxWidth: 400 }}>
      <Typography variant="h5" gutterBottom>
        Voice Recorder
      </Typography>
      <Box sx={{ width: '100%', height: 100, bgcolor: 'grey.200', borderRadius: 2, overflow: 'hidden' }}>
        <canvas ref={canvasRef} width={400} height={100} style={{ width: '100%', height: '100%' }} />
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color={isRecording ? 'secondary' : 'primary'}
          startIcon={isRecording ? <Stop /> : <Mic />}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
        {audioURL && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Send />}
            onClick={sendToBackend}
          >
            Send Recording
          </Button>
        )}
      </Box>
      {audioURL && (
        <Box sx={{ width: '100%' }}>
          <audio src={audioURL} controls style={{ width: '100%' }} />
        </Box>
      )}
    </Box>
  );
};

export default Voicerecorder;