import React from "react";
import { Grid, Box, Typography, Card, CardContent } from "@mui/material";
import {
  InterviewPerformance,
  UpcomingInterviews,
  SkillProgress
} from "./dashboardInterviewee-components";

const DashboardInterviewee = () => {
  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 64px)',
      mt: '64px'
    }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
        Welcome back, John!
      </Typography>
      
      <Grid container spacing={3}>
        {/* Performance Overview */}
        <Grid item xs={12} lg={12}>
          <InterviewPerformance />
        </Grid>

        {/* Upcoming Interviews */}
        <Grid item xs={12} lg={8}>
          <UpcomingInterviews />
        </Grid>

        {/* Skill Progress */}
        <Grid item xs={12} lg={4}>
          <SkillProgress />
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#ffffff'
              }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Total Applications
                  </Typography>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                    12
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#ffffff'
              }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Interviews Completed
                  </Typography>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 'bold' }}>
                    8
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#ffffff'
              }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Pending Results
                  </Typography>
                  <Typography variant="h4" color="warning.main" sx={{ fontWeight: 'bold' }}>
                    3
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#ffffff'
              }}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Success Rate
                  </Typography>
                  <Typography variant="h4" color="info.main" sx={{ fontWeight: 'bold' }}>
                    75%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardInterviewee; 