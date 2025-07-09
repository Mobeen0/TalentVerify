import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="tw-p-2 tw-rounded-lg tw-transition-colors tw-duration-200
        dark:tw-bg-gray-700 dark:hover:tw-bg-gray-600
        tw-bg-gray-100 hover:tw-bg-gray-200"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <FaSun className="tw-w-5 tw-h-5 tw-text-yellow-400" />
      ) : (
        <FaMoon className="tw-w-5 tw-h-5 tw-text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle; 