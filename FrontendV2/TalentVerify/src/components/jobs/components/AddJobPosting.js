import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Chip, 
  InputAdornment, 
  Grid, 
  Typography, 
  Paper,
  Autocomplete,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

function AddJobPosting({ userName }) {
  const [skills, setSkills] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  // Schedule date and time state
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [dateError, setDateError] = useState(false);
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    const jobSkills = skills.join(',');
    
    // Create a proper date object from the selected date and time
    let scheduledDateTime = null;
    if (scheduleDate && scheduleTime) {
      scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    } else {
      scheduledDateTime = new Date(); // Use current date/time if not specified
    }
    
    const requestBody = {
      Username: userName,
      JobTitle: jobTitle,
      JobDescription: jobDescription,
      JobSkills: jobSkills
      //ScheduledDate: scheduledDateTime.toISOString() // Include the scheduled date in the request
    };
    
    try {
      const response = await axios.post('http://localhost:8000/AddJobPosting', null, {
        params: requestBody
      });
      
      if (response.status === 200) {
        alert('Job posting added successfully!');
        setSkills([]);
        setJobDescription("");
        setJobTitle("");
      } else {
        console.error('Failed to add job posting:', response.statusText);
        alert('Failed to add job posting. Please try again.');
      }
    } catch (error) {
      console.error('Error while adding job posting:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Suggested skills for autocomplete
  const suggestedSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL',
    'HTML', 'CSS', 'TypeScript', 'AWS', 'Docker', 'Kubernetes',
    'Git', 'REST API', 'GraphQL', 'MongoDB', 'Redux', 'Vue.js'
  ];

  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-min-h-screen tw-bg-gradient-to-br tw-from-blue-50 tw-to-indigo-100 tw-py-10">
      <Paper
        elevation={6}
        className="tw-bg-white tw-rounded-xl tw-shadow-xl tw-w-full tw-max-w-2xl tw-mx-4"
      >
        <Box className="tw-p-8">
          {/* Header */}
          <Box className="tw-mb-8 tw-text-center">
            <Box className="tw-flex tw-justify-center tw-mb-4">
              <div className="tw-bg-blue-100 tw-p-3 tw-rounded-full">
                <WorkOutlineIcon className="tw-text-blue-600 tw-text-4xl" />
              </div>
            </Box>
            <Typography variant="h4" component="h1" className="tw-font-bold tw-text-gray-800">
              Create Job Posting
            </Typography>
            <Typography variant="body2" className="tw-text-gray-500 tw-mt-2">
              Fill out the form below to create a new job opportunity
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Current User */}
              <Grid item xs={12}>
                <TextField
                  label="Posting as"
                  value={userName || "Current User"}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon className="tw-text-blue-500" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                  className="tw-bg-gray-50"
                />
              </Grid>

              {/* Schedule Date */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Schedule Date"
                  type="date"
                  fullWidth
                  required
                  value={scheduleDate}
                  onChange={(e) => {
                    setScheduleDate(e.target.value);
                    setDateError(false);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon className="tw-text-blue-500" />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    min: today
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="tw-bg-white"
                  helperText="When should this job posting go live?"
                />
              </Grid>
              
              {/* Schedule Time */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Schedule Time"
                  type="time"
                  fullWidth
                  required
                  value={scheduleTime}
                  onChange={(e) => {
                    setScheduleTime(e.target.value);
                    
                    // Validate that if today is selected, the time is in the future
                    if (scheduleDate === today) {
                      const now = new Date();
                      const selectedTime = e.target.value.split(':');
                      const selectedHour = parseInt(selectedTime[0]);
                      const selectedMinute = parseInt(selectedTime[1]);
                      const currentHour = now.getHours();
                      const currentMinute = now.getMinutes();
                      
                      if (selectedHour < currentHour || 
                         (selectedHour === currentHour && selectedMinute <= currentMinute)) {
                        setDateError(true);
                      } else {
                        setDateError(false);
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon className="tw-text-blue-500" />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    step: 300 // 5 minutes (300 seconds)
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  className="tw-bg-white"
                  helperText={dateError ? "Please select a future time" : "Time (24-hour format)"}
                  error={dateError}
                />
              </Grid>

              {/* Job Title */}
              <Grid item xs={12}>
                <TextField
                  label="Job Title"
                  placeholder="e.g. Senior React Developer"
                  variant="outlined"
                  fullWidth
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleIcon className="tw-text-blue-500" />
                      </InputAdornment>
                    ),
                    className: 'tw-bg-white',
                  }}
                />
              </Grid>

              {/* Job Skills */}
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  options={suggestedSkills}
                  value={skills}
                  onChange={(event, newValue) => {
                    setSkills(newValue);
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="filled"
                        label={option}
                        {...getTagProps({ index })}
                        key={index}
                        className="tw-bg-blue-100 tw-text-blue-700 tw-font-medium"
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Required Skills"
                      placeholder="Add skills and press Enter"
                      variant="outlined"
                      required
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <InputAdornment position="start">
                              <LocalOfferIcon className="tw-text-blue-500" />
                            </InputAdornment>
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                <Typography variant="caption" className="tw-text-gray-500 tw-mt-1 tw-ml-2">
                  Type a skill and press Enter to add it to the list
                </Typography>
              </Grid>

              {/* Job Description */}
              <Grid item xs={12}>
                <TextField
                  label="Job Description"
                  placeholder="Provide a detailed description of the job role, responsibilities, and requirements..."
                  variant="outlined"
                  fullWidth
                  multiline
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={6}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" className="tw-mt-3">
                        <DescriptionIcon className="tw-text-blue-500" />
                      </InputAdornment>
                    ),
                    className: 'tw-bg-white tw-pt-6',
                  }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || !jobTitle || !jobDescription || skills.length === 0 || dateError || !scheduleDate || !scheduleTime}
                  onClick={handleSubmit}
                  className="tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-py-3 tw-font-medium tw-text-lg tw-rounded-lg tw-mt-4"
                  disableElevation
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} className="tw-mr-2 tw-text-white" />
                      Posting Job...
                    </>
                  ) : (
                    'Post Job Opportunity'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
    </div>
  );
}

export default AddJobPosting;