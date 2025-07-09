import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";

const PerformanceDashboard = () => {
  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 64px)',
      mt: '64px'
    }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
        Performance Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Overall Performance Score */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#ffffff'
          }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Overall Performance Score
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-flex', mt: 2 }}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-flex',
                    width: 120,
                    height: 120,
                  }}
                >
                  <LinearProgress
                    variant="determinate"
                    value={85}
                    sx={{ 
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      transform: 'rotate(-90deg)',
                      '& .MuiLinearProgress-bar': {
                        transform: 'rotate(90deg)',
                      }
                    }}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h4" component="div" color="primary">
                      85%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Performance */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#ffffff'
          }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Recent Performance
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Frontend Developer Interview"
                    secondary="Score: 92% - Excellent performance in React and JavaScript"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <StarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="System Design Interview"
                    secondary="Score: 85% - Good system architecture understanding"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <ErrorIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Problem Solving Interview"
                    secondary="Score: 75% - Needs improvement in algorithm complexity"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Skill Analysis */}
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#ffffff'
          }}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Skill Analysis
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Technical Skills"
                        secondary={
                          <Box sx={{ width: '100%', mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={90}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Problem Solving"
                        secondary={
                          <Box sx={{ width: '100%', mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={75}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Communication"
                        secondary={
                          <Box sx={{ width: '100%', mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={85}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="System Design"
                        secondary={
                          <Box sx={{ width: '100%', mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={80}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Code Quality"
                        secondary={
                          <Box sx={{ width: '100%', mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={88}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemIcon>
                        <TrendingUpIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Time Management"
                        secondary={
                          <Box sx={{ width: '100%', mt: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={82}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PerformanceDashboard; 