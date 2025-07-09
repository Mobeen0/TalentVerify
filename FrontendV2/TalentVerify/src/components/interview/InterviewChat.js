import React from 'react';
import { Award } from 'lucide-react';

const InterviewChat = ({ interviewChatContainerRef, interviewChatHistory, newMessageId, evaluationResult }) => {
  return (
    <>
      <div className="tw-p-3 tw-bg-blue-50 tw-border-b tw-border-t tw-border-gray-200">
        <h3 className="tw-font-semibold tw-text-blue-800">Interview Conversation</h3>
      </div>
      
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
    </>
  );
};

export default InterviewChat;