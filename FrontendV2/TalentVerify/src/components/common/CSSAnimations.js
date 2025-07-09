// components/CSSAnimations.jsx
import React from 'react';

const CSSAnimations = () => {
  return (
    <style jsx>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideInRight {
        from { transform: translateX(20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideInLeft {
        from { transform: translateX(-20px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }
      
      .tw-animate-fadeIn {
        animation: fadeIn 0.5s ease-out forwards;
      }
      
      .tw-animate-slideInRight {
        animation: slideInRight 0.5s ease-out forwards;
      }
      
      .tw-animate-slideInLeft {
        animation: slideInLeft 0.5s ease-out forwards;
      }
      
      .tw-animate-pulse {
        animation: pulse 2s infinite;
      }
    `}</style>
  );
};

export default CSSAnimations;