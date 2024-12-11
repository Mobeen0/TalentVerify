import React, { useState } from 'react';
import { TextField, Button, Box, Chip, InputAdornment, Grid } from '@mui/material';
import { Autocomplete } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TitleIcon from '@mui/icons-material/Title';
import BuildIcon from '@mui/icons-material/Build';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

import axios from 'axios'

function AddJobPosting({userName}) {
    const [skills, setSkills] = useState([]);
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const currentDateTime = new Date().toLocaleString(); // Get current date and time
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
      
        const jobSkills = skills.join(','); // Concatenate skills into a comma-separated string
        const requestBody = {
          Username: userName, // Replace this with a dynamic username as needed
          JobTitle: jobTitle,
          JobDescription: jobDescription,
          JobSkills: jobSkills
        };
      
        try {
          const response = await axios.post('http://localhost:8000/AddJobPosting', null,{params: requestBody});
      
          if (response.status === 200) {
            alert('Job posting added successfully!');
            setSkills([]);
            setJobDescription("")
            setJobTitle("")
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

  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-h-screen tw-bg-gray-100">
      <Box
        className="tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-md tw-w-full tw-max-w-lg"
        component="form"
        noValidate
        autoComplete="off"
      >
        <h1 className="tw-text-3xl tw-font-extrabold tw-mb-8 tw-flex tw-items-center tw-justify-center tw-text-gray-700 tw-gap-2">
            <WorkOutlineIcon className="tw-text-blue-500 tw-text-4xl" />
            Add Job Posting
        </h1>

        <Grid container spacing={3}>
          {/* Current Date and Time */}
          <Grid item xs={12}>
            <TextField
              label="Current Date and Time"
              value={currentDateTime}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <AccessTimeIcon className="tw-text-gray-500" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              fullWidth
              className="tw-bg-gray-50"
            />
          </Grid>

          {/* Job Title */}
          <Grid item xs={12}>
            <TextField
              label="Job Title"
              variant="outlined"
              fullWidth
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon className="tw-text-gray-500" />
                  </InputAdornment>
                ),
                className: 'tw-bg-gray-50',
              }}
              
            />
          </Grid>

          {/* Job Skills */}
          <Grid item xs={12}>
          <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={skills}
          onChange={(event, newValue) => {
            setSkills(newValue);
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
                key={index}
                className="tw-bg-gray-200"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Job Skills"
              placeholder="Add skills"
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                className: 'tw-bg-gray-50',
              }}
              className="tw-mb-4"
            />
          )}
        />
          </Grid>

          {/* Job Description */}
          <Grid item xs={12}>
            <TextField
              label="Job Description"
              variant="outlined"
              fullWidth
              multiline
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon className="tw-text-gray-500" />
                  </InputAdornment>
                ),
                className: 'tw-bg-gray-50',
              }}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="tw-bg-blue-500 tw-hover:bg-blue-600 tw-text-white tw-py-2 tw-font-semibold"
              disabled={loading}
              onClick = {handleSubmit}
            >
              {loading ? 'Posting...' : 'Post Job'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default AddJobPosting;
