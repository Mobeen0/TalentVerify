import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { Work, CalendarToday, Build } from '@mui/icons-material';

function EmployerPostings({ userName }) {
  const [postings, setPostings] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/ShowAllPostings?Username=${encodeURIComponent(userName)}`)
      .then(response => response.json())
      .then(data => {
        const postingsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          title: value.JobTitle,
          description: value.JobDescription,
          skills: value.JobSkills,
          datePosted: value.JobDate,
        }));
        setPostings(postingsArray);
      })
      .catch(error => console.error('Error fetching job postings:', error));
  }, [userName]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Your Job Postings
        </h2>
        
        {postings.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No job postings available
          </div>
        ) : (
          <Grid container spacing={4}>
            {postings.map(posting => (
              <Grid item xs={12} sm={6} md={4} key={posting.id}>
                <Card
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500"
                  sx={{
                    backgroundColor: '#ffffff',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Work className="text-blue-600" />
                      <Typography variant="h6" className="font-bold text-gray-800">
                        {posting.title}
                      </Typography>
                    </div>

                    <Typography
                      variant="body2"
                      className="text-gray-600 mb-4 line-clamp-3"
                    >
                      {posting.description}
                    </Typography>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Build className="text-gray-500 text-sm" />
                        <Typography
                          variant="caption"
                          className="text-gray-700"
                        >
                          Skills: {posting.skills}
                        </Typography>
                      </div>

                      <div className="flex items-center space-x-2">
                        <CalendarToday className="text-gray-500 text-sm" />
                        <Typography
                          variant="caption"
                          className="text-gray-700"
                        >
                          Posted: {new Date(posting.datePosted).toLocaleDateString()}
                        </Typography>
                      </div>
                    </div>

                    <Button
                      variant="contained"
                      color="primary"
                      className="w-full mt-4 py-2 rounded-lg"
                      sx={{
                        backgroundColor: '#2563eb',
                        '&:hover': {
                          backgroundColor: '#1d4ed8'
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
}

export default EmployerPostings;