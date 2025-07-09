// components/EmotionControls.jsx
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { PlayCircle, StopCircle } from 'lucide-react';

const EmotionControls = ({ isActive, processing, initializeEmotionDetection, stopEmotionDetection }) => {
  return (
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
  );
};

export default EmotionControls;