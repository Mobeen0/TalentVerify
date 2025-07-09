import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useTheme } from '../../../../src/context/ThemeContext';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

const options = ["Action", "Another Action", "Something else here"];

const activities = [
  {
    time: "09.50",
    color: "success.main",
    text: "Meeting with John",
  },
  {
    time: "09.46",
    color: "secondary.main",
    text: "Payment received from John Doe of $385.90",
  },
  {
    time: "09.47",
    color: "primary.main",
    text: "Project Meeting",
  },
  {
    time: "09.48",
    color: "warning.main",
    text: "New Sale recorded #ML-3467",
  },
  {
    time: "09.49",
    color: "error.main",
    text: "Payment was made of $64.95 to Michael Anderson",
  },
];

const DailyActivities = () => {
  const { isDarkMode } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Card
      variant="outlined"
      sx={{
        pb: 0,
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e0e0e0',
      }}
    >
      <CardContent
        sx={{
          pb: "0 !important",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: "h3.fontSize",
                marginBottom: "0",
                color: isDarkMode ? '#ffffff' : '#2c3e50',
              }}
              gutterBottom
            >
              Daily Activities
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "400",
                fontSize: "13px",
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
              }}
            >
              Overview of Years
            </Typography>
          </Box>
          <Box
            sx={{
              marginLeft: "auto",
            }}
          >
            <IconButton
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
              sx={{
                color: isDarkMode ? '#ffffff' : 'inherit',
              }}
            >
              <MoreVertOutlinedIcon />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: {
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                  color: isDarkMode ? '#ffffff' : 'inherit',
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === "Pyxis"}
                  onClick={handleClose}
                  sx={{
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
        <Timeline
          sx={{
            p: 0,
          }}
        >
          {activities.map((activity) => (
            <TimelineItem key={activity.time}>
              <TimelineOppositeContent
                sx={{
                  fontSize: "12px",
                  fontWeight: "700",
                  flex: "0",
                  color: isDarkMode ? '#ffffff' : 'inherit',
                }}
              >
                {activity.time}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  variant="outlined"
                  sx={{
                    borderColor: activity.color,
                  }}
                />
                <TimelineConnector sx={{ backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)' }} />
              </TimelineSeparator>
              <TimelineContent
                sx={{
                  fontSize: "14px",
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                }}
              >
                {activity.text}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};

export default DailyActivities;
