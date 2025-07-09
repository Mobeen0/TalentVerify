import React, { useState } from 'react';
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { EyeIcon, EyeOffIcon } from './PasswordIcons';
import { API_URL } from '../utils/constants';

const LoginForm = ({ onLoginSuccess }) => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
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
      onLoginSuccess(response.data);
    } catch (error) {
      setError(error.response?.data?.Message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleLoginSubmit}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <TextField
        fullWidth
        label="Username"
        name="username"
        value={loginForm.username}
        onChange={handleLoginChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={loginForm.password}
        onChange={handleLoginChange}
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

      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            color="primary"
          />
        }
        label="Remember me"
        sx={{ mt: 1 }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 3 }}
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm; 