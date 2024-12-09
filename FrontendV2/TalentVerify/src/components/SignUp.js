import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import {
  Card,
  CardContent,
  Divider,
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
} from "@mui/material";

const GoogleIcon = () => (
  <svg style={{ width: '20px', height: '20px', marginRight: '10px' }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
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

const SignUp = ({setuserFunc}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({
    firstName: '', lastName: '', dateOfBirth: '', email: '',
    username: '', password: '', confirmPassword: '', userType: 'interviewee',
    organization: '', domains: []
  });
  let navigate = useNavigate()

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
      
      if(response.data.Type === "Employer"){
        setuserFunc("Employer")
        navigate('/loggedInEmployer')
      }
      if(response.data.Type === "Interviewee"){
        setuserFunc("Interviewee")
        navigate('/loggedInInterviewee')
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
    <Card variant="outlined" sx={{ maxWidth: 500, margin: 'auto', mt: 5 }}>
      <Box sx={{ padding: "15px 30px" }} display="flex" alignItems="center">
        <Box flexGrow={1}>
          <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <CardContent sx={{ padding: "30px" }}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant={isLogin ? "contained" : "outlined"}
            onClick={() => setIsLogin(true)}
            sx={{ mr: 1 }}
          >
            Login
          </Button>
          <Button
            variant={!isLogin ? "contained" : "outlined"}
            onClick={() => setIsLogin(false)}
          >
            Register
          </Button>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              variant="outlined"
              value={loginForm.username}
              onChange={handleLoginChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={loginForm.password}
              onChange={handleLoginChange}
              sx={{ mb: 2 }}
            />
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
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
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                Forgot password?
              </Typography>
            </Grid>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSignUpSubmit}>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">I am a(n)</FormLabel>
              <RadioGroup
                row
                name="userType"
                value={signUpForm.userType}
                onChange={handleSignUpChange}
              >
                <FormControlLabel value="interviewee" control={<Radio />} label="Interviewee" />
                <FormControlLabel value="employer" control={<Radio />} label="Employer" />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              variant="outlined"
              value={signUpForm.firstName}
              onChange={handleSignUpChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              variant="outlined"
              value={signUpForm.lastName}
              onChange={handleSignUpChange}
              sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={signUpForm.dateOfBirth}
                onChange={handleSignUpChange}
                sx={{ mb: 2 }}
                />
            {signUpForm.userType === 'employer' && (
              <TextField
                fullWidth
                label="Organization Name"
                name="organization"
                variant="outlined"
                value={signUpForm.organization}
                onChange={handleSignUpChange}
                sx={{ mb: 2 }}
              />
            )}
            {signUpForm.userType === 'interviewee' && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel component="legend">Domains</FormLabel>
                <Select
                  multiple
                  value={signUpForm.domains}
                  onChange={handleDomainChange}
                  input={<OutlinedInput />}
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
                        />
                      ))}
                    </Box>
                  )}
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
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Username"
              name="username"
              variant="outlined"
              value={signUpForm.username}
              onChange={handleSignUpChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={signUpForm.password}
              onChange={handleSignUpChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              value={signUpForm.confirmPassword}
              onChange={handleSignUpChange}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign Up
            </Button>
          </form>
        )}
        
        <Box sx={{ mt: 3, position: 'relative' }}>
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ px: 2, bgcolor: 'background.paper' }}>
              Or continue with
            </Typography>
          </Divider>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<GoogleIcon />}
            sx={{ mt: 2 }}
          >
            Sign {isLogin ? 'in' : 'up'} with Google
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SignUp;