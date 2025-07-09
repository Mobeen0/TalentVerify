import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Container,
} from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

// Simplified logo to match screenshot
const LogoSVG = () => (
  <Box component={Link} to="/" sx={{ textDecoration: 'none' }}>
    <Box sx={{ 
      fontSize: '1.5rem', 
      fontWeight: 600, 
      color: '#1E90FF',
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1
    }}>
      TalentVerify
      <Box 
        sx={{ 
          height: '2px', 
          width: '100%', 
          bgcolor: '#1E90FF',
          borderRadius: '2px'
        }} 
      />
    </Box>
  </Box>
);

const navItems = [
  { label: 'About', path: '/about' },
  { label: 'Features', path: '/features' },
  { label: 'Blog', path: '/blog' },
];

const LandingHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        width: '100%',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Toolbar 
          disableGutters 
          sx={{ 
            py: 1,
            minHeight: '64px',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
            }}
          >
            <LogoSVG />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 1
            }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: '#2c3e50',
                    px: 2,
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#1E90FF',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                variant="contained"
                component={Link}
                to="/contact"
                sx={{
                  ml: 1,
                  backgroundColor: '#1E90FF',
                  color: 'white',
                  borderRadius: '50px',
                  px: 3,
                  py: 0.8,
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#0d8aff',
                    boxShadow: 'none'
                  }
                }}
              >
                Contact
              </Button>
            </Box>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                sx={{ 
                  color: '#2c3e50',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiMenu-paper': {
                    width: '200px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    mt: 1
                  }
                }}
              >
                {navItems.map((item) => (
                  <MenuItem 
                    key={item.label} 
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to={item.path}
                    sx={{
                      py: 1.5,
                      color: '#2c3e50',
                      '&:hover': {
                        backgroundColor: 'rgba(30,144,255,0.08)',
                        color: '#1E90FF'
                      }
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                <MenuItem 
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to="/contact"
                  sx={{
                    py: 1.5,
                    color: '#1E90FF',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(30,144,255,0.08)'
                    }
                  }}
                >
                  Contact
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default LandingHeader;