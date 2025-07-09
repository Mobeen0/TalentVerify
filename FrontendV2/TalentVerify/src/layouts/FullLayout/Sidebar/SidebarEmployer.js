import React, { useState, useEffect } from "react";
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
  Divider,
  Typography,
  Paper,
  styled
} from "@mui/material";
import { SidebarWidth } from "../../../assets/global/Theme-variable";
import LogoIcon from "../Logo/LogoIcon";
import Menuitems from "./dataEmployer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Create constants for collapsed sidebar width
const CollapsedWidth = 70;

// Styled components for better visuals
const StyledListItem = styled(ListItem)(({ theme, selected, collapsed }) => ({
  borderRadius: '10px',
  marginBottom: '8px',
  transition: 'all 0.3s ease',
  padding: collapsed ? '12px 8px' : '12px 16px',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    color: '#ffffff',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    '& .MuiListItemIcon-root': {
      color: '#ffffff',
    }
  },
  ...(selected && {
    color: '#ffffff',
    backgroundColor: `${theme.palette.primary.main}!important`,
    boxShadow: '0 4px 20px rgba(0, 156, 181, 0.3)',
    '& .MuiListItemIcon-root': {
      color: '#ffffff',
    }
  }),
}));

const StyledListItemText = styled(ListItemText)(({ collapsed }) => ({
  opacity: collapsed ? 0 : 1,
  transition: 'opacity 0.2s ease',
  margin: collapsed ? 0 : undefined,
  display: collapsed ? 'none' : 'block'
}));

const CollapseButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  borderRadius: '4px',
  padding: '4px',
  margin: '0 0 0 auto',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  minWidth: '30px',
  height: '30px',
}));

const SidebarContainer = styled(Box)(({ theme, collapsed }) => ({
  padding: collapsed ? theme.spacing(3, 1) : theme.spacing(3),
  height: 'calc(100vh - 40px)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  transition: 'all 0.3s ease',
});

const SidebarHeading = styled(Typography)(({ collapsed }) => ({
  fontSize: '18px',
  fontWeight: 600,
  marginTop: '10px',
  marginBottom: '5px',
  paddingLeft: collapsed ? '0' : '15px',
  textAlign: collapsed ? 'center' : 'left',
  color: '#5f6368',
  opacity: collapsed ? 0 : 1,
  height: collapsed ? 0 : 'auto',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
}));

const Sidebar = (props) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  // Handle menu item click
  const handleClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  // Toggle sidebar collapse
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Group menu items by category for better organization
  const categories = {
    "Main": Menuitems.filter(item => ['Dashboard', 'Home', 'Overview'].includes(item.title)),
    "Management": Menuitems.filter(item => !['Dashboard', 'Home', 'Overview'].includes(item.title))
  };

  const SidebarContent = (
    <SidebarContainer collapsed={collapsed}>

      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Link to="/">
          <LogoContainer sx={{ mb: 0 }}>
            <LogoIcon />
          </LogoContainer>
        </Link>
        
        <CollapseButton onClick={toggleCollapse} size="small">
          {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </CollapseButton>
      </Box>
      
      <Divider sx={{ my: 2, backgroundColor: 'rgba(0, 156, 180, 0.2)' }} />

      {/* Show category headers and menu items */}
      {Object.entries(categories).map(([category, items]) => (
        items.length > 0 && (
          <Box key={category}>
            <SidebarHeading variant="subtitle2" collapsed={collapsed}>
              {category}
            </SidebarHeading>
            
            <List>
              {items.map((item, index) => (
                <Tooltip 
                  key={item.title} 
                  title={collapsed ? item.title : ""}
                  placement="right"
                  arrow
                >
                  <StyledListItem
                    onClick={() => handleClick(index)}
                    component={NavLink}
                    to={item.href}
                    selected={pathDirect === item.href}
                    collapsed={collapsed}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: collapsed ? 'auto' : 40,
                        mr: collapsed ? 0 : 1,
                        justifyContent: collapsed ? 'center' : 'flex-start',
                      }}
                    >
                      <item.icon width="22" height="22" />
                    </ListItemIcon>
                    <StyledListItemText
                      primary={item.title}
                      collapsed={collapsed}
                    />
                  </StyledListItem>
                </Tooltip>
              ))}
            </List>
            
            {category !== Object.keys(categories).pop() && (
              <Divider sx={{ my: 2, backgroundColor: 'rgba(0, 156, 180, 0.1)' }} />
            )}
          </Box>
        )
      ))}
      
      {/* Add decorative element at bottom of sidebar */}
      <Box sx={{
        position: 'absolute',
        bottom: '20px',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'rgba(0, 156, 180, 0.08)',
            borderRadius: '10px',
            width: collapsed ? '40px' : '80%',
            height: '4px',
            transition: 'all 0.3s ease'
          }}
        />
      </Box>
    </SidebarContainer>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open={props.isSidebarOpen}
        variant="persistent"
        PaperProps={{
          sx: {
            width: collapsed ? CollapsedWidth : SidebarWidth,
            backgroundColor: '#f8fdff',
            borderRight: '1px solid rgba(0, 156, 180, 0.1)',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
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
          backgroundColor: '#f8fdff',
          borderRight: '1px solid rgba(0, 156, 180, 0.1)',
        },
      }}
      variant="temporary"
    >
      {SidebarContent}
    </Drawer>
  );
};

export default Sidebar;