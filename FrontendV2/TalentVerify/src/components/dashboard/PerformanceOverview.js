import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { People, EventAvailable, AssignmentTurnedIn, TrendingUp } from '@mui/icons-material';

const MetricCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          backgroundColor: `${color}.light`, 
          borderRadius: '50%', 
          p: 1, 
          mr: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const PerformanceOverview = () => {
  // Mock data - replace with actual data from your backend
  const metrics = [
    {
      title: 'Active Candidates',
      value: '24',
      icon: <People sx={{ color: 'primary.main' }} />,
      color: 'primary'
    },
    {
      title: 'Scheduled Interviews',
      value: '8',
      icon: <EventAvailable sx={{ color: 'success.main' }} />,
      color: 'success'
    },
    {
      title: 'Completed Interviews',
      value: '12',
      icon: <AssignmentTurnedIn sx={{ color: 'info.main' }} />,
      color: 'info'
    },
    {
      title: 'Hiring Rate',
      value: '65%',
      icon: <TrendingUp sx={{ color: 'warning.main' }} />,
      color: 'warning'
    }
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Performance Overview
      </Typography>
      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PerformanceOverview; 