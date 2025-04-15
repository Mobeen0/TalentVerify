import React from "react";
import { useNavigate } from 'react-router-dom';

import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material";

import userimg from "../../../assets/images/users/3.jpg";

const Header = (props) => {
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Profile menu
  const [anchorEl4, setAnchorEl4] = React.useState(null);

  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
    navigate("/")
  };

  // 5
  const [anchorEl5, setAnchorEl5] = React.useState(null);

  const handleClick5 = (event) => {
    setAnchorEl5(event.currentTarget);
  };

  const handleClose5 = () => {
    setAnchorEl5(null);
  };

  return (
    <AppBar
      sx={{
        backgroundColor: "#2c3e50", // A rich dark blue/slate color
        boxShadow: "0 4px 12px 0 rgba(0,0,0,0.1)",
        ...props.sx
      }}
      elevation={0}
      className={props.customClass}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: "64px" }}>
        {/* Left side - Menu icon */}
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={props.toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
            color: "#ecf0f1", // Light color for better contrast
          }}
        >
          <MenuOutlinedIcon width="20" height="20" />
        </IconButton>

        {/* Right side - User profile */}
        <Box 
          sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            marginLeft: "auto" 
          }}
        >
          <Divider 
            orientation="vertical" 
            flexItem 
            sx={{ 
              height: 28, 
              backgroundColor: "rgba(255,255,255,0.2)" 
            }} 
          />
          
          <Button
            aria-label="menu"
            color="inherit"
            aria-controls="profile-menu"
            aria-haspopup="true"
            onClick={handleClick4}
            sx={{
              borderRadius: "50px",
              padding: "4px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)"
              }
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar
                src={userimg}
                alt={userimg}
                sx={{
                  width: "36px",
                  height: "36px",
                  border: "2px solid #3498db", // Accent color for border
                }}
              />
            </Box>
          </Button>
          
          <Menu
            id="profile-menu"
            anchorEl={anchorEl4}
            keepMounted
            open={Boolean(anchorEl4)}
            onClose={handleClose4}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            sx={{
              "& .MuiMenu-paper": {
                width: "250px",
                borderRadius: "8px",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                right: 0,
                top: "70px !important",
              },
            }}
          >
            <MenuItem onClick={handleClose4} sx={{ padding: "10px 16px" }}>
              <Avatar
                src={userimg}
                sx={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid #3498db", // Match the accent color
                }}
              />
              <Box
                sx={{
                  ml: 2,
                  fontWeight: "500",
                }}
              >
                My account
              </Box>
            </MenuItem>
            <Divider sx={{ margin: "4px 0" }} />
            <MenuItem onClick={handleClose4} sx={{ padding: "10px 16px" }}>
              <ListItemIcon>
                <LogoutOutlinedIcon fontSize="small" sx={{ color: "#e74c3c" }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;