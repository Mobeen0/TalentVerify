// components/AvatarVideoPlayer.jsx
import React from 'react';

const AvatarVideoPlayer = ({ avatarVideoRef, videoSrc }) => {
  return (
    <div className="tw-w-full tw-h-72 tw-bg-gray-900 tw-overflow-hidden">
      <video 
        ref={avatarVideoRef}
        src={videoSrc} 
        className="tw-w-full tw-h-full tw-object-cover"
        playsInline
        preload="auto"
        onError={(e) => console.error("Video error:", e)}
      />
    </div>
  );
};

export default AvatarVideoPlayer;