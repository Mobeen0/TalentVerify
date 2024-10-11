import React from 'react';

const Footer = ({ isSidebarOpen }) => {
  const sidebarWidth = 280; // Adjust this to match your sidebar width

  return (
    <footer 
      className={`tw-bg-gray-100 tw-py-8 tw-transition-all tw-duration-300 tw-ease-in-out ${
        isSidebarOpen ? 'lg:tw-ml-[280px]' : ''
      }`}
      style={{
        width: isSidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%'
      }}
    >
      <div className="tw-max-w-6xl tw-mx-auto tw-px-4">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8">
          <div>
            <h3 className="tw-text-lg tw-font-semibold tw-mb-4">TalentVerify</h3>
            <p className="tw-text-sm tw-text-gray-600">
              AI-powered interviewer focusing on emotional intelligence and soft skills evaluation.
            </p>
          </div>
          <div>
            <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Quick Links</h3>
            <ul className="tw-space-y-2">
              <li><a href="#" className="tw-text-sm tw-text-blue-600 hover:tw-underline">For Employers</a></li>
              <li><a href="#" className="tw-text-sm tw-text-blue-600 hover:tw-underline">For Interviewees</a></li>
              <li><a href="#" className="tw-text-sm tw-text-blue-600 hover:tw-underline">About AI Technology</a></li>
              <li><a href="#" className="tw-text-sm tw-text-blue-600 hover:tw-underline">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="tw-text-lg tw-font-semibold tw-mb-4">Contact Us</h3>
            <p className="tw-text-sm tw-text-gray-600">
              Email: support@talentverify.com<br />
              Phone: (123) 456-7890
            </p>
          </div>
        </div>
        <div className="tw-mt-8 tw-pt-8 tw-border-t tw-border-gray-200 tw-text-center">
          <p className="tw-text-sm tw-text-gray-600">
            © {new Date().getFullYear()} All rights reserved by {' '}
            <a href="https://www.talentverify.com" className="tw-text-blue-600 hover:tw-underline">
              TalentVerify
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;