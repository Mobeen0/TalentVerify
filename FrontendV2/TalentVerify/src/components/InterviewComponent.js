import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { Mic, MicOff, Send } from 'lucide-react';

function InterviewComponent() {
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);

  const [evaluationResult, setEvaluationResult] = useState(null);
  
  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState(null);

  // Initialize speech recognition on component mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        // Collect all interim and final results
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        // Update input with the most recent results
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

        setCurrentQuestionIndex(0); // Start with the first question
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
  
  // This effect will add the new question after currentQuestionIndex changes
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

  return (
    <div className="tw-flex tw-h-screen tw-py-5 tw-px-10 tw-box-border">
      {/* Left Section */}
      <div className="tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center">
        {!pdfUploaded && (
          <div className="tw-mb-5">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              className="tw-text-lg tw-cursor-pointer"
            />
          </div>
        )}

        {loading && <CircularProgress />}

        {pdfUploaded && (
          <div
            className="tw-w-[450px] tw-h-[350px] tw-border-2 tw-border-gray-400 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-bg-gray-100 tw-text-center"
          >
            Avatar Video Placeholder
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="tw-w-[400px] tw-flex tw-flex-col tw-border-l tw-border-gray-300 tw-pl-5">
        <h3 className="tw-text-center tw-mb-3 tw-font-bold tw-text-lg">Question History</h3>
        <div
          className="tw-flex-1 tw-overflow-y-auto tw-border tw-border-gray-300 tw-rounded-lg tw-p-3 tw-mb-3"
          style={{ maxHeight: '70vh' }}
        >
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`tw-my-2 ${message.type === 'user' ? 'tw-text-right' : 'tw-text-left'}`}
            >
              <span
                className={`tw-inline-block tw-p-3 tw-rounded-lg tw-shadow-md ${
                  message.type === 'user'
                    ? 'tw-bg-green-200 tw-text-green-800'
                    : 'tw-bg-blue-200 tw-text-blue-800'
                }`}
              >
                {message.text}
              </span>
            </div>
          ))}

          {evaluationResult && (
            <div className="tw-my-2 tw-text-center">
              <span
                className={`tw-inline-block tw-p-3 tw-rounded-lg tw-shadow-md tw-bg-yellow-200 tw-text-yellow-800`}
              >
                Evaluation Score: {evaluationResult.score}, Remarks: {evaluationResult.remarks}
              </span>
            </div>
          )}
        </div>
        <div className="tw-flex tw-gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="tw-flex-1 tw-p-3 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400"
          />
          <button
            onClick={toggleSpeechRecognition}
            className={`tw-px-4 tw-py-2 tw-rounded-lg tw-mr-2 ${
              isListening 
                ? 'tw-bg-red-500 tw-text-white hover:tw-bg-red-700' 
                : 'tw-bg-blue-200 tw-text-blue-800 hover:tw-bg-blue-300'
            }`}
          >
            {isListening ? <MicOff /> : <Mic />}
          </button>
          <button
            onClick={handleSendMessage}
            className="tw-px-5 tw-py-2 tw-rounded-lg tw-bg-blue-500 tw-text-white hover:tw-bg-blue-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewComponent;