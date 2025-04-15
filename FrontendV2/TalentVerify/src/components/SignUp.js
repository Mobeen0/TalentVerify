import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Alert,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Paper,
  Container,
  Stack,
  Divider,
  alpha,
  InputAdornment,
  IconButton,
} from "@mui/material";

// Google Icon
const GoogleIcon = () => (
  <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// Eye Icon for password visibility
const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5C7.63636 5 4.19636 7.92 3 12C4.19636 16.08 7.63636 19 12 19C16.3636 19 19.8036 16.08 21 12C19.8036 7.92 16.3636 5 12 5ZM12 17C9.84091 17 8.09091 14.76 8.09091 12C8.09091 9.24 9.84091 7 12 7C14.1591 7 15.9091 9.24 15.9091 12C15.9091 14.76 14.1591 17 12 17ZM12 9C10.8409 9 9.90909 10.36 9.90909 12C9.90909 13.64 10.8409 15 12 15C13.1591 15 14.0909 13.64 14.0909 12C14.0909 10.36 13.1591 9 12 9Z" fill="currentColor"/>
  </svg>
);

// Eye Off Icon for password visibility
const EyeOffIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5C7.63636 5 4.19636 7.92 3 12C4.19636 16.08 7.63636 19 12 19C16.3636 19 19.8036 16.08 21 12C19.8036 7.92 16.3636 5 12 5ZM12 17C9.84091 17 8.09091 14.76 8.09091 12C8.09091 9.24 9.84091 7 12 7C14.1591 7 15.9091 9.24 15.9091 12C15.9091 14.76 14.1591 17 12 17ZM12 9C10.8409 9 9.90909 10.36 9.90909 12C9.90909 13.64 10.8409 15 12 15C13.1591 15 14.0909 13.64 14.0909 12C14.0909 10.36 13.1591 9 12 9Z" fill="currentColor"/>
    <path d="M2 2L22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const API_URL = 'http://localhost:8000';

const domainList = [
  'Web Development',
  'Frontend Development',
  'Backend Development',
  'Software Engineer',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Artificial Intelligence',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'Blockchain',
  'IoT',
];

const SignUp = ({ setuserFunc, setUserName }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({
    firstName: '', lastName: '', dateOfBirth: '', email: '',
    username: '', password: '', confirmPassword: '', userType: 'interviewee',
    organization: '', domains: []
  });
  let navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSignUpChange = (e) => {
    setSignUpForm({ ...signUpForm, [e.target.name]: e.target.value });
  };

  const handleDomainChange = (event) => {
    const {
      target: { value },
    } = event;
    setSignUpForm({
      ...signUpForm,
      domains: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleDeleteDomain = (domainToDelete) => () => {
    setSignUpForm({
      ...signUpForm,
      domains: signUpForm.domains.filter((domain) => domain !== domainToDelete),
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginForm.username || !loginForm.password) {
      setError('Username and Password are required');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/Login`, null, {
        params: {
          UserName: loginForm.username,
          Password: loginForm.password
        }
      });
      setSuccess(`Login successful. Welcome, ${response.data.UserInfo.FirstName} ${response.data.UserInfo.LastName}!`);
      console.log('Login response:', response.data);
      
      setUserName(loginForm.username);
      
      if(response.data.Type === "Employer"){
        setuserFunc("Employer");
        navigate('/loggedInEmployer');
      }
      if(response.data.Type === "Interviewee"){
        setuserFunc("Interviewee");
        navigate('/dashboards/intervieweeSearch');
      }
    } catch (error) {
      setError(error.response?.data?.Message || 'Login failed. Please try again.');
    }
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    for (const [key, value] of Object.entries(signUpForm)) {
      if (key === 'organization' && signUpForm.userType !== 'employer') continue;
      if (key === 'domains' && signUpForm.userType !== 'interviewee') continue;
      if (value === '' || (Array.isArray(value) && value.length === 0)) {
        setError(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
        return;
      }
    }

    if (!validateEmail(signUpForm.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    let response;
    try {
      if (signUpForm.userType === 'employer') {
        response = await axios.post(`${API_URL}/SignUpEmployer`, null, {
          params: {
            FirstName: signUpForm.firstName,
            LastName: signUpForm.lastName,
            DateOfBirth: formatDate(signUpForm.dateOfBirth),
            UserName: signUpForm.username,
            Password: signUpForm.password,
            Email: signUpForm.email,
            Organization: signUpForm.organization,
            PicFlag: 0 // Assuming default value
          }
        });
      } else {
        response = await axios.post(`${API_URL}/SignUpInterviewee`, null, {
          params: {
            FirstName: signUpForm.firstName,
            LastName: signUpForm.lastName,
            DateOfBirth: formatDate(signUpForm.dateOfBirth),
            UserName: signUpForm.username,
            Password: signUpForm.password,
            Email: signUpForm.email,
            PicFlag: 0 // Assuming default value
            // Domains: signUpForm.domains.join(',')
          }
        });
      }
      setSuccess(response.data.message);
    } catch (error) {
      setError(error.response?.content?.message || 'Sign up failed. Please try again.');
    }
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
        {/* Header with Tabs */}
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
            Log In
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

        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, textAlign: 'center' }}>
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </Typography>
          
          {/* Alerts */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                '& .MuiAlert-message': { fontWeight: 500 }
              }}
            >
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                '& .MuiAlert-message': { fontWeight: 500 }
              }}
            >
              {success}
            </Alert>
          )}
          
          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  variant="outlined"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  InputProps={{
                    sx: { borderRadius: 2 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <Grid container alignItems="center" justifyContent="space-between">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        name="rememberMe"
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                  <Typography 
                    variant="body2" 
                    color="primary" 
                    sx={{ 
                      cursor: 'pointer',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Forgot password?
                  </Typography>
                </Grid>
                
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  size="large"
                  sx={{ 
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0, 127, 255, 0.15)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0, 127, 255, 0.25)',
                    }
                  }}
                >
                  Log In
                </Button>
              </Stack>
            </form>
          ) : (
            // Sign Up Form
            <form onSubmit={handleSignUpSubmit}>
              <Stack spacing={3}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>I am a(n)</FormLabel>
                  <RadioGroup
                    row
                    name="userType"
                    value={signUpForm.userType}
                    onChange={handleSignUpChange}
                  >
                    <FormControlLabel 
                      value="interviewee" 
                      control={<Radio />} 
                      label="Interviewee" 
                      sx={{ 
                        mr: 4,
                        '& .MuiFormControlLabel-label': { fontWeight: 500 } 
                      }}
                    />
                    <FormControlLabel 
                      value="employer" 
                      control={<Radio />} 
                      label="Employer" 
                      sx={{ '& .MuiFormControlLabel-label': { fontWeight: 500 } }}
                    />
                  </RadioGroup>
                </FormControl>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      variant="outlined"
                      value={signUpForm.firstName}
                      onChange={handleSignUpChange}
                      InputProps={{
                        sx: { borderRadius: 2 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      variant="outlined"
                      value={signUpForm.lastName}
                      onChange={handleSignUpChange}
                      InputProps={{
                        sx: { borderRadius: 2 }
                      }}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={signUpForm.dateOfBirth}
                  onChange={handleSignUpChange}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />

                {signUpForm.userType === 'employer' && (
                  <TextField
                    fullWidth
                    label="Organization Name"
                    name="organization"
                    variant="outlined"
                    value={signUpForm.organization}
                    onChange={handleSignUpChange}
                    InputProps={{
                      sx: { borderRadius: 2 }
                    }}
                  />
                )}

                {signUpForm.userType === 'interviewee' && (
                  <FormControl fullWidth>
                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>Domains</FormLabel>
                    <Select
                      multiple
                      value={signUpForm.domains}
                      onChange={handleDomainChange}
                      input={<OutlinedInput sx={{ borderRadius: 2 }} />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              onDelete={handleDeleteDomain(value)}
                              onMouseDown={(event) => {
                                event.stopPropagation();
                              }}
                              sx={{ 
                                borderRadius: 1,
                                fontWeight: 500,
                                backgroundColor: alpha('#007FFF', 0.1),
                                color: 'primary.main',
                                '& .MuiChip-deleteIcon': {
                                  color: 'primary.main',
                                }
                              }}
                            />
                          ))}
                        </Box>
                      )}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 250,
                          },
                        },
                      }}
                    >
                      {domainList.map((domain) => (
                        <MenuItem
                          key={domain}
                          value={domain}
                          style={signUpForm.domains.indexOf(domain) === -1 ? {} : { display: 'none' }}
                        >
                          {domain}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  value={signUpForm.email}
                  onChange={handleSignUpChange}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />

                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  variant="outlined"
                  value={signUpForm.username}
                  onChange={handleSignUpChange}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={signUpForm.password}
                  onChange={handleSignUpChange}
                  InputProps={{
                    sx: { borderRadius: 2 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  variant="outlined"
                  value={signUpForm.confirmPassword}
                  onChange={handleSignUpChange}
                  InputProps={{
                    sx: { borderRadius: 2 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  size="large"
                  sx={{ 
                    borderRadius: 2,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0, 127, 255, 0.15)',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(0, 127, 255, 0.25)',
                    }
                  }}
                >
                  Create Account
                </Button>
              </Stack>
            </form>
          )}
          
          {/* Social Login Section */}
          <Box sx={{ mt: 4, position: 'relative' }}>
            <Divider sx={{ '&::before, &::after': { borderColor: 'rgba(0, 0, 0, 0.08)' }}}>
              <Typography 
                variant="body2" 
                sx={{ 
                  px: 2, 
                  color: 'text.secondary',
                  fontWeight: 500
                }}
              >
                Or continue with
              </Typography>
            </Divider>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<GoogleIcon />}
              sx={{ 
                mt: 3,
                borderRadius: 2,
                py: 1.2,
                borderColor: 'rgba(0, 0, 0, 0.12)',
                color: 'text.primary',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                  borderColor: 'rgba(0, 0, 0, 0.2)',
                }
              }}
            >
              {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
            </Button>
          </Box>
        </CardContent>
      </Paper>
    </Container>
  );
};

export default SignUp;