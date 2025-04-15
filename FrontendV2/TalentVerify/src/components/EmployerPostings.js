import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, Wrench, ChevronRight, X, User, MapPin, Clock } from 'lucide-react';

function EmployerPostings({ userName }) {
  const [postings, setPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPosting, setSelectedPosting] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:8000/ShowAllPostings?Username=${encodeURIComponent(userName)}`)
      .then(response => response.json())
      .then(data => {
        const postingsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          title: value.JobTitle,
          description: value.JobDescription,
          skills: value.JobSkills,
          datePosted: value.JobDate,
        }));
        setPostings(postingsArray);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching job postings:', error);
        setIsLoading(false);
      });
  }, [userName]);

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewDetails = (posting) => {
    setSelectedPosting(posting);
    setShowModal(true);
    // Add a class to the body to prevent scrolling when modal is open
    document.body.classList.add('tw-overflow-hidden');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPosting(null);
    // Remove the class from the body to allow scrolling again
    document.body.classList.remove('tw-overflow-hidden');
  };

  // Close modal when clicking outside of it
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [showModal]);

  return (
    <div className="tw-bg-gradient-to-br tw-from-sky-50 tw-to-blue-50 tw-min-h-screen tw-py-12 tw-px-4 sm:tw-px-6 lg:tw-px-8">
      <div className="tw-max-w-7xl tw-mx-auto">
        <div className="tw-text-center tw-mb-12">
          <h2 className="tw-text-3xl tw-font-extrabold tw-text-transparent tw-bg-clip-text tw-bg-gradient-to-r tw-from-sky-400 tw-to-blue-500 tw-mb-2">
            Your Job Postings
          </h2>
          <p className="tw-text-gray-500 tw-max-w-2xl tw-mx-auto">
            Manage and track all your current job listings in one place
          </p>
        </div>
        
        {isLoading ? (
          <div className="tw-flex tw-justify-center tw-items-center tw-py-20">
            <div className="tw-animate-pulse tw-flex tw-space-x-4">
              <div className="tw-h-3 tw-w-3 tw-bg-sky-300 tw-rounded-full"></div>
              <div className="tw-h-3 tw-w-3 tw-bg-sky-400 tw-rounded-full"></div>
              <div className="tw-h-3 tw-w-3 tw-bg-blue-400 tw-rounded-full"></div>
            </div>
          </div>
        ) : postings.length === 0 ? (
          <div className="tw-text-center tw-bg-white tw-rounded-xl tw-shadow-md tw-p-12 tw-max-w-lg tw-mx-auto">
            <div className="tw-inline-flex tw-items-center tw-justify-center tw-w-16 tw-h-16 tw-rounded-full tw-bg-sky-100 tw-mb-4">
              <Briefcase className="tw-h-8 tw-w-8 tw-text-sky-500" />
            </div>
            <h3 className="tw-text-xl tw-font-medium tw-text-gray-800 tw-mb-2">No Job Postings Yet</h3>
            <p className="tw-text-gray-500 tw-mb-6">Create your first job posting to start finding the perfect candidates</p>
            <button className="tw-px-5 tw-py-3 tw-bg-sky-500 tw-text-white tw-rounded-lg tw-font-medium hover:tw-bg-sky-600 tw-transition-colors tw-shadow-md hover:tw-shadow-lg">
              Create New Posting
            </button>
          </div>
        ) : (
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-8">
            {postings.map(posting => (
              <div 
                key={posting.id}
                className="tw-group tw-bg-white tw-rounded-xl tw-overflow-hidden tw-shadow-md hover:tw-shadow-xl tw-transition-all tw-duration-300 tw-border tw-border-gray-100 hover:tw-border-sky-200 tw-flex tw-flex-col"
              >
                <div className="tw-p-6 tw-flex-grow">
                  <div className="tw-flex tw-items-start tw-justify-between tw-mb-4">
                    <div className="tw-flex tw-items-center">
                      <div className="tw-flex-shrink-0 tw-h-10 tw-w-10 tw-rounded-md tw-bg-gradient-to-r tw-from-sky-400 tw-to-blue-500 tw-flex tw-items-center tw-justify-center">
                        <Briefcase className="tw-h-5 tw-w-5 tw-text-white" />
                      </div>
                      <div className="tw-ml-4">
                        <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800 group-hover:tw-text-sky-500 tw-transition-colors">
                          {posting.title}
                        </h3>
                        <p className="tw-text-sm tw-text-sky-500">ID: {posting.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="tw-mb-6">
                    <p className="tw-text-gray-600 tw-line-clamp-3 tw-text-sm">
                      {posting.description}
                    </p>
                  </div>

                  <div className="tw-space-y-3">
                    <div className="tw-flex tw-items-start">
                      <Wrench className="tw-h-5 tw-w-5 tw-text-gray-400 tw-mt-0.5 tw-flex-shrink-0" />
                      <div className="tw-ml-3">
                        <h4 className="tw-text-xs tw-uppercase tw-tracking-wider tw-text-gray-500 tw-font-medium">Skills</h4>
                        <p className="tw-text-sm tw-text-gray-700">{posting.skills}</p>
                      </div>
                    </div>
                    
                    <div className="tw-flex tw-items-start">
                      <Calendar className="tw-h-5 tw-w-5 tw-text-gray-400 tw-mt-0.5 tw-flex-shrink-0" />
                      <div className="tw-ml-3">
                        <h4 className="tw-text-xs tw-uppercase tw-tracking-wider tw-text-gray-500 tw-font-medium">Posted on</h4>
                        <p className="tw-text-sm tw-text-gray-700">{formatDate(posting.datePosted)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="tw-px-6 tw-py-4 tw-bg-gray-50 tw-border-t tw-border-gray-100">
                  <button
                    onClick={() => handleViewDetails(posting)}
                    className="tw-w-full tw-flex tw-items-center tw-justify-center tw-px-4 tw-py-2 tw-rounded-lg tw-bg-gradient-to-r tw-from-sky-400 tw-to-blue-500 hover:tw-from-sky-500 hover:tw-to-blue-600 tw-text-white tw-font-medium tw-text-sm tw-transition-all tw-duration-300 tw-shadow-sm hover:tw-shadow tw-group"
                  >
                    <span>View Details</span>
                    <ChevronRight className="tw-ml-2 tw-h-4 tw-w-4 group-hover:tw-translate-x-1 tw-transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for showing detailed view */}
      {showModal && selectedPosting && (
        <div 
          className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-4 tw-overflow-y-auto"
          onClick={handleBackdropClick}
        >
          <div 
            className="tw-bg-white tw-rounded-xl tw-shadow-2xl tw-max-w-4xl tw-w-full tw-max-h-[90vh] tw-overflow-y-auto tw-transform tw-transition-all tw-duration-300 tw-animate-fadeIn"
            style={{animation: "0.3s ease-out 0s 1 normal none running fadeIn"}}
          >
            <div className="tw-sticky tw-top-0 tw-z-10 tw-bg-white tw-border-b tw-border-gray-100 tw-flex tw-justify-between tw-items-center tw-p-6">
              <h2 className="tw-text-2xl tw-font-bold tw-text-gray-800">Job Posting Details</h2>
              <button 
                onClick={closeModal}
                className="tw-p-2 tw-rounded-full tw-text-gray-400 hover:tw-text-gray-600 hover:tw-bg-gray-100 tw-transition-colors"
              >
                <X className="tw-h-6 tw-w-6" />
              </button>
            </div>
            
            <div className="tw-p-6">
              <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-start tw-gap-6 tw-mb-8">
                <div className="tw-flex-shrink-0 tw-h-16 tw-w-16 tw-rounded-lg tw-bg-gradient-to-r tw-from-sky-400 tw-to-blue-500 tw-flex tw-items-center tw-justify-center">
                  <Briefcase className="tw-h-8 tw-w-8 tw-text-white" />
                </div>
                <div className="tw-flex-grow">
                  <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center md:tw-justify-between tw-gap-4">
                    <div>
                      <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800">{selectedPosting.title}</h1>
                      <p className="tw-text-sky-500">ID: {selectedPosting.id}</p>
                    </div>
                    <div className="tw-bg-sky-50 tw-border tw-border-sky-100 tw-rounded-lg tw-px-4 tw-py-2 tw-inline-flex tw-items-center">
                      <Calendar className="tw-h-5 tw-w-5 tw-text-sky-500 tw-mr-2" />
                      <span className="tw-text-sky-700 tw-font-medium">Posted: {formatDate(selectedPosting.datePosted)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="tw-mb-8">
                <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-3">Description</h3>
                <div className="tw-bg-gray-50 tw-rounded-lg tw-p-4 tw-border tw-border-gray-100">
                  <p className="tw-text-gray-700 tw-whitespace-pre-wrap">{selectedPosting.description}</p>
                </div>
              </div>
              
              <div className="tw-mb-8">
                <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-3">Required Skills</h3>
                <div className="tw-bg-gray-50 tw-rounded-lg tw-p-4 tw-border tw-border-gray-100">
                  <div className="tw-flex tw-flex-wrap tw-gap-2">
                    {selectedPosting.skills.split(',').map((skill, index) => (
                      <span 
                        key={index} 
                        className="tw-px-3 tw-py-1 tw-bg-sky-100 tw-text-sky-700 tw-rounded-full tw-text-sm tw-font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6 tw-mb-8">
                <div className="tw-bg-gray-50 tw-rounded-lg tw-p-4 tw-border tw-border-gray-100">
                  <div className="tw-flex tw-items-center tw-mb-2">
                    <User className="tw-h-5 tw-w-5 tw-text-gray-500 tw-mr-2" />
                    <h4 className="tw-font-medium tw-text-gray-700">Applicants</h4>
                  </div>
                  <p className="tw-text-gray-600">0 applicants so far</p>
                </div>
                
                <div className="tw-bg-gray-50 tw-rounded-lg tw-p-4 tw-border tw-border-gray-100">
                  <div className="tw-flex tw-items-center tw-mb-2">
                    <Clock className="tw-h-5 tw-w-5 tw-text-gray-500 tw-mr-2" />
                    <h4 className="tw-font-medium tw-text-gray-700">Status</h4>
                  </div>
                  <div className="tw-flex tw-items-center">
                    <span className="tw-w-2 tw-h-2 tw-bg-green-500 tw-rounded-full tw-mr-2"></span>
                    <p className="tw-text-gray-600">Active</p>
                  </div>
                </div>
              </div>
              
              <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 tw-mt-6">
                <button className="tw-flex-1 tw-px-6 tw-py-3 tw-bg-sky-500 tw-text-white tw-rounded-lg tw-font-medium hover:tw-bg-sky-600 tw-transition-colors tw-shadow-md hover:tw-shadow-lg tw-flex tw-items-center tw-justify-center">
                  <span>Edit Posting</span>
                </button>
                <button className="tw-flex-1 tw-px-6 tw-py-3 tw-bg-white tw-text-red-500 tw-border tw-border-red-200 tw-rounded-lg tw-font-medium hover:tw-bg-red-50 tw-transition-colors tw-shadow-sm hover:tw-shadow tw-flex tw-items-center tw-justify-center">
                  <span>Delete Posting</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default EmployerPostings;