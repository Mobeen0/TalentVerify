import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, TextField, Box, Grid, Chip, Divider } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from 'axios';

function ViewAllPostings() {
  const [postings, setPostings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPostings, setFilteredPostings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from backend when component mounts
  useEffect(() => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching job postings:', error);
        setLoading(false);
      });
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

  // Function to get random pastel color for skill chips
  const getSkillColor = () => {
    const colors = [
      '#E1F5FE', '#E0F7FA', '#E0F2F1', '#E8F5E9', 
      '#F1F8E9', '#F9FBE7', '#FFF8E1', '#FFF3E0'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderSkillChips = (skills) => {
    return skills.split(',').map((skill, index) => (
      <Chip
        key={index}
        label={skill.trim()}
        size="small"
        icon={<LocalOfferIcon style={{ fontSize: 14 }} />}
        style={{ 
          margin: '0 4px 4px 0',
          backgroundColor: getSkillColor(),
          fontWeight: 500,
          color: '#2196f3'
        }}
      />
    ));
  };

  return (
    <Box className="tw-min-h-screen tw-bg-gradient-to-br tw-from-blue-50 tw-to-sky-100 tw-py-10 tw-px-4">
      <Box 
        className="tw-max-w-6xl tw-mx-auto tw-mb-10 tw-bg-white tw-rounded-xl tw-shadow-lg tw-overflow-hidden"
        sx={{ borderTop: '5px solid #2196f3' }}
      >
        <Box className="tw-p-6 tw-bg-white">
          <Box className="tw-flex tw-items-center tw-justify-center tw-mb-6">
            <WorkOutlineIcon className="tw-text-sky-500 tw-mr-3" fontSize="large" />
            <Typography variant="h4" className="tw-font-bold tw-text-gray-800">
              Discover Your Next Opportunity
            </Typography>
          </Box>
          
          <TextField
            label="Search by job title or skills"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&.Mui-focused fieldset': {
                  borderColor: '#2196f3',
                },
              },
            }}
          />
          
          <Box className="tw-mt-4 tw-flex tw-justify-between tw-items-center">
            <Typography variant="body2" className="tw-text-gray-600">
              {filteredPostings.length} {filteredPostings.length === 1 ? 'job' : 'jobs'} found
            </Typography>
          </Box>
        </Box>
      </Box>
      
      {loading ? (
        <Box className="tw-flex tw-justify-center tw-items-center tw-h-64">
          <Typography variant="h6" className="tw-text-gray-500">Loading job postings...</Typography>
        </Box>
      ) : filteredPostings.length === 0 ? (
        <Box className="tw-flex tw-justify-center tw-items-center tw-h-64 tw-bg-white tw-rounded-xl tw-shadow-md">
          <Typography variant="h6" className="tw-text-gray-500">No job postings found matching "{searchTerm}"</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPostings.map(posting => (
            <Grid item xs={12} sm={6} lg={4} key={posting.id}>
              <Card 
                className="tw-h-full tw-flex tw-flex-col tw-transition-all tw-duration-300 tw-rounded-xl tw-overflow-hidden"
                sx={{ 
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <Box className="tw-bg-gradient-to-r tw-from-sky-400 tw-to-blue-400 tw-py-4 tw-px-6">
                  <Typography variant="h6" className="tw-font-bold tw-text-white">
                    {posting.title}
                  </Typography>
                  <Box className="tw-flex tw-items-center tw-mt-1">
                    <CalendarTodayIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', mr: 0.5 }} />
                    <Typography variant="caption" className="tw-text-white tw-opacity-90">
                      Posted {new Date(posting.datePosted).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                
                <CardContent className="tw-flex-grow tw-flex tw-flex-col tw-justify-between">
                  <Box>
                    <Typography variant="body2" className="tw-text-gray-700 tw-mb-4 tw-leading-relaxed">
                      {posting.description}
                    </Typography>
                    
                    <Typography variant="subtitle2" className="tw-font-semibold tw-text-gray-700 tw-mb-2 tw-flex tw-items-center">
                      <LocalOfferIcon sx={{ fontSize: 16, mr: 0.5, color: '#2196f3' }} /> Skills Required:
                    </Typography>
                    <Box className="tw-mb-4">
                      {renderSkillChips(posting.skills)}
                    </Box>
                  </Box>
                  
                  <Button 
                  onClick={() => window.location.href = 'http://localhost:3000/#/dashboards/applyInterview'}
                    variant="contained" 
                    color="primary" 
                    startIcon={<BusinessCenterIcon />}
                    sx={{ 
                      borderRadius: '8px', 
                      fontWeight: 'bold',
                      textTransform: 'none',
                      py: 1.5,
                      background: 'linear-gradient(45deg, #03a9f4 30%, #4fc3f7 90%)',
                      boxShadow: '0 4px 6px rgba(3, 169, 244, 0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 10px rgba(3, 169, 244, 0.4)',
                      }
                    }}
                    fullWidth
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default ViewAllPostings;