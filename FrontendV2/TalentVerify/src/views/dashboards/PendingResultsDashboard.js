import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  Work as WorkIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Psychology as PsychologyIcon,
} from "@mui/icons-material";

const PendingResultsDashboard = () => {
  const pendingResults = [
    {
      id: 1,
      company: "Tech Solutions Inc.",
      position: "Frontend Developer Intern",
      interviewDate: "2024-03-15",
      status: "Technical Review",
      progress: 75,
      feedback: "Technical interview completed. AI analysis in progress.",
      skills: ["React", "JavaScript", "HTML/CSS"]
    },
    {
      id: 2,
      company: "Digital Innovations",
      position: "Software Engineering Intern",
      interviewDate: "2024-03-18",
      status: "AI Assessment",
      progress: 50,
      feedback: "Technical assessment completed. AI evaluation in progress.",
      skills: ["Java", "Spring Boot", "SQL"]
    },
    {
      id: 3,
      company: "Innovate Labs",
      position: "Full Stack Developer Intern",
      interviewDate: "2024-03-20",
      status: "Final Analysis",
      progress: 90,
      feedback: "All technical rounds completed. Final AI evaluation pending.",
      skills: ["Node.js", "React", "MongoDB"]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Technical Review":
        return "primary";
      case "AI Assessment":
        return "warning";
      case "Final Analysis":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Technical Review":
        return <PsychologyIcon />;
      case "AI Assessment":
        return <AccessTimeIcon />;
      case "Final Analysis":
        return <CheckCircleIcon />;
      default:
        return <AccessTimeIcon />;
    }
  };

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 64px)',
      mt: '64px'
    }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
        Pending Results
      </Typography>

      <Grid container spacing={3}>
        {pendingResults.map((result) => (
          <Grid item xs={12} key={result.id}>
            <Card sx={{ 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              backgroundColor: '#ffffff'
            }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="h6">
                        {result.position}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                      {result.company}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Interview Date: {result.interviewDate}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Chip
                          icon={getStatusIcon(result.status)}
                          label={result.status}
                          color={getStatusColor(result.status)}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          Progress: {result.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={result.progress}
                        sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: '#f8f9fa',
                      borderRadius: 2,
                      height: '100%'
                    }}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        Technical Skills Assessed
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {result.skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            sx={{ backgroundColor: 'primary.light', color: 'white' }}
                          />
                        ))}
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {result.feedback}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PendingResultsDashboard; 