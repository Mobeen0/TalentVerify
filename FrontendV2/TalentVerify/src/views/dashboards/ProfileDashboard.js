import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Language as LanguageIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import axios from "axios";

const API_URL = 'http://localhost:8000';

const ProfileDashboard = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    userName: '',
    domains: []
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/GetIntervieweeInfo`, {
          params: {
            UserName: localStorage.getItem('userName')
          }
        });
        if (response.data) {
          setUserInfo({
            firstName: response.data.FirstName || '',
            lastName: response.data.LastName || '',
            email: response.data.Email || '',
            dateOfBirth: response.data.DateOfBirth || '',
            userName: response.data.UserName || '',
            domains: response.data.Domains ? response.data.Domains.split(',') : []
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 3 },
      backgroundColor: '#f8f9fa',
      minHeight: 'calc(100vh - 64px)',
      mt: '64px'
    }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#2c3e50' }}>
        Profile Information
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#ffffff'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  margin: '0 auto 16px',
                  border: '4px solid #f0f0f0'
                }}
                src="/path-to-profile-image.jpg"
              />
              <Typography variant="h5" gutterBottom>
                {userInfo.firstName} {userInfo.lastName}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Computer Science Student
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ mt: 2 }}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#ffffff',
            mt: 3
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={userInfo.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="+1 234 567 890" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="New York, USA" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Information */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#ffffff'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About Me
              </Typography>
              <Typography variant="body1" paragraph>
                Computer Science student with a passion for web development and software engineering.
                Currently pursuing my degree while actively seeking internship opportunities to gain
                practical experience in the field.
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {userInfo.domains.map((domain, index) => (
                  <Chip key={index} icon={<CodeIcon />} label={domain} />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                Education
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Bachelor of Science in Computer Science"
                    secondary="University of Technology, Expected Graduation: 2024"
                  />
                </ListItem>
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Projects
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Personal Portfolio Website"
                    secondary="Built using React and Material-UI, showcasing my projects and skills"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Student Management System"
                    secondary="A full-stack application developed as part of coursework"
                  />
                </ListItem>
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Languages
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip icon={<LanguageIcon />} label="English (Native)" />
                <Chip icon={<LanguageIcon />} label="Spanish (Intermediate)" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileDashboard; 