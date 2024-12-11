import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, TextField, Box, Grid } from '@mui/material';
import { Autocomplete } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

function ViewAllPostings() {
  const [postings, setPostings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPostings, setFilteredPostings] = useState([]);

  // Fetch data from backend when component mounts
  useEffect(() => {
    axios.get(`http://localhost:8000/ViewAllPostings`)
      .then(response => {
        const postingsArray = Object.entries(response.data).map(([key, value]) => ({
          id: key,
          title: value.JobTitle,
          description: value.JobDescription,
          skills: value.JobSkills,
          datePosted: value.JobDate,
        }));
        setPostings(postingsArray);
        setFilteredPostings(postingsArray);
      })
      .catch(error => console.error('Error fetching job postings:', error));
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    if (query) {
      const filtered = postings.filter(posting =>
        posting.title.toLowerCase().includes(query) ||
        posting.skills.toLowerCase().includes(query)
      );
      setFilteredPostings(filtered);
    } else {
      setFilteredPostings(postings);
    }
  };

  return (
    <div className="tw-flex tw-justify-center tw-items-center tw-h-screen tw-bg-gray-100 tw-flex-col">
      <Box className="tw-bg-white tw-p-8 tw-rounded-lg tw-shadow-md tw-w-full tw-max-w-lg tw-mb-6">
        <h1 className="tw-text-3xl tw-font-extrabold tw-mb-6 tw-flex tw-items-center tw-justify-center tw-text-gray-700 tw-gap-2">
          <WorkOutlineIcon className="tw-text-blue-500 tw-text-4xl" />
          View Job Postings
        </h1>
        <TextField
          label="Search Postings"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <SearchIcon className="tw-text-gray-500" />
            ),
          }}
        />
      </Box>
      <Grid container spacing={3} className="tw-px-4">
        {filteredPostings.map(posting => (
          <Grid item xs={12} sm={6} md={4} lg={4} key={posting.id}>
            <Card className="tw-shadow-lg tw-rounded-lg tw-bg-white tw-border tw-border-gray-200">
              <CardContent>
                <Typography variant="h6" className="tw-font-semibold mb-2">
                  {posting.title}
                </Typography>
                <Typography variant="body2" className="tw-text-gray-700 mb-3">
                  {posting.description}
                </Typography>
                <Typography variant="caption" className="tw-text-gray-500 mb-2">
                  Skills Required: {posting.skills} <br />
                </Typography>
                <Typography variant="caption" className="tw-text-gray-500 mb-3">
                  Date Posted: {new Date(posting.datePosted).toLocaleDateString()}
                </Typography>
                
                <Button variant="contained" color="primary" className="tw-w-full tw-mt-2">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default ViewAllPostings;
