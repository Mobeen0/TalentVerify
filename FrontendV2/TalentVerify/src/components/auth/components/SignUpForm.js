import React, { useState } from 'react';
import {
  TextField,
  Button,
  Alert,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { EyeIcon, EyeOffIcon } from './PasswordIcons';
import { API_URL, domainList } from '../utils/constants';
import { validateEmail, formatDate } from '../utils/validation';

const SignUpForm = ({ onSignUpSuccess }) => {
  const [signUpForm, setSignUpForm] = useState({
    firstName: '', lastName: '', dateOfBirth: '', email: '',
    username: '', password: '', confirmPassword: '', userType: 'interviewee',
    organization: '', domains: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    
    try {
      const response = signUpForm.userType === 'employer'
        ? await axios.post(`${API_URL}/SignUpEmployer`, null, {
            params: {
              FirstName: signUpForm.firstName,
              LastName: signUpForm.lastName,
              DateOfBirth: formatDate(signUpForm.dateOfBirth),
              UserName: signUpForm.username,
              Password: signUpForm.password,
              Email: signUpForm.email,
              Organization: signUpForm.organization,
              PicFlag: 0
            }
          })
        : await axios.post(`${API_URL}/SignUpInterviewee`, null, {
            params: {
              FirstName: signUpForm.firstName,
              LastName: signUpForm.lastName,
              DateOfBirth: formatDate(signUpForm.dateOfBirth),
              UserName: signUpForm.username,
              Password: signUpForm.password,
              Email: signUpForm.email,
              PicFlag: 0
            }
          });
      
      setSuccess(response.data.message);
      onSignUpSuccess(response.data);
    } catch (error) {
      setError(error.response?.content?.message || 'Sign up failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSignUpSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={signUpForm.firstName}
            onChange={handleSignUpChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={signUpForm.lastName}
            onChange={handleSignUpChange}
            required
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        value={signUpForm.dateOfBirth}
        onChange={handleSignUpChange}
        margin="normal"
        required
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={signUpForm.email}
        onChange={handleSignUpChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Username"
        name="username"
        value={signUpForm.username}
        onChange={handleSignUpChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={signUpForm.password}
        onChange={handleSignUpChange}
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        value={signUpForm.confirmPassword}
        onChange={handleSignUpChange}
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge="end"
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <FormControl component="fieldset" margin="normal">
        <FormLabel component="legend">User Type</FormLabel>
        <RadioGroup
          name="userType"
          value={signUpForm.userType}
          onChange={handleSignUpChange}
        >
          <FormControlLabel value="interviewee" control={<Radio />} label="Interviewee" />
          <FormControlLabel value="employer" control={<Radio />} label="Employer" />
        </RadioGroup>
      </FormControl>

      {signUpForm.userType === 'employer' && (
        <TextField
          fullWidth
          label="Organization"
          name="organization"
          value={signUpForm.organization}
          onChange={handleSignUpChange}
          margin="normal"
          required
        />
      )}

      {signUpForm.userType === 'interviewee' && (
        <FormControl fullWidth margin="normal">
          <FormLabel>Domains</FormLabel>
          <Select
            multiple
            value={signUpForm.domains}
            onChange={handleDomainChange}
            input={<OutlinedInput label="Domains" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    onDelete={handleDeleteDomain(value)}
                  />
                ))}
              </Box>
            )}
          >
            {domainList.map((domain) => (
              <MenuItem key={domain} value={domain}>
                {domain}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 3 }}
      >
        Sign Up
      </Button>
    </form>
  );
};

export default SignUpForm; 