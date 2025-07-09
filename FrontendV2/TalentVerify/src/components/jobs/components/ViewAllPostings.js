import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, TextField, Box, Grid, Chip, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

function ViewAllPostings() {
  const [postings, setPostings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPostings, setFilteredPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosting, setSelectedPosting] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  // Function to handle card click to expand
  const handleCardClick = (posting) => {
    setSelectedPosting(posting);
    setOpenDialog(true);
  };

  // Function to close the expanded view
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Function to render skill chips with improved styling
  const renderSkillChips = (skills) => {
    // Array of gradient backgrounds for skill chips
    const gradients = [
      'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
      'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
      'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
      'linear-gradient(135deg, #F1F8E9 0%, #DCEDC8 100%)',
      'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
      'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
      'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
    ];
    
    return skills.split(',').map((skill, index) => {
      const gradientIndex = index % gradients.length;
      
      return (
        <Chip
          key={index}
          label={skill.trim()}
          size="small"
          icon={<LocalOfferIcon style={{ fontSize: 14 }} />}
          style={{ 
            margin: '0 4px 4px 0',
            background: gradients[gradientIndex],
            fontWeight: 500,
            color: '#0277bd',
            border: '1px solid rgba(3, 169, 244, 0.1)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
          }}
          sx={{
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
            }
          }}
        />
      );
    });
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
                className="tw-h-full tw-flex tw-flex-col tw-rounded-xl tw-overflow-hidden"
                sx={{ 
                  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(3, 169, 244, 0.15), 0 10px 10px rgba(3, 169, 244, 0.1)',
                    '&::after': {
                      opacity: 1,
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'linear-gradient(90deg, #03a9f4, #4fc3f7, #81d4fa, #03a9f4)',
                    backgroundSize: '400% 400%',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    animation: 'shimmer 3s ease infinite',
                  },
                  '@keyframes shimmer': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' }
                  }
                }}
                onClick={() => handleCardClick(posting)}
              >
                <Box 
                  className="tw-bg-gradient-to-r tw-from-sky-500 tw-to-blue-500 tw-py-4 tw-px-6"
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                      opacity: 0.3,
                    }
                  }}
                >
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
                
                <CardContent 
                  className="tw-flex-grow tw-flex tw-flex-col tw-justify-between"
                  sx={{
                    p: 3,
                    '&:last-child': { pb: 3 },
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(240,249,255,0.4) 100%)',
                  }}
                >
                  <Box>
                    <Typography 
                      variant="body2" 
                      className="tw-text-gray-700 tw-mb-4 tw-leading-relaxed" 
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        position: 'relative',
                        pl: 1,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '3px',
                          borderRadius: '3px',
                          background: 'linear-gradient(to bottom, #03a9f4, rgba(3, 169, 244, 0.3))',
                        }
                      }}
                    >
                      {posting.description}
                    </Typography>
                    
                    <Typography 
                      variant="subtitle2" 
                      className="tw-font-semibold tw-text-gray-700 tw-mb-2 tw-flex tw-items-center"
                      sx={{
                        color: '#0d47a1',
                      }}
                    >
                      <LocalOfferIcon sx={{ fontSize: 16, mr: 0.5, color: '#2196f3' }} /> Skills Required:
                    </Typography>
                    <Box className="tw-mb-4">
                      {renderSkillChips(posting.skills)}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<ExpandMoreIcon />}
                      sx={{ 
                        borderRadius: '8px', 
                        fontWeight: 'bold',
                        textTransform: 'none',
                        py: 1,
                        mb: 1.5,
                        borderWidth: '1.5px',
                        '&:hover': {
                          borderWidth: '1.5px',
                          backgroundColor: 'rgba(33, 150, 243, 0.04)',
                        }
                      }}
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(posting);
                      }}
                    >
                      View Details
                    </Button>
                    
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = 'http://localhost:3000/#/dashboards/applyInterview';
                      }}
                      variant="contained" 
                      color="primary" 
                      startIcon={<BusinessCenterIcon />}
                      sx={{ 
                        borderRadius: '8px', 
                        fontWeight: 'bold',
                        textTransform: 'none',
                        py: 1.5,
                        background: 'linear-gradient(45deg, #0288d1 0%, #03a9f4 50%, #29b6f6 100%)',
                        boxShadow: '0 4px 10px rgba(3, 169, 244, 0.3)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          boxShadow: '0 6px 14px rgba(3, 169, 244, 0.4)',
                          transform: 'translateY(-2px)',
                          '&::after': {
                            transform: 'scaleX(1.5) translateX(100%)',
                          }
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                          transition: 'transform 0.6s ease',
                          transform: 'scaleX(1) translateX(0)',
                        }
                      }}
                      fullWidth
                    >
                      Start Interview
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Improved Dialog View */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
          }
        }}
      >
        {selectedPosting && (
          <>
            <Box sx={{ position: 'relative' }}>
              <Box 
                className="tw-bg-gradient-to-r tw-from-sky-500 tw-to-blue-600 tw-py-6 tw-px-8"
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                    opacity: 0.3,
                  }
                }}
              >
                <DialogTitle sx={{ p: 0, color: 'white', fontWeight: 'bold', fontSize: '1.75rem' }}>
                  {selectedPosting.title}
                </DialogTitle>
                <Box className="tw-flex tw-items-center tw-mt-1">
                  <CalendarTodayIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.9)', mr: 0.5 }} />
                  <Typography variant="subtitle2" sx={{ color: 'white', opacity: 0.9 }}>
                    Posted {new Date(selectedPosting.datePosted).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Button
                onClick={handleCloseDialog}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <CloseIcon />
              </Button>
            </Box>

            <DialogContent sx={{ px: 4, py: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600, 
                  color: '#0d47a1',
                  position: 'relative',
                  pl: 2,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '80%',
                    borderRadius: '4px',
                    backgroundColor: '#2196f3',
                  }
                }}
              >
                Job Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
                {selectedPosting.description}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 600, 
                  color: '#0d47a1',
                  position: 'relative',
                  pl: 2,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '80%',
                    borderRadius: '4px',
                    backgroundColor: '#2196f3',
                  }
                }}
              >
                Required Skills
              </Typography>
              <Box sx={{ mb: 3 }}>
                {renderSkillChips(selectedPosting.skills)}
              </Box>
              
              <Box 
                sx={{ 
                  mt: 4, 
                  p: 2, 
                  borderRadius: '8px', 
                  backgroundColor: 'rgba(3, 169, 244, 0.05)', 
                  border: '1px solid rgba(3, 169, 244, 0.1)' 
                }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0 }}>
                  This position is currently accepting applications. Start your interview process now to be considered.
                </Typography>
              </Box>
            </DialogContent>
            
            <DialogActions 
              sx={{ 
                px: 4, 
                pb: 4,
                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(240,249,255,0.2) 100%)',
              }}
            >
              <Button
                onClick={handleCloseDialog}
                color="inherit"
                sx={{ 
                  mr: 2,
                  borderRadius: '8px',
                  px: 3,
                  py: 1,
                  fontWeight: 'bold',
                  textTransform: 'none' 
                }}
              >
                Close
              </Button>
              <Button
                onClick={() => window.location.href = 'http://localhost:3000/#/dashboards/applyInterview'}
                variant="contained"
                color="primary"
                startIcon={<BusinessCenterIcon />}
                sx={{ 
                  borderRadius: '8px',
                  px: 3,
                  py: 1.5, 
                  fontWeight: 'bold',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #0288d1 0%, #03a9f4 50%, #29b6f6 100%)',
                  boxShadow: '0 4px 10px rgba(3, 169, 244, 0.3)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0 6px 14px rgba(3, 169, 244, 0.4)',
                    transform: 'translateY(-2px)',
                    '&::after': {
                      transform: 'scaleX(1.5) translateX(100%)',
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'transform 0.6s ease',
                    transform: 'scaleX(1) translateX(0)',
                  }
                }}
              >
                Start Interview Process
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default ViewAllPostings;