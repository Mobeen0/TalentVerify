import React from 'react';

const WebcamDisplay = ({ webCamRef }) => {
  return (
    <div className="tw-w-full tw-h-72 tw-bg-black tw-overflow-hidden">
      <video
        ref={webCamRef}
        autoPlay
        playsInline
        muted
        className="tw-w-full tw-h-full tw-object-cover"
      />
    </div>
  );
};

export default WebcamDisplay;