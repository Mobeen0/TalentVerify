import React from 'react';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const Footer = ({ isSidebarOpen }) => {
  const sidebarWidth = 280;
  const { isDarkMode } = useTheme();

  return (
    <footer 
      className={`tw-py-12 tw-transition-all tw-duration-300 tw-ease-in-out
        ${isDarkMode 
          ? 'tw-bg-gradient-to-r tw-from-gray-900 tw-to-gray-800 tw-text-white' 
          : 'tw-bg-gradient-to-r tw-from-gray-50 tw-to-gray-100 tw-text-gray-800'
        }
        ${isSidebarOpen ? 'lg:tw-ml-[280px]' : ''}`}
      style={{
        width: isSidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%'
      }}
    >
      <div className="tw-max-w-7xl tw-mx-auto tw-px-4">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-8">
          <div className="tw-space-y-4">
            <h3 className={`tw-text-2xl tw-font-bold ${isDarkMode ? 'tw-text-white' : 'tw-text-gray-900'}`}>
              TalentVerify
            </h3>
            <p className={`${isDarkMode ? 'tw-text-gray-300' : 'tw-text-gray-600'} tw-leading-relaxed`}>
              AI-powered interviewer focusing on emotional intelligence and soft skills evaluation.
            </p>
            <div className="tw-flex tw-space-x-4">
              <a href="#" className={`${isDarkMode ? 'tw-text-gray-300 hover:tw-text-white' : 'tw-text-gray-600 hover:tw-text-gray-900'} tw-transition-colors`}>
                <FaLinkedin className="tw-w-6 tw-h-6" />
              </a>
              <a href="#" className={`${isDarkMode ? 'tw-text-gray-300 hover:tw-text-white' : 'tw-text-gray-600 hover:tw-text-gray-900'} tw-transition-colors`}>
                <FaTwitter className="tw-w-6 tw-h-6" />
              </a>
              <a href="#" className={`${isDarkMode ? 'tw-text-gray-300 hover:tw-text-white' : 'tw-text-gray-600 hover:tw-text-gray-900'} tw-transition-colors`}>
                <FaFacebook className="tw-w-6 tw-h-6" />
              </a>
              <a href="#" className={`${isDarkMode ? 'tw-text-gray-300 hover:tw-text-white' : 'tw-text-gray-600 hover:tw-text-gray-900'} tw-transition-colors`}>
                <FaInstagram className="tw-w-6 tw-h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className={`tw-text-lg tw-font-semibold tw-mb-4 ${isDarkMode ? 'tw-text-white' : 'tw-text-gray-900'}`}>
              Quick Links
            </h3>
            <ul className="tw-space-y-3">
              {['For Employers', 'For Interviewees', 'About AI Technology', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className={`${isDarkMode ? 'tw-text-gray-300 hover:tw-text-white' : 'tw-text-gray-600 hover:tw-text-gray-900'} 
                      tw-transition-colors tw-flex tw-items-center`}
                  >
                    <span className={`tw-w-1.5 tw-h-1.5 tw-rounded-full tw-mr-2 ${isDarkMode ? 'tw-bg-blue-500' : 'tw-bg-blue-600'}`}></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`tw-text-lg tw-font-semibold tw-mb-4 ${isDarkMode ? 'tw-text-white' : 'tw-text-gray-900'}`}>
              Contact Us
            </h3>
            <div className="tw-space-y-3">
              <p className={`${isDarkMode ? 'tw-text-gray-300' : 'tw-text-gray-600'} tw-flex tw-items-center`}>
                <svg className="tw-w-5 tw-h-5 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@talentverify.com
              </p>
              <p className={`${isDarkMode ? 'tw-text-gray-300' : 'tw-text-gray-600'} tw-flex tw-items-center`}>
                <svg className="tw-w-5 tw-h-5 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (123) 456-7890
              </p>
            </div>
          </div>

          <div>
            <h3 className={`tw-text-lg tw-font-semibold tw-mb-4 ${isDarkMode ? 'tw-text-white' : 'tw-text-gray-900'}`}>
              Newsletter
            </h3>
            <p className={`${isDarkMode ? 'tw-text-gray-300' : 'tw-text-gray-600'} tw-mb-4`}>
              Subscribe to our newsletter for updates and insights.
            </p>
            <form className="tw-space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className={`tw-w-full tw-px-4 tw-py-2 tw-rounded-lg tw-border focus:tw-outline-none
                  ${isDarkMode 
                    ? 'tw-bg-gray-700 tw-text-white tw-border-gray-600 focus:tw-border-blue-500' 
                    : 'tw-bg-white tw-text-gray-900 tw-border-gray-300 focus:tw-border-blue-500'
                  }`}
              />
              <button
                type="submit"
                className="tw-w-full tw-px-4 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700 tw-transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className={`tw-mt-12 tw-pt-8 tw-border-t ${isDarkMode ? 'tw-border-gray-700' : 'tw-border-gray-200'}`}>
          <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center">
            <p className={`${isDarkMode ? 'tw-text-gray-300' : 'tw-text-gray-600'} tw-text-sm`}>
              © {new Date().getFullYear()} All rights reserved by {' '}
              <a 
                href="https://www.talentverify.com" 
                className={`${isDarkMode ? 'tw-text-blue-400 hover:tw-text-blue-300' : 'tw-text-blue-600 hover:tw-text-blue-700'}`}
              >
                TalentVerify
              </a>
            </p>
            <div className="tw-flex tw-space-x-6 tw-mt-4 md:tw-mt-0">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((link) => (
                <a 
                  key={link}
                  href="#" 
                  className={`${isDarkMode ? 'tw-text-gray-300 hover:tw-text-white' : 'tw-text-gray-600 hover:tw-text-gray-900'} 
                    tw-text-sm tw-transition-colors`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;