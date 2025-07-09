// IntegratedInterviewComponent.jsx
import React, { useState, useEffect, useRef } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Typography, Paper, Grid, Fade } from '@mui/material';
import { 
  Mic, MicOff, Send, FileUp, Clock, Award, Brain, 
  SmilePlus, PlayCircle, StopCircle
} from 'lucide-react';
import AvatarVideo from '../../assets/Demo2.mp4';

// Import sub-components
import InterviewHeader from './InterviewHeader';
import InterviewChat from './InterviewChat';
import UserInputArea from '../common/UserInputArea';
import WebcamDisplay from '../common/WebcamDisplay';
import AvatarVideoPlayer from './components/AvatarVideoPlayer';
import UploadScreen from './components/UploadScreen';
import EmotionIndicators from '../emotion/indicators/EmotionIndicators';
import EmotionChat from '../emotion/chat/EmotionChat';
import EmotionControls from '../emotion/controls/EmotionControls';
import CSSAnimations from '../common/CSSAnimations';
import InterviewCompletionScreen from './InterviewCompletionScreen';

function IntegratedInterviewComponent() {
  // Define total questions to ask constant
  const TOTAL_QUESTIONS_TO_ASK = 3;
  
  let navigate = useNavigate()

  // Interview Component States
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interviewChatHistory, setInterviewChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [newMessageId, setNewMessageId] = useState(null);
  
  // Emotion Detector States
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [videoEmotion, setVideoEmotion] = useState('None');
  const [audioEmotion, setAudioEmotion] = useState('None');
  const [faceDetected, setFaceDetected] = useState('Initialized');
  const [identityMatch, setIdentityMatch] = useState('Yes');
  const [emotionChatHistory, setEmotionChatHistory] = useState([]);
  
  // Refs
  const interviewChatContainerRef = useRef(null);
  const emotionChatContainerRef = useRef(null);
  const avatarVideoRef = useRef(null);
  const webCamRef = useRef(null);
  const intervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Video timestamps for the first 10 questions (in seconds)
  const videoTimestamps = [
    { start: 0, end: 6 },    
    { start: 7, end: 11 },   
    { start: 12, end: 17 },  
    { start: 17, end: 22 },  
    { start: 23, end: 28 },  
    { start: 29, end: 32 },  
    { start: 33, end: 39 },  
    { start: 40, end: 45 },  
    { start: 46, end: 51 },  
    { start: 52, end: 60 }, 
  ];

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

  // Initialize speech recognition on component mount
  useEffect(() => {
    initializeSpeechRecognition();
  }, []);

  // Control video playback based on current question
  useEffect(() => {
    handleVideoPlayback();
    return () => {
      if (avatarVideoRef.current) {
        avatarVideoRef.current.removeEventListener('timeupdate', () => {});
      }
    };
  }, [currentQuestionIndex]);

  // Auto-scroll to the bottom when new messages arrive for interview chat
  useEffect(() => {
    handleInterviewChatAutoScroll();
    return () => clearTimeout(null);
  }, [interviewChatHistory]);

  // Auto-scroll to the bottom when new messages arrive for emotion chat
  useEffect(() => {
    if (emotionChatContainerRef.current) {
      emotionChatContainerRef.current.scrollTop = emotionChatContainerRef.current.scrollHeight;
    }
  }, [emotionChatHistory]);

  // Update interview chat with new question
  useEffect(() => {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) { 
      setInterviewChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'system', text: questions[currentQuestionIndex] },
      ]);
    }
  }, [currentQuestionIndex, questions]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (audioStream) audioStream.getTracks().forEach(track => track.stop());
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setUserInput(finalTranscript + interimTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setSpeechRecognition(recognition);
    }
  };

  const handleVideoPlayback = () => {
    if (currentQuestionIndex >= 0) {
      // Add a check to ensure video is loaded before trying to control it
      const handleVideoLoaded = () => {
        if (avatarVideoRef.current) {
          const videoIndex = Math.min(currentQuestionIndex, videoTimestamps.length - 1);
          const { start, end } = videoTimestamps[videoIndex];
          
          // Set video to start time
          avatarVideoRef.current.currentTime = start;
          
          try {
            // Play the video
            const playPromise = avatarVideoRef.current.play();
            
            // Handle play promise (might be rejected in some browsers if user hasn't interacted with the page)
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.warn('Auto-play was prevented:', error);
                // We can show a play button or notification here if needed
              });
            }
          } catch (error) {
            console.error('Error playing video:', error);
          }
          
          // Set up event listener to pause at end time
          const handleTimeUpdate = () => {
            if (avatarVideoRef.current && avatarVideoRef.current.currentTime >= end) {
              avatarVideoRef.current.pause();
              avatarVideoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
          };
          
          avatarVideoRef.current.addEventListener('timeupdate', handleTimeUpdate);
        }
      };
      
      // If video is already loaded
      if (avatarVideoRef.current && avatarVideoRef.current.readyState >= 2) {
        handleVideoLoaded();
      } else {
        // If video is not loaded yet, wait for it to load
        const videoElement = avatarVideoRef.current;
        if (videoElement) {
          videoElement.addEventListener('loadeddata', handleVideoLoaded);
          return () => {
            videoElement.removeEventListener('loadeddata', handleVideoLoaded);
          };
        }
      }
    }
  };

  const handleInterviewChatAutoScroll = () => {
    if (interviewChatContainerRef.current) {
      interviewChatContainerRef.current.scrollTop = interviewChatContainerRef.current.scrollHeight;
    }
    
    // Set the new message ID for animation
    if (interviewChatHistory.length > 0) {
      setNewMessageId(interviewChatHistory.length - 1);
      
      // Clear the new message ID after animation completes
      const timer = setTimeout(() => {
        setNewMessageId(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  };

  // Handle PDF Upload for Interview
  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('file', file);
      setLoading(true);

      try {
        const response = await axios.post('http://localhost:8000/ResumeQuestionGen', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const { Hard, Soft } = response.data;
        console.log('Hard Questions:', Hard);
        console.log('Soft Questions:', Soft);

        // Get only the first TOTAL_QUESTIONS_TO_ASK questions
        const allQuestions = [...Hard, ...Soft].slice(0, TOTAL_QUESTIONS_TO_ASK);
        setQuestions(allQuestions);

        setInterviewChatHistory((prevHistory) => [
          ...prevHistory,
          { type: 'system', text: `Here are ${TOTAL_QUESTIONS_TO_ASK} questions generated from your resume.` },
        ]);

        setCurrentQuestionIndex(0);
        setPdfUploaded(true);
        
        // Auto-start emotion detection when interview begins
        initializeEmotionDetection();
      } catch (error) {
        console.error('Error uploading PDF:', error);
        alert('Failed to upload PDF. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  // Handle Send Message for Interview
  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setInterviewChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'user', text: userInput.trim() },
      ]);
  
      try {
        const response = await axios.post('http://localhost:8000/EvaluateAnswer', null, {
          params: {
            Question: questions[currentQuestionIndex],
            Answer: userInput.trim(),
          },
        });
        const { score, remarks } = response.data;
        setEvaluationResult({ score, remarks });
        setEvaluationResults(prev => [...prev, { score, remarks }]);
        setUserInput('');
  
        // Add emotion feedback to emotion chat
        addEmotionFeedback();
  
        if (currentQuestionIndex < TOTAL_QUESTIONS_TO_ASK - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
          setInterviewChatHistory((prevHistory) => [
            ...prevHistory,
            { type: 'system', text: 'Thank you for completing the interview questions!' },
          ]);
          
          // Stop emotion detection when interview ends
          stopEmotionDetection();
          setIsInterviewComplete(true);
        }
      } catch (error) {
        console.error('Error evaluating answer:', error);
        alert('Failed to evaluate your answer. Please try again.');
      }
    }
  };

  // Toggle Speech Recognition
  const toggleSpeechRecognition = () => {
    if (!speechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      speechRecognition.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        alert('Could not start speech recognition. Please try again.');
      }
    }
  };

  // Initialize Emotion Detection
  const initializeEmotionDetection = async () => {
    try {
      setProcessing(true);
      
      // Initialize video stream
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(videoStream);
      if (webCamRef.current) {
        webCamRef.current.srcObject = videoStream;
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
      
      // Add message to emotion chat history
      setEmotionChatHistory(prev => [
        ...prev, 
        { type: 'system', text: 'Emotion detection started. Your facial expressions and voice tone will be analyzed during the interview.' }
      ]);
    } catch (error) {
      console.error('Error initializing emotion detection:', error);
      setProcessing(false);
      
      // Add error message to emotion chat history
      setEmotionChatHistory(prev => [
        ...prev, 
        { type: 'system', text: 'Error starting emotion detection. Please check camera and microphone permissions.' }
      ]);
    }
  };

  // Stop Emotion Detection
  const stopEmotionDetection = () => {
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
    
    // Add message to emotion chat history
    setEmotionChatHistory(prev => [
      ...prev, 
      { type: 'system', text: 'Emotion detection stopped.' }
    ]);
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
    if (webCamRef.current && webCamRef.current.readyState >= 2) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = webCamRef.current.videoWidth || 640;
        canvas.height = webCamRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(webCamRef.current, 0, 0);
          const dataUrl = canvas.toDataURL('image/jpeg');
      
          // Process emotions
          try {
            const emotionResponse = await axios.post('http://localhost:9000/getVideoEmotion', {
              img: dataUrl
            }, {
              headers: { 'Content-Type': 'application/json' }
            });
            
            if (emotionResponse.data && emotionResponse.data.emotion) {
              const newEmotion = emotionResponse.data.emotion;
              // Only update if emotion changed
              if (newEmotion !== videoEmotion) {
                setVideoEmotion(newEmotion);
                // Add to emotion chat history when emotion changes
                setEmotionChatHistory(prev => [
                  ...prev, 
                  { type: 'system', text: `Facial expression: ${newEmotion}` }
                ]);
              }
            }
          } catch (error) {
            console.error('Error in emotion detection:', error);
          }
          
          // Process identity - keeping this logic intact
          try {
            const identityResponse = await axios.post('http://localhost:9000/checkIdentity', {
              img: dataUrl
            }, {
              headers: { 'Content-Type': 'application/json' }
            });
            
            if (identityResponse.data) {
              const newIdentityMatch = identityResponse.data.status;
              const newFaceDetected = identityResponse.data.faceDetected ? 'Yes' : 'No';
              
              // Update state only if values changed
              if (newIdentityMatch !== identityMatch) {
                setIdentityMatch(newIdentityMatch);
              }
              
              if (newFaceDetected !== faceDetected) {
                setFaceDetected(newFaceDetected);
                // Add to chat history if face detection status changes
                if (newFaceDetected !== 'No') {
                  setEmotionChatHistory(prev => [
                    ...prev, 
                    { type: 'system', text: 'Warning: Face not detected. Please adjust your position.' }
                  ]);
                }
              }
            }
          } catch (error) {
            console.error('Error in identity check:', error);
          }
        } else {
          console.log('Webcam not ready yet');
        }
      } catch (error) {
        console.error('Error capturing webcam frame:', error);
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
        const newAudioEmotion = emotionMapping[data.result];
        // Only update if emotion changed
        if (newAudioEmotion !== audioEmotion) {
          setAudioEmotion(newAudioEmotion);
          // Add to emotion chat history when emotion changes
          setEmotionChatHistory(prev => [
            ...prev, 
            { type: 'system', text: `Voice tone: ${newAudioEmotion}` }
          ]);
        }
      }
    } catch (error) {
      console.error('Error in audio emotion detection:', error);
    }
  };

  // Add emotion feedback to chat
  const addEmotionFeedback = () => {
    // Create a feedback message based on current emotions
    const feedbackMessage = {
      type: 'system',
      text: `Feedback: Your facial expression appears ${videoEmotion.toLowerCase()} and your voice tone is ${audioEmotion.toLowerCase()}.`
    };
    
    // Add professional advice based on emotions
    let advice = '';
    
    // Some basic advice patterns - this could be expanded with more sophisticated logic
    if (videoEmotion === 'Neutral' && audioEmotion === 'Neutral') {
      advice = 'Try to show more enthusiasm in your expressions and tone to engage the interviewer.';
    } else if (videoEmotion === 'Happy' || audioEmotion === 'Happy' || audioEmotion === 'Excited') {
      advice = 'Your positive energy is good! Maintain this level of engagement.';
    } else if (videoEmotion === 'Sad' || audioEmotion === 'Sad') {
      advice = 'Try to appear more confident and positive in your responses.';
    } else if (videoEmotion === 'Angry' || audioEmotion === 'Angry' || audioEmotion === 'Frustrated') {
      advice = 'You seem a bit tense. Take a deep breath and try to relax before continuing.';
    }
    
    if (advice) {
      setEmotionChatHistory(prev => [
        ...prev,
        feedbackMessage,
        { type: 'system', text: `Tip: ${advice}` }
      ]);
    } else {
      setEmotionChatHistory(prev => [...prev, feedbackMessage]);
    }
  };

  // Calculate progress percentage
  const progress = questions.length > 0 
    ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) 
    : 0;

  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState([]);

  if (isInterviewComplete) {
    return <InterviewCompletionScreen evaluationResults={evaluationResults} />;
  }

  return (
    <div className="tw-flex tw-h-screen tw-bg-gradient-to-br tw-from-blue-50 tw-to-indigo-50 tw-p-6 tw-transition-all tw-duration-500">
      <div className="tw-w-full tw-max-w-7xl tw-mx-auto tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden tw-flex tw-flex-col tw-transition-all tw-duration-500 hover:tw-shadow-2xl">
        {!pdfUploaded ? (
          <UploadScreen 
            loading={loading} 
            handlePdfUpload={handlePdfUpload} 
          />
        ) : (
          <div className="tw-flex tw-flex-col tw-h-full">
            {/* Header with progress */}
            <InterviewHeader 
              currentQuestionIndex={currentQuestionIndex}
              questionsLength={TOTAL_QUESTIONS_TO_ASK}
              progress={progress}
            />
            
            {/* Main content area with grid layout */}
            <div className="tw-flex tw-flex-1 tw-overflow-hidden">
              {/* Left Side - Avatar Video + Interview Chat */}
              <div className="tw-w-1/2 tw-border-r tw-border-gray-200 tw-flex tw-flex-col">
                {/* Avatar Video */}
                <AvatarVideoPlayer 
                  avatarVideoRef={avatarVideoRef}
                  videoSrc={AvatarVideo}
                />
                
                {/* Interview Chat */}
                <InterviewChat 
                  interviewChatContainerRef={interviewChatContainerRef}
                  interviewChatHistory={interviewChatHistory}
                  newMessageId={newMessageId}
                  evaluationResult={evaluationResult}
                />
                
                {/* Input Area for Interview */}
                <UserInputArea 
                  userInput={userInput}
                  setUserInput={setUserInput}
                  isListening={isListening}
                  toggleSpeechRecognition={toggleSpeechRecognition}
                  handleSendMessage={handleSendMessage}
                />
              </div>
              
              {/* Right Side - Webcam + Emotion Analysis */}
              <div className="tw-w-1/2 tw-flex tw-flex-col">
                {/* Webcam Display */}
                <WebcamDisplay webCamRef={webCamRef} />
                
                {/* Emotion Analysis Indicators */}
                <EmotionIndicators 
                  videoEmotion={videoEmotion}
                  audioEmotion={audioEmotion}
                  identityMatch={identityMatch}
                  lastUpdated={lastUpdated}
                />
                
                {/* Emotion Chat */}
                <EmotionChat 
                  emotionChatContainerRef={emotionChatContainerRef}
                  emotionChatHistory={emotionChatHistory}
                />
                
                {/* Emotion Controls */}
                <EmotionControls 
                  isActive={isActive}
                  processing={processing}
                  initializeEmotionDetection={initializeEmotionDetection}
                  stopEmotionDetection={stopEmotionDetection}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* CSS Animations */}
        <CSSAnimations />
      </div>
    </div>
  );
}

export default IntegratedInterviewComponent;