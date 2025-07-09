import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import StarIcon from '@mui/icons-material/Star';

const InterviewPerformance = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const performanceData = {
    totalInterviews: 12,
    successRate: 75,
    averageRating: 4.2,
    recentFeedback: [
      {
        company: 'Tech Corp',
        rating: 4.5,
        date: '2024-03-15',
        feedback: 'Excellent technical skills and communication',
      },
      {
        company: 'Innovate Inc',
        rating: 4.0,
        date: '2024-03-10',
        feedback: 'Strong problem-solving abilities',
      },
    ],
  };

  return (
    <Card sx={{ 
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '100%',
      backgroundColor: '#ffffff'
    }}>
      <CardContent>
        <Grid container spacing={3}>
          {/* Performance Metrics */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Interviews
              </Typography>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                {performanceData.totalInterviews}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 'bold' }}>
                {performanceData.successRate}%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Average Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h3" color="warning.main" sx={{ fontWeight: 'bold', mr: 1 }}>
                  {performanceData.averageRating}
                </Typography>
                <StarIcon sx={{ color: 'warning.main', fontSize: 32 }} />
              </Box>
            </Box>
          </Grid>

          {/* Recent Feedback Timeline */}
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Recent Feedback
              </Typography>
              <Timeline>
                {performanceData.recentFeedback.map((feedback, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      {index < performanceData.recentFeedback.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {feedback.company}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(feedback.date).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body1" sx={{ mr: 1 }}>
                            {feedback.feedback}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              {feedback.rating}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InterviewPerformance; 