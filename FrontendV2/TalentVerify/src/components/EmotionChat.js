// components/EmotionChat.jsx
import React from 'react';

const EmotionChat = ({ emotionChatContainerRef, emotionChatHistory }) => {
  return (
    <>
      <div className="tw-p-3 tw-bg-indigo-50 tw-border-b tw-border-gray-200">
        <h3 className="tw-font-semibold tw-text-indigo-800">Emotion Feedback</h3>
      </div>
      
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
    </>
  );
};

export default EmotionChat;