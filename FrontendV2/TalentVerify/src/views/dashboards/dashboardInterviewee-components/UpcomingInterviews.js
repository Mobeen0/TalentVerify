import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import PersonIcon from '@mui/icons-material/Person';

const UpcomingInterviews = () => {
  const interviews = [
    {
      company: 'Tech Solutions Inc.',
      position: 'Senior Developer',
      date: '2024-03-20',
      time: '10:00 AM',
      type: 'Technical',
      location: 'Virtual',
      interviewer: 'John Smith',
    },
    {
      company: 'Innovate Corp',
      position: 'Full Stack Developer',
      date: '2024-03-22',
      time: '2:30 PM',
      type: 'HR',
      location: 'Virtual',
      interviewer: 'Sarah Johnson',
    },
  ];

  const getStatusColor = (type) => {
    switch (type) {
      case 'Technical':
        return 'primary';
      case 'HR':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ 
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '100%',
      backgroundColor: '#ffffff'
    }}>
      <CardContent>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          Upcoming Interviews
        </Typography>
        <List>
          {interviews.map((interview, index) => (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  py: 2,
                }}
              >
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {interview.company}
                  </Typography>
                  <Chip
                    label={interview.type}
                    color={getStatusColor(interview.type)}
                    size="small"
                  />
                </Box>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {interview.position}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(interview.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {interview.time}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {interview.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      {interview.interviewer}
                    </Typography>
                  </Box>
                </Box>
              </ListItem>
              {index < interviews.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default UpcomingInterviews; 