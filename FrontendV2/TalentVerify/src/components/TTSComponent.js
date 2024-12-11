// TTSComponent.js
import React, { useState } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function TTSComponent({ onSpeechResult }) {
  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: false });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    if (transcript) {
      onSpeechResult(transcript);
      resetTranscript();
    }
  };

  return (
    <div className="tw-flex tw-items-center">
      <button
        onClick={handleStartListening}
        className="tw-mr-2 tw-flex tw-items-center tw-px-5 tw-py-2 tw-rounded-lg tw-bg-green-500 tw-text-white hover:tw-bg-green-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-green-400"
      >
        <MicIcon className="tw-mr-2" />
        Start
      </button>
      <button
        onClick={handleStopListening}
        className="tw-flex tw-items-center tw-px-5 tw-py-2 tw-rounded-lg tw-bg-red-500 tw-text-white hover:tw-bg-red-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-400"
      >
        Stop
      </button>
    </div>
  );
}

export default TTSComponent;
