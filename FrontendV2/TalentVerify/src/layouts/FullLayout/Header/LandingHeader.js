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
      position="static" 
      elevation={0} 
      sx={{ 
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo */}
          <Box 
            sx={{ 
              flexGrow: { xs: 1, md: 0 }, 
              display: 'flex', 
              alignItems: 'center',
            }}
          >
            <LogoSVG />
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: '#333',
                      mx: 2,
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '1rem',
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
                    ml: 2,
                    backgroundColor: '#1E90FF',
                    color: 'white',
                    borderRadius: '50px',
                    px: 3,
                    py: 0.8,
                    textTransform: 'none',
                    fontSize: '1rem',
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
            </>
          )}

            {/* Mobile Navigation */}
            {isMobile && (
              <>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                  sx={{ color: '#333' }}
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
                  }}
                >
                  {navItems.map((item) => (
                    <MenuItem 
                      key={item.label} 
                      onClick={handleCloseNavMenu}
                      component={Link}
                      to={item.path}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                  <MenuItem 
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to="/contact"
                    sx={{
                      color: '#1E90FF',
                      fontWeight: 'bold'
                    }}
                  >
                    Contact
                  </MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
  );
};

export default LandingHeader;