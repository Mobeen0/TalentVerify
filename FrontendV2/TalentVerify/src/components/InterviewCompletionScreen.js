// InterviewCompletionScreen.jsx
import React from 'react';
import { Award, Sparkles, CheckCircle, Share, Download, BarChart } from 'lucide-react';
import confetti from 'canvas-confetti';

const InterviewCompletionScreen = ({ evaluationResults = [], userName = "Candidate" }) => {
  const calculateAverageScore = () => {
    if (!evaluationResults || evaluationResults.length === 0) return 75;
    return Math.round(evaluationResults.reduce((sum, result) => sum + result.score, 0) / evaluationResults.length);
  };

  // Trigger confetti effect on component mount
  React.useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min, max) => Math.random() * (max - min) + min;
    
    const confettiAnimation = () => {
      const timeLeft = animationEnd - Date.now();
      
      if (timeLeft <= 0) return;
      
      const particleCount = 50 * (timeLeft / duration);
      
      // Since particles fall down, start from the top
      confetti({
        particleCount,
        spread: 70,
        origin: { y: 0 },
        colors: ['#5D5FEF', '#4CAF50', '#2196F3'],
      });
      
      requestAnimationFrame(confettiAnimation);
    };
    
    confettiAnimation();
    
    return () => {
      // Clear any potential animations
      cancelAnimationFrame(confettiAnimation);
    };
  }, []);

  // Demo feedback highlights
  const feedbackHighlights = [
    "Strong communication skills demonstrated",
    "Well-structured answers to technical questions",
    "Good balance of confidence and thoughtfulness",
    "Maintained positive facial expressions throughout",
    "Excellent voice tone and clarity"
  ];

  const averageScore = calculateAverageScore();

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-screen tw-bg-gradient-to-br tw-from-indigo-50 tw-to-blue-100 tw-p-6">
      <div className="tw-max-w-4xl tw-w-full tw-bg-white tw-rounded-2xl tw-shadow-xl tw-overflow-hidden tw-transition-all tw-duration-500 hover:tw-shadow-2xl tw-p-8">
        {/* Header with congratulations */}
        <div className="tw-text-center tw-mb-8 tw-relative">
          <div className="tw-absolute tw-inset-0 tw-flex tw-justify-center tw-items-center tw-opacity-5">
            <Award size={200} />
          </div>
          <h1 className="tw-text-3xl tw-font-bold tw-text-indigo-600 tw-mb-2 tw-flex tw-items-center tw-justify-center">
            <Sparkles className="tw-mr-2" size={28} />
            Interview Completed!
            <Sparkles className="tw-ml-2" size={28} />
          </h1>
          <p className="tw-text-lg tw-text-gray-600">
            Thank you for participating in the interview simulation, {userName}!
          </p>
        </div>
        
        {/* Score and summary section */}
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-8 tw-mb-8">
          {/* Left side - Score */}
          <div className="tw-flex-1 tw-bg-indigo-50 tw-rounded-xl tw-p-6 tw-text-center tw-flex tw-flex-col tw-items-center tw-justify-center">
            <div className="tw-relative tw-w-40 tw-h-40 tw-mb-4">
              <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
                <div className="tw-relative tw-w-36 tw-h-36 tw-rounded-full tw-bg-white tw-flex tw-items-center tw-justify-center tw-shadow-md">
                  <div className="tw-font-bold tw-text-4xl tw-text-indigo-600">{averageScore}%</div>
                </div>
              </div>
              <svg className="tw-w-full tw-h-full tw-transform tw--rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#e6e6e6" 
                  strokeWidth="10"
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#5D5FEF" 
                  strokeWidth="10"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * averageScore / 100)}
                />
              </svg>
            </div>
            <h3 className="tw-text-xl tw-font-semibold tw-text-gray-700">Overall Score</h3>
          </div>
          
          {/* Right side - Feedback */}
          <div className="tw-flex-1 tw-bg-white tw-border tw-border-gray-200 tw-rounded-xl tw-p-6">
            <h3 className="tw-text-xl tw-font-semibold tw-text-gray-700 tw-mb-4 tw-flex tw-items-center">
              <CheckCircle size={20} className="tw-text-green-500 tw-mr-2" />
              Feedback Highlights
            </h3>
            <ul className="tw-space-y-3">
              {feedbackHighlights.map((feedback, index) => (
                <li key={index} className="tw-flex tw-items-start">
                  <div className="tw-h-6 tw-w-6 tw-rounded-full tw-bg-green-100 tw-flex tw-items-center tw-justify-center tw-text-green-600 tw-font-medium tw-mr-3 tw-mt-0.5">
                    {index + 1}
                  </div>
                  <p className="tw-text-gray-600">{feedback}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="tw-flex tw-flex-wrap tw-gap-4 tw-justify-center">
          <button className="tw-group tw-flex tw-items-center tw-bg-indigo-600 tw-text-white tw-px-6 tw-py-3 tw-rounded-lg tw-font-medium tw-transition-all hover:tw-bg-indigo-700">
            <BarChart size={18} className="tw-mr-2 tw-transition-transform group-hover:tw-scale-110" />
            View Detailed Report
          </button>
          <button className="tw-group tw-flex tw-items-center tw-bg-white tw-border tw-border-indigo-600 tw-text-indigo-600 tw-px-6 tw-py-3 tw-rounded-lg tw-font-medium tw-transition-all hover:tw-bg-indigo-50">
            <Download size={18} className="tw-mr-2 tw-transition-transform group-hover:tw-scale-110" />
            Download Results
          </button>
          <button className="tw-group tw-flex tw-items-center tw-bg-white tw-border tw-border-gray-300 tw-text-gray-600 tw-px-6 tw-py-3 tw-rounded-lg tw-font-medium tw-transition-all hover:tw-bg-gray-50">
            <Share size={18} className="tw-mr-2 tw-transition-transform group-hover:tw-scale-110" />
            Share Feedback
          </button>
        </div>
        
        {/* Footer with next steps */}
        <div className="tw-mt-10 tw-text-center tw-p-6 tw-bg-gray-50 tw-rounded-xl">
          <h3 className="tw-text-lg tw-font-semibold tw-text-gray-700 tw-mb-2">Next Steps</h3>
          <p className="tw-text-gray-600">
            Review your feedback, practice areas for improvement, and feel free to try another interview simulation to continue building your skills!
          </p>
        </div>
      </div>
      
      {/* Bottom button */}
      <button 
        className="tw-mt-8 tw-bg-white tw-border tw-border-indigo-600 tw-text-indigo-600 tw-px-6 tw-py-2 tw-rounded-full tw-font-medium tw-transition-all hover:tw-bg-indigo-50"
        onClick={() => window.location.reload()}
      >
        Start New Interview
      </button>
    </div>
  );
};

export default InterviewCompletionScreen;