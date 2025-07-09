import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, Typography, Paper, Grid, Fade } from '@mui/material';
import { 
  Mic, MicOff, Send, FileUp, Clock, Award, Brain, 
  SmilePlus, PlayCircle, StopCircle
} from 'lucide-react';
import AvatarVideo from '../assets/Demo2.mp4';

function IntegratedInterviewComponent() {
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
  const [identityMatch, setIdentityMatch] = useState('None');
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
    { start: 12, end: 16 },  
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
  }, []);

  // Control video playback based on current question
  useEffect(() => {
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
          
          // Clean up event listener on unmount or when currentQuestionIndex changes
          return () => {
            if (avatarVideoRef.current) {
              avatarVideoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            }
          };
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
  }, [currentQuestionIndex]);

  // Auto-scroll to the bottom when new messages arrive for interview chat
  useEffect(() => {
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
  }, [interviewChatHistory]);

  // Auto-scroll to the bottom when new messages arrive for emotion chat
  useEffect(() => {
    if (emotionChatContainerRef.current) {
      emotionChatContainerRef.current.scrollTop = emotionChatContainerRef.current.scrollHeight;
    }
  }, [emotionChatHistory]);

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

        const allQuestions = [...Hard, ...Soft];
        setQuestions(allQuestions);

        setInterviewChatHistory((prevHistory) => [
          ...prevHistory,
          { type: 'system', text: 'Here are the generated questions from your resume.' },
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
        setUserInput('');
  
        // Add emotion feedback to emotion chat
        addEmotionFeedback();
  
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
          setInterviewChatHistory((prevHistory) => [
            ...prevHistory,
            { type: 'system', text: 'Thank you for completing the questions!' },
          ]);
          
          // Stop emotion detection when interview ends
          stopEmotionDetection();
        }
      } catch (error) {
        console.error('Error evaluating answer:', error);
        alert('Failed to evaluate your answer. Please try again.');
      }
    }
  };
  
  // Update interview chat with new question
  useEffect(() => {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
      setInterviewChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'system', text: questions[currentQuestionIndex] },
      ]);
    }
  }, [currentQuestionIndex, questions]);

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

  // Calculate progress percentage
  const progress = questions.length > 0 
    ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) 
    : 0;

  return (
    <div className="tw-flex tw-h-screen tw-bg-gradient-to-br tw-from-blue-50 tw-to-indigo-50 tw-p-6 tw-transition-all tw-duration-500">
      <div className="tw-w-full tw-max-w-7xl tw-mx-auto tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden tw-flex tw-flex-col tw-transition-all tw-duration-500 hover:tw-shadow-2xl">
        {!pdfUploaded ? (
          <div className="tw-p-8 tw-flex tw-flex-col tw-items-center tw-justify-center tw-transition-all tw-duration-500 tw-transform tw-animate-fadeIn">
            <h2 className="tw-text-3xl tw-font-bold tw-mb-6 tw-transition-all tw-duration-300 hover:tw-scale-105 tw-text-blue-600">AI Interview Assistant with Emotion Analysis</h2>
            <div className="tw-mb-6 tw-text-center">
              <p className="tw-text-lg tw-mb-4">Upload your resume to start the interview simulation</p>
              <label 
                className="tw-bg-blue-600 tw-text-white tw-py-3 tw-px-6 tw-rounded-lg tw-shadow-md tw-font-medium tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-gap-2 hover:tw-bg-blue-700 tw-transition-all tw-duration-300 hover:tw-scale-105"
              >
                <FileUp size={20} className="tw-transition-all tw-duration-300 group-hover:tw-rotate-12" />
                Upload Resume (PDF)
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="tw-hidden"
                />
              </label>
            </div>
            {loading && (
              <div className="tw-mt-8 tw-flex tw-flex-col tw-items-center tw-animate-fadeIn">
                <CircularProgress style={{ color: '#3B82F6' }} />
                <p className="tw-mt-4 tw-animate-pulse tw-text-gray-600">Analyzing your resume...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="tw-flex tw-flex-col tw-h-full">
            {/* Header with progress */}
            <div className="tw-px-6 tw-py-4 tw-bg-blue-600 tw-text-white tw-mb-1">
              <div className="tw-flex tw-justify-between tw-items-center">
                <h2 className="tw-text-xl tw-font-bold">AI Interview Assistant</h2>
                <div className="tw-flex tw-items-center tw-gap-2">
                  <Clock size={16} className="tw-animate-pulse" />
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span className="tw-ml-4">{progress}% Complete</span>
                </div>
              </div>
              <div className="tw-w-full tw-h-2 tw-bg-blue-800 tw-rounded-full tw-mt-2">
                <div 
                  className="tw-h-full tw-bg-white tw-rounded-full tw-transition-all tw-duration-1000 tw-ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Main content area with grid layout */}
            <div className="tw-flex tw-flex-1 tw-overflow-hidden">
              {/* Left Side - Avatar Video + Interview Chat */}
              <div className="tw-w-1/2 tw-border-r tw-border-gray-200 tw-flex tw-flex-col">
                {/* Avatar Video */}
                <div className="tw-w-full tw-h-72 tw-bg-gray-900 tw-overflow-hidden">
                  <video 
                    ref={avatarVideoRef}
                    src={AvatarVideo} 
                    className="tw-w-full tw-h-full tw-object-cover"
                    playsInline
                    preload="auto"
                    onError={(e) => console.error("Video error:", e)}
                  />
                </div>
                
                {/* Interview Chat Header */}
                <div className="tw-p-3 tw-bg-blue-50 tw-border-b tw-border-t tw-border-gray-200">
                  <h3 className="tw-font-semibold tw-text-blue-800">Interview Conversation</h3>
                </div>
                
                {/* Interview Chat History */}
                <div 
                  ref={interviewChatContainerRef}
                  className="tw-flex-1 tw-overflow-y-auto tw-p-4"
                >
                  {interviewChatHistory.length === 0 ? (
                    <div className="tw-h-full tw-flex tw-items-center tw-justify-center tw-text-gray-400 tw-text-center tw-animate-fadeIn">
                      <div>
                        <p>Interview will begin shortly</p>
                        <p className="tw-text-sm tw-mt-2">Questions will be generated based on your resume</p>
                      </div>
                    </div>
                  ) : (
                    interviewChatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`tw-my-3 tw-flex ${message.type === 'user' ? 'tw-justify-end' : 'tw-justify-start'}`}
                      >
                        <div
                          className={`tw-max-w-xs md:tw-max-w-md tw-px-4 tw-py-3 tw-rounded-2xl tw-shadow-sm ${
                            message.type === 'user'
                              ? 'tw-bg-blue-600 tw-text-white'
                              : 'tw-bg-gray-100 tw-text-gray-800'
                          } ${
                            newMessageId === index ? 
                              message.type === 'user' ? 'tw-animate-slideInRight' : 'tw-animate-slideInLeft'
                              : ''
                          } tw-transition-all tw-duration-300 hover:tw-shadow-md`}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))
                  )}

                  {evaluationResult && (
                    <div className="tw-my-3 tw-flex tw-justify-center tw-animate-fadeIn">
                      <div className="tw-bg-amber-50 tw-border tw-border-amber-200 tw-rounded-xl tw-p-4 tw-shadow-sm tw-w-full tw-transition-all tw-duration-300 hover:tw-shadow-md">
                        <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                          <Award size={18} className="tw-text-amber-500 tw-animate-pulse" />
                          <span className="tw-font-semibold tw-text-amber-700">Answer Evaluation</span>
                        </div>
                        <div className="tw-flex tw-justify-between tw-items-center">
                          <span className="tw-text-gray-700">Score: {evaluationResult.score}/10</span>
                          <div className="tw-w-32 tw-h-2 tw-bg-gray-200 tw-rounded-full">
                            <div 
                              className="tw-h-full tw-bg-amber-500 tw-rounded-full tw-transition-all tw-duration-1000 tw-ease-out"
                              style={{ width: `${evaluationResult.score * 10}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="tw-text-gray-600 tw-mt-2 tw-text-sm">{evaluationResult.remarks}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Input Area for Interview */}
                <div className="tw-p-3 tw-border-t tw-border-gray-200 tw-bg-white">
                  <div className="tw-flex tw-gap-2">
                    <input
                      type="text"
                      placeholder="Type your answer..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="tw-flex-1 tw-p-2 tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400 tw-transition-all tw-duration-300"
                    />
                    <button
                      onClick={toggleSpeechRecognition}
                      className={`tw-p-2 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-transition-all tw-duration-300 ${
                        isListening 
                          ? 'tw-bg-red-500 tw-text-white hover:tw-bg-red-600 tw-animate-pulse' 
                          : 'tw-bg-gray-100 tw-text-gray-700 hover:tw-bg-gray-200'
                      }`}
                    >
                      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="tw-bg-blue-600 tw-text-white tw-p-2 tw-rounded-lg tw-flex tw-items-center tw-justify-center hover:tw-bg-blue-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400 tw-transition-all tw-duration-300 hover:tw-scale-105"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Webcam + Emotion Analysis */}
              <div className="tw-w-1/2 tw-flex tw-flex-col">
                {/* Webcam Display */}
                <div className="tw-w-full tw-h-72 tw-bg-black tw-overflow-hidden">
                  <video
                    ref={webCamRef}
                    autoPlay
                    playsInline
                    muted
                    className="tw-w-full tw-h-full tw-object-cover"
                  />
                </div>
                
                {/* Emotion Analysis Indicators */}
                <div className="tw-p-3 tw-border-b tw-border-t tw-border-gray-200 tw-bg-indigo-50 tw-flex tw-justify-between">
                  <div className="tw-flex tw-items-center tw-gap-4">
                    <div>
                      <div className="tw-text-xs tw-text-gray-500">Facial Expression</div>
                      <div className="tw-font-semibold tw-text-indigo-700 tw-flex tw-items-center">
                        <SmilePlus size={16} className="tw-mr-1" />
                        {videoEmotion}
                      </div>
                    </div>

                    <div>
                      <div className="tw-text-xs tw-text-gray-500">Voice Tone</div>
                      <div className="tw-font-semibold tw-text-indigo-700">
                        {audioEmotion}
                      </div>
                    </div>

                    <div>
                      <div className="tw-text-xs tw-text-gray-500">Identity</div>
                      <div className="tw-font-semibold tw-text-indigo-700">
                        {identityMatch}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="tw-text-xs tw-text-gray-500">Last Updated</div>
                    <div className="tw-text-xs tw-font-medium">{lastUpdated || 'Not started'}</div>
                  </div>
                </div>
                
                {/* Emotion Chat Header */}
                <div className="tw-p-3 tw-bg-indigo-50 tw-border-b tw-border-gray-200">
                  <h3 className="tw-font-semibold tw-text-indigo-800">Emotion Feedback</h3>
                </div>
                
                {/* Emotion Chat History */}
                <div 
                  ref={emotionChatContainerRef}
                  className="tw-flex-1 tw-overflow-y-auto tw-p-4"
                >
                  {emotionChatHistory.length === 0 ? (
                    <div className="tw-h-full tw-flex tw-items-center tw-justify-center tw-text-gray-400 tw-text-center tw-animate-fadeIn">
                      <div>
                        <p>Emotion analysis will appear here</p>
                        <p className="tw-text-sm tw-mt-2">Your facial expressions and voice tone will be analyzed</p>
                      </div>
                    </div>
                  ) : (
                    emotionChatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`tw-my-2 tw-flex tw-justify-start`}
                      >
                        <div
                          className={`tw-max-w-xs md:tw-max-w-md tw-px-4 tw-py-2 tw-rounded-xl tw-shadow-sm 
                          ${message.text.includes('Tip:') ? 'tw-bg-green-50 tw-text-green-800 tw-border tw-border-green-200' : 
                            message.text.includes('Warning:') ? 'tw-bg-red-50 tw-text-red-800 tw-border tw-border-red-200' :
                            message.text.includes('Feedback:') ? 'tw-bg-amber-50 tw-text-amber-800 tw-border tw-border-amber-200' :
                            'tw-bg-indigo-50 tw-text-indigo-800'}
                          tw-transition-all tw-duration-300 hover:tw-shadow-md`}
                        >
                          {message.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Emotion Controls */}
                <div className="tw-p-3 tw-border-t tw-border-gray-200 tw-bg-white">
                  <button
                    onClick={isActive ? stopEmotionDetection : initializeEmotionDetection}
                    disabled={processing}
                    className={`tw-w-full tw-py-2 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-gap-2 tw-transition-all tw-duration-300 ${
                      isActive 
                        ? 'tw-bg-red-500 tw-text-white hover:tw-bg-red-600' 
                        : 'tw-bg-indigo-600 tw-text-white hover:tw-bg-indigo-700'
                    }`}
                  >
                    {processing ? (
                      <CircularProgress size={18} style={{ color: 'white' }} />
                    ) : (
                      <>
                        {isActive ? <StopCircle size={18} /> : <PlayCircle size={18} />}
                        {isActive ? 'Stop Emotion Analysis' : 'Start Emotion Analysis'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideInRight {
            from { transform: translateX(20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slideInLeft {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          
          .tw-animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          
          .tw-animate-slideInRight {
            animation: slideInRight 0.5s ease-out forwards;
          }
          
          .tw-animate-slideInLeft {
            animation: slideInLeft 0.5s ease-out forwards;
          }
          
          .tw-animate-pulse {
            animation: pulse 2s infinite;
          }
        `}</style>
      </div>
    </div>
  );
}

export default IntegratedInterviewComponent;