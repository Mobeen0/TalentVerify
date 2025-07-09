// components/EmotionIndicators.jsx
import React from 'react';
import { SmilePlus } from 'lucide-react';

const EmotionIndicators = ({ videoEmotion, audioEmotion, identityMatch, lastUpdated }) => {
  return (
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
  );
};

export default EmotionIndicators;