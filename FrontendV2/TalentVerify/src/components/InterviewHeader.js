// components/InterviewHeader.jsx
import React from 'react';
import { Clock } from 'lucide-react';

const InterviewHeader = ({ currentQuestionIndex, questionsLength, progress }) => {
  return (
    <div className="tw-px-6 tw-py-4 tw-bg-blue-600 tw-text-white tw-mb-1">
      <div className="tw-flex tw-justify-between tw-items-center">
        <h2 className="tw-text-xl tw-font-bold">AI Interview Assistant</h2>
        <div className="tw-flex tw-items-center tw-gap-2">
          <Clock size={16} className="tw-animate-pulse" />
          <span>Question {currentQuestionIndex + 1} of {questionsLength}</span>
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
  );
};

export default InterviewHeader;