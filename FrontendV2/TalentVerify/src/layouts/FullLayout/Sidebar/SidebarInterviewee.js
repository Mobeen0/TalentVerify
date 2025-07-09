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
  Typography,
  Collapse,
  Divider,
  styled
} from "@mui/material";
import { SidebarWidth } from "../../../assets/global/Theme-variable";
import LogoIcon from "../Logo/LogoIcon";
import Menuitems from "./dataInterviewee";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Styled components
const StyledListItem = styled(ListItem)(({ theme, selected, collapsed }) => ({
  borderRadius: '8px',
  marginBottom: '4px',
  transition: 'all 0.2s ease',
  padding: collapsed ? '8px 12px' : '8px 16px',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    }
  },
  ...(selected && {
    backgroundColor: `${theme.palette.primary.main}!important`,
    color: '#ffffff',
    '& .MuiListItemIcon-root': {
      color: '#ffffff',
    }
  }),
}));

const StyledSubListItem = styled(ListItem)(({ theme, selected }) => ({
  borderRadius: '6px',
  marginLeft: '16px',
  marginBottom: '2px',
  padding: '6px 16px',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(25, 118, 210, 0.08)',
  },
  ...(selected && {
    backgroundColor: 'rgba(25, 118, 210, 0.12)',
    color: theme.palette.primary.main,
  }),
}));

const CategoryHeader = styled(Typography)(({ theme, collapsed }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
  padding: '16px 16px 8px 16px',
  opacity: collapsed ? 0 : 1,
  display: collapsed ? 'none' : 'block',
}));

const Sidebar = (props) => {
  const [open, setOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const handleClick = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  // Group menu items by category
  const menuByCategory = Menuitems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const SidebarContent = (
    <Box sx={{ 
      height: "100vh", 
      display: 'flex', 
      flexDirection: 'column',
      background: 'white',
      color: '#1976d2',
      overflow: 'hidden',
      borderRadius: '0 16px 16px 0',
      boxShadow: '0 0 20px rgba(0,0,0,0.05)'
    }}>
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
                TalentVerify
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
          {minimized ? <ChevronLeftIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto', py: 2 }}>
        {Object.entries(menuByCategory).map(([category, items]) => (
          <Box key={category}>
            <CategoryHeader variant="overline" collapsed={minimized}>
              {category}
            </CategoryHeader>
            <List sx={{ px: 2 }}>
              {items.map((item, index) => {
                const isActive = pathDirect === item.href;
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = expandedItems[index];

                return (
                  <React.Fragment key={item.title}>
                    <Tooltip 
                      title={minimized ? item.title : ""} 
                      placement="right" 
                      arrow
                    >
                      <StyledListItem
                        onClick={() => hasSubItems ? handleClick(index) : null}
                        button={!hasSubItems}
                        component={hasSubItems ? 'div' : NavLink}
                        to={hasSubItems ? undefined : item.href}
                        selected={isActive}
                        collapsed={minimized}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: minimized ? 0 : 36,
                            mr: minimized ? 0 : 2,
                            justifyContent: minimized ? 'center' : 'flex-start',
                            color: isActive ? "white" : "#1976d2"
                          }}
                        >
                          <item.icon width="22" height="22" />
                        </ListItemIcon>
                        {!minimized && (
                          <>
                            <ListItemText 
                              primary={
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: isActive ? 600 : 500,
                                  }}
                                >
                                  {item.title}
                                </Typography>
                              } 
                            />
                            {hasSubItems && (
                              isExpanded ? <ExpandLess /> : <ExpandMore />
                            )}
                          </>
                        )}
                      </StyledListItem>
                    </Tooltip>

                    {hasSubItems && !minimized && (
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.subItems.map((subItem) => (
                            <StyledSubListItem
                              key={subItem.title}
                              button
                              component={NavLink}
                              to={subItem.href}
                              selected={pathDirect === subItem.href}
                            >
                              <ListItemText 
                                primary={
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      fontSize: '0.875rem',
                                      fontWeight: pathDirect === subItem.href ? 500 : 400,
                                    }}
                                  >
                                    {subItem.title}
                                  </Typography>
                                } 
                              />
                            </StyledSubListItem>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </React.Fragment>
                );
              })}
            </List>
            {category !== Object.keys(menuByCategory).pop() && (
              <Divider sx={{ my: 2, mx: 2, opacity: 0.1 }} />
            )}
          </Box>
        ))}
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
            © 2024 TalentVerify
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
            width: minimized ? 80 : SidebarWidth,
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
          width: SidebarWidth,
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