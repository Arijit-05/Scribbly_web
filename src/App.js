import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Signup from './components/Signup';
import Notes from './components/Notes';
import './App.css';
import { useTheme } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#ff6f61',
      },
      secondary: {
        main: '#ffb3b3',
      },
      background: {
        default: darkMode ? '#18191A' : '#f5f5f5',
        paper: darkMode ? '#23272F' : '#fff',
        footer: darkMode ? '#23272F' : '#ffe5e0',
      },
    },
    typography: {
      fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif',
      h6: {
        textTransform: 'lowercase',
        fontWeight: 700,
        letterSpacing: 1,
      },
    },
  });

  const muiTheme = useTheme();
  const footerBg = darkMode ? '#18191A' : '#ffe5e0';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Navigation darkMode={darkMode} setDarkMode={setDarkMode} style={{ position: 'sticky', top: 0, zIndex: 1100 }} />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <Notes />
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          <footer style={{ width: '100%', minHeight: '80px', padding: '36px 0 24px 0', textAlign: 'center', fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif', fontStyle: 'italic', fontSize: '1.1rem', background: footerBg }}>
            <a
              href="https://arijit-05.github.io/website/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'underline', fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif', fontStyle: 'italic' }}
            >
              Made with ❤️ by Arijit
            </a>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 24 }}>
              <a href="https://github.com/arijit-05" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                <GitHubIcon fontSize="large" sx={{ transition: 'color 0.2s', '&:hover': { color: '#333' } }} />
              </a>
              <a href="https://www.linkedin.com/in/arijit-roy-adv05/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                <LinkedInIcon fontSize="large" sx={{ transition: 'color 0.2s', '&:hover': { color: '#0077b5' } }} />
              </a>
              <a href="https://instagram.com/x.arzzz_" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                <InstagramIcon fontSize="large" sx={{ transition: 'color 0.2s', '&:hover': { color: '#E1306C' } }} />
              </a>
            </div>
          </footer>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
