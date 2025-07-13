import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton
} from '@mui/material';
import { Logout as LogoutIcon, DarkMode as DarkModeIcon, LightMode as LightModeIcon } from '@mui/icons-material';

export default function Navigation({ darkMode, setDarkMode }) {
  const { currentUser, currentUserData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          scribbly
        </Typography>
        {currentUser && (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">
              Welcome, {currentUserData?.name || currentUser.email}
            </Typography>
            <IconButton color="inherit" onClick={() => setDarkMode((prev) => !prev)}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{ ml: 1 }}
              aria-label="Logout"
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        )}
        {!currentUser && (
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
} 