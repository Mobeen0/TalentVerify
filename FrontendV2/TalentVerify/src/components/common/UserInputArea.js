// components/UserInputArea.jsx
import React from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

const UserInputArea = ({ userInput, setUserInput, isListening, toggleSpeechRecognition, handleSendMessage }) => {
  return (
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
  );
};

export default UserInputArea;