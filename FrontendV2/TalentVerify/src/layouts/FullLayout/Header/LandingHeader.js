import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';

const LogoSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="50" viewBox="0 0 250 80">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1E90FF" />
          <stop offset="50%" stopColor="#00CED1" />
          <stop offset="100%" stopColor="#2E8B57" />
        </linearGradient>
        <clipPath id="text-clip">
          <text x="10" y="50" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold">TalentVerify</text>
        </clipPath>
      </defs>
      <rect x="0" y="0" width="250" height="80" fill="url(#gradient)" clipPath="url(#text-clip)" />
      <path d="M10,60 Q40,70 70,60 T130,60 T190,60 T250,60" fill="none" stroke="#1E90FF" strokeWidth="3" />
    </svg>
  );

const LandingHeader = () => {
  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <LogoSVG />
        </Box>
        <Button 
          sx={{ 
            color: 'black', 
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            mx: 1,
          }} 
          component={Link} 
          to="/about"
        >
          About
        </Button>
        <Button 
          sx={{ 
            color: 'black', 
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            mx: 1,
          }} 
          component={Link} 
          to="/features"
        >
          Features
        </Button>
        <Button 
          sx={{ 
            color: 'black', 
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            mx: 1,
          }} 
          component={Link} 
          to="/pricing"
        >
          Blog
        </Button>
        <Button 
          variant="contained" 
          component={Link} 
          to="/login" 
          sx={{ 
            ml: 2, 
            backgroundColor: '#1E90FF', 
            color: 'white',
            '&:hover': { 
              backgroundColor: '#1976D2' 
            } 
          }}
        >
          Contact
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default LandingHeader;