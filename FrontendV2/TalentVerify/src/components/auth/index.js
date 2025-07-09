import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  Button,
  alpha,
} from "@mui/material";
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import GoogleIcon from './components/GoogleIcon';

const Auth = ({ setuserFunc, setUserName }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLoginSuccess = (data) => {
    setUserName(data.UserInfo.UserName);
    if (data.Type === "Employer") {
      setuserFunc("Employer");
      navigate('/loggedInEmployer');
    } else if (data.Type === "Interviewee") {
      setuserFunc("Interviewee");
      navigate('/dashboards/intervieweeSearch');
    }
  };

  const handleSignUpSuccess = (data) => {
    setIsLogin(true);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={6}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: '#f9fafb',
        }}>
          <Button
            onClick={() => setIsLogin(true)}
            sx={{
              flex: 1,
              py: 3,
              borderRadius: 0,
              fontSize: '1rem',
              fontWeight: isLogin ? 700 : 500,
              color: isLogin ? 'primary.main' : 'text.secondary',
              borderBottom: isLogin ? 3 : 0,
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: alpha('#000', 0.04),
              },
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => setIsLogin(false)}
            sx={{
              flex: 1,
              py: 3,
              borderRadius: 0,
              fontSize: '1rem',
              fontWeight: !isLogin ? 700 : 500,
              color: !isLogin ? 'primary.main' : 'text.secondary',
              borderBottom: !isLogin ? 3 : 0,
              borderColor: 'primary.main',
              '&:hover': {
                backgroundColor: alpha('#000', 0.04),
              },
            }}
          >
            Sign Up
          </Button>
        </Box>

        <Box sx={{ p: 4 }}>
          {isLogin ? (
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          ) : (
            <SignUpForm onSignUpSuccess={handleSignUpSuccess} />
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{ mt: 2 }}
            >
              Continue with Google
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Auth; 