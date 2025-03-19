import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { Mic, MicOff, Send, FileUp, Clock, Award } from 'lucide-react';
import AvatarVideo from '../assets/Demo2.mp4';

function InterviewComponent() {
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [newMessageId, setNewMessageId] = useState(null);
  
  const chatContainerRef = useRef(null);
  const videoRef = useRef(null);

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
    if (videoRef.current && currentQuestionIndex >= 0) {
      const videoIndex = Math.min(currentQuestionIndex, videoTimestamps.length - 1);
      const { start, end } = videoTimestamps[videoIndex];
      
      // Set video to start time
      videoRef.current.currentTime = start;
      
      // Play the video
      videoRef.current.play();
      
      // Set up event listener to pause at end time
      const handleTimeUpdate = () => {
        if (videoRef.current.currentTime >= end) {
          videoRef.current.pause();
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
      
      videoRef.current.addEventListener('timeupdate', handleTimeUpdate);
      
      // Clean up event listener
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        }
      };
    }
  }, [currentQuestionIndex]);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    
    // Set the new message ID for animation
    if (chatHistory.length > 0) {
      setNewMessageId(chatHistory.length - 1);
      
      // Clear the new message ID after animation completes
      const timer = setTimeout(() => {
        setNewMessageId(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [chatHistory]);

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

        setChatHistory((prevHistory) => [
          ...prevHistory,
          { type: 'system', text: 'Here are the generated questions from your resume.' },
        ]);

        setCurrentQuestionIndex(0);
        setPdfUploaded(true);
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

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setChatHistory((prevHistory) => [
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
  
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
          setChatHistory((prevHistory) => [
            ...prevHistory,
            { type: 'system', text: 'Thank you for completing the questions!' },
          ]);
        }
      } catch (error) {
        console.error('Error evaluating answer:', error);
        alert('Failed to evaluate your answer. Please try again.');
      }
    }
  };
  
  useEffect(() => {
    if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'system', text: questions[currentQuestionIndex] },
      ]);
    }
  }, [currentQuestionIndex, questions]);

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

  // Calculate progress percentage
  const progress = questions.length > 0 
    ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) 
    : 0;

  return (
    <div className="tw-flex tw-h-screen tw-bg-gradient-to-br tw-from-blue-50 tw-to-indigo-50 tw-p-6 tw-transition-all tw-duration-500">
      <div className="tw-w-full tw-max-w-7xl tw-mx-auto tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden tw-flex tw-transition-all tw-duration-500 hover:tw-shadow-2xl">
        {/* Left Section - Avatar and Upload */}
        <div className="tw-w-1/2 tw-bg-gradient-to-br tw-from-blue-500 tw-to-indigo-600 tw-p-8 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-white tw-transition-all tw-duration-500">
          <h2 className="tw-text-3xl tw-font-bold tw-mb-6 tw-transition-all tw-duration-300 hover:tw-scale-105">Interview Assistant</h2>
          
          {!pdfUploaded ? (
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-max-w-md tw-transition-all tw-duration-500 tw-transform tw-animate-fadeIn">
              <div className="tw-mb-6 tw-text-center">
                <p className="tw-text-lg tw-mb-4">Upload your resume to start the interview simulation</p>
                <label 
                  className="tw-bg-white tw-text-blue-600 tw-py-3 tw-px-6 tw-rounded-lg tw-shadow-md tw-font-medium tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-gap-2 hover:tw-bg-blue-50 tw-transition-all tw-duration-300 hover:tw-scale-105"
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
            </div>
          ) : (
            <div className="tw-w-full tw-flex tw-flex-col tw-items-center tw-animate-fadeIn">
              <div className="tw-w-full tw-max-w-md tw-overflow-hidden tw-rounded-xl tw-shadow-lg tw-bg-blue-800 tw-mb-6 tw-transition-all tw-duration-500 hover:tw-shadow-xl">
                <video 
                  ref={videoRef}
                  src={AvatarVideo} 
                  className="tw-w-full tw-h-full tw-object-cover tw-transition-all tw-duration-500"
                  playsInline
                />
              </div>
              
              {/* Interview Progress */}
              <div className="tw-w-full tw-max-w-md tw-bg-blue-800 tw-bg-opacity-50 tw-rounded-xl tw-p-4 tw-transition-all tw-duration-500 hover:tw-bg-opacity-70">
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-2">
                  <span className="tw-flex tw-items-center tw-gap-2">
                    <Clock size={16} className="tw-animate-pulse" />
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span>{progress}% Complete</span>
                </div>
                <div className="tw-w-full tw-h-2 tw-bg-blue-900 tw-rounded-full">
                  <div 
                    className="tw-h-full tw-bg-white tw-rounded-full tw-transition-all tw-duration-1000 tw-ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          
          {loading && (
            <div className="tw-mt-8 tw-flex tw-flex-col tw-items-center tw-animate-fadeIn">
              <CircularProgress style={{ color: 'white' }} />
              <p className="tw-mt-4 tw-animate-pulse">Analyzing your resume...</p>
            </div>
          )}
        </div>
        
        {/* Right Section - Chat */}
        <div className="tw-w-1/2 tw-flex tw-flex-col tw-bg-white tw-transition-all tw-duration-500">
          <div className="tw-p-4 tw-border-b tw-border-gray-200 tw-transition-all tw-duration-300">
            <h3 className="tw-text-xl tw-font-semibold tw-text-gray-800">Interview Session</h3>
            <p className="tw-text-gray-500">Answer the questions as if in a real interview</p>
          </div>
          
          {/* Chat History */}
          <div 
            ref={chatContainerRef}
            className="tw-flex-1 tw-overflow-y-auto tw-p-4 tw-transition-all tw-duration-500"
            style={{ maxHeight: 'calc(100vh - 220px)' }}
          >
            {chatHistory.length === 0 ? (
              <div className="tw-h-full tw-flex tw-items-center tw-justify-center tw-text-gray-400 tw-text-center tw-animate-fadeIn">
                <div>
                  <p>Upload your resume to start the interview</p>
                  <p className="tw-text-sm tw-mt-2">Questions will be generated based on your experience</p>
                </div>
              </div>
            ) : (
              chatHistory.map((message, index) => (
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
          
          {/* Input Area */}
          <div className="tw-p-4 tw-border-t tw-border-gray-200 tw-transition-all tw-duration-300">
            <div className="tw-flex tw-gap-2">
              <input
                type="text"
                placeholder="Type your answer..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="tw-flex-1 tw-p-3 tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-sm focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400 tw-transition-all tw-duration-300"
              />
              <button
                onClick={toggleSpeechRecognition}
                className={`tw-p-3 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-transition-all tw-duration-300 ${
                  isListening 
                    ? 'tw-bg-red-500 tw-text-white hover:tw-bg-red-600 tw-animate-pulse' 
                    : 'tw-bg-gray-100 tw-text-gray-700 hover:tw-bg-gray-200'
                }`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button
                onClick={handleSendMessage}
                className="tw-bg-blue-600 tw-text-white tw-p-3 tw-rounded-lg tw-flex tw-items-center tw-justify-center hover:tw-bg-blue-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400 tw-transition-all tw-duration-300 hover:tw-scale-105"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

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
  );
}

export default InterviewComponent;