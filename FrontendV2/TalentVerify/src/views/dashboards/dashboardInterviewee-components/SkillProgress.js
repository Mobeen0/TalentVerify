import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Grid,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import BrushIcon from '@mui/icons-material/Brush';
import PsychologyIcon from '@mui/icons-material/Psychology';

const SkillProgress = () => {
  const skills = [
    {
      name: 'Technical Skills',
      progress: 85,
      icon: <CodeIcon />,
      color: '#1E90FF',
    },
    {
      name: 'Problem Solving',
      progress: 75,
      icon: <PsychologyIcon />,
      color: '#2ecc71',
    },
    {
      name: 'Communication',
      progress: 90,
      icon: <BrushIcon />,
      color: '#e74c3c',
    },
    {
      name: 'System Design',
      progress: 70,
      icon: <StorageIcon />,
      color: '#f1c40f',
    },
  ];

  return (
    <Card sx={{ 
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '100%',
      backgroundColor: '#ffffff'
    }}>
      <CardContent>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Skill Progress
        </Typography>
        <Grid container spacing={3}>
          {skills.map((skill, index) => (
            <Grid item xs={12} key={index}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: `${skill.color}15`,
                      color: skill.color,
                      mr: 2,
                    }}
                  >
                    {skill.icon}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {skill.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ flexGrow: 1, mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={skill.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: `${skill.color}15`,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: skill.color,
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {skill.progress}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SkillProgress; 