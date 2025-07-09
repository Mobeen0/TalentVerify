import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/constants';

export const useJobPosting = (userName) => {
  const [skills, setSkills] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [dateError, setDateError] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    const jobSkills = skills.join(',');
    
    let scheduledDateTime = null;
    if (scheduleDate && scheduleTime) {
      scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    } else {
      scheduledDateTime = new Date();
    }
    
    const requestBody = {
      Username: userName,
      JobTitle: jobTitle,
      JobDescription: jobDescription,
      JobSkills: jobSkills
    };
    
    try {
      const response = await axios.post(`${API_URL}/AddJobPosting`, null, {
        params: requestBody
      });
      
      if (response.status === 200) {
        alert('Job posting added successfully!');
        setSkills([]);
        setJobDescription("");
        setJobTitle("");
        return true;
      } else {
        console.error('Failed to add job posting:', response.statusText);
        alert('Failed to add job posting. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error while adding job posting:', error);
      alert('An error occurred. Please try again later.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (e) => {
    setScheduleTime(e.target.value);
    
    if (scheduleDate === today) {
      const now = new Date();
      const selectedTime = e.target.value.split(':');
      const selectedHour = parseInt(selectedTime[0]);
      const selectedMinute = parseInt(selectedTime[1]);
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      if (selectedHour < currentHour || 
         (selectedHour === currentHour && selectedMinute <= currentMinute)) {
        setDateError(true);
      } else {
        setDateError(false);
      }
    }
  };

  return {
    skills,
    setSkills,
    jobTitle,
    setJobTitle,
    jobDescription,
    setJobDescription,
    loading,
    scheduleDate,
    setScheduleDate,
    scheduleTime,
    setScheduleTime,
    dateError,
    setDateError,
    today,
    handleSubmit,
    handleTimeChange
  };
}; 