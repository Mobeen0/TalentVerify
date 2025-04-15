import React, { useState } from "react";
import { useLocation } from "react-router";
import { Link, NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { SidebarWidth } from "../../../assets/global/Theme-variable";
import LogoIcon from "../Logo/LogoIcon";
import Menuitems from "./dataInterviewee";

const Sidebar = (props) => {
  const [open, setOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const handleClick = (index) => {
    if (open === index) {
      setOpen((prevopen) => !prevopen);
    } else {
      setOpen(index);
    }
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  const minimizedWidth = 80; // Width when sidebar is minimized

  const SidebarContent = (
    <Box 
      sx={{ 
        height: "100vh", 
        display: 'flex', 
        flexDirection: 'column',
        background: 'white',
        color: '#1976d2',
        overflow: 'hidden',
        borderRadius: '0 16px 16px 0',
        boxShadow: '0 0 20px rgba(0,0,0,0.05)'
      }}
    >
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        p: 3,
        pb: 2,
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        {!minimized && (
          <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LogoIcon />
              <Typography 
                variant="h6" 
                sx={{ 
                  ml: 1, 
                  fontWeight: 600,
                  fontSize: '1.3rem',
                  color: '#1976d2'
                }}
              >
              </Typography>
            </Box>
          </Link>
        )}
        <IconButton 
          onClick={toggleMinimize} 
          sx={{ 
            ml: minimized ? 0 : 2,
            color: '#1976d2',
            bgcolor: 'rgba(25, 118, 210, 0.05)',
            width: 36,
            height: 36,
            '&:hover': {
              bgcolor: 'rgba(25, 118, 210, 0.1)',
            }
          }}
          size="small"
        >
          {minimized ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto', mt: 2 }}>
        <List sx={{ px: 2 }}>
          {Menuitems.map((item, index) => {
            const isActive = pathDirect === item.href;
            
            return (
              <Tooltip 
                title={minimized ? item.title : ""} 
                placement="right" 
                key={item.title}
                arrow
              >
                <ListItem
                  onClick={() => handleClick(index)}
                  button
                  component={NavLink}
                  to={item.href}
                  selected={isActive}
                  sx={{
                    mb: 1.5,
                    borderRadius: '8px',
                    px: 2,
                    justifyContent: minimized ? 'center' : 'flex-start',
                    py: 1.5,
                    transition: 'all 0.2s ease',
                    ...(isActive ? {
                      color: "white",
                      backgroundColor: "#1976d2 !important",
                      fontWeight: 500
                    } : {
                      color: "#1976d2",
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)'
                      }
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: minimized ? 0 : 36,
                      mr: minimized ? 0 : 3,
                      justifyContent: minimized ? 'center' : 'flex-start',
                      color: isActive ? "white" : "#1976d2"
                    }}
                  >
                    <item.icon width="24" height="24" />
                  </ListItemIcon>
                  
                  {!minimized && (
                    <ListItemText 
                      primary={
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: isActive ? 600 : 500,
                            fontSize: '1rem'
                          }}
                        >
                          {item.title}
                        </Typography>
                      } 
                    />
                  )}
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
      </Box>
      
      {!minimized && (
        <Box 
          sx={{ 
            py: 2, 
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#6b7280', 
              textAlign: 'center',
              fontSize: '0.75rem'
            }}
          >
            © 2025 TalentVerify
          </Typography>
        </Box>
      )}
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={props.isSidebarOpen}
        variant="persistent"
        PaperProps={{
          sx: {
            width: minimized ? minimizedWidth : SidebarWidth,
            transition: "width 0.3s ease",
            border: 'none',
            overflow: 'visible'
          },
        }}
      >
        {SidebarContent}
      </Drawer>
    );
  }
  return (
    <Drawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      PaperProps={{
        sx: {
          width: minimized ? minimizedWidth : SidebarWidth,
          transition: "width 0.3s ease",
          border: 'none',
          overflow: 'visible'
        },
      }}
      variant="temporary"
    >
      {SidebarContent}
    </Drawer>
  );
};

export default Sidebar;