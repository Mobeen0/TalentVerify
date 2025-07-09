import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { FileUp } from 'lucide-react';

const UploadScreen = ({ loading, handlePdfUpload }) => {
  return (
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
  );
};

export default UploadScreen;