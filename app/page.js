"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, AppBar, Toolbar, Switch, Paper } from '@mui/material';
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import './globals.css';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: isDarkMode
              ? 'linear-gradient(to bottom, black, darkgrey)'
              : 'linear-gradient(to bottom, lightgrey, white)',
            minHeight: '100vh',
            margin: 0,
          },
        },
      },
    },
  });

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 4 }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              FlashForge
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SignedOut>
                <Button color="inherit" href="/sign-in">Login</Button>
                <Button variant="outlined" sx={{ ml: 2 }} href="/sign-up">Sign Up</Button>
              </SignedOut>
              <SignedIn><UserButton /></SignedIn>
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  Dark Mode
                </Typography>
                <Switch checked={isDarkMode} onChange={handleThemeToggle} />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom>
          Prompt, Create, Learn.
          </Typography>
          <Typography variant="h5" component="p" color="textSecondary" gutterBottom>
          Flash Your Knowledge: Instant Cards from Any Prompt!
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button href='#' variant="contained" color="primary" size="large" sx={{ mx: 1 }}>
              Get Started
            </Button>
            <Button variant="outlined" color="primary" size="large" sx={{ mx: 1 }}>
              Pricing
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: 8 }}>
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
            Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: isDarkMode
                    ? 'linear-gradient(to bottom, #333, #222)'
                    : 'linear-gradient(to bottom, #ddd, #ccc)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    Easy to Use
                  </Typography>
                  <Typography color="textSecondary">
                    Simply input your text, and our tool will automatically generate flashcards for you.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: isDarkMode
                    ? 'linear-gradient(to bottom, #333, #222)'
                    : 'linear-gradient(to bottom, #ddd, #ccc)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    Customizable
                  </Typography>
                  <Typography color="textSecondary">
                    Customize your flashcards with colors, fonts, and layouts that suit your style.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: isDarkMode
                    ? 'linear-gradient(to bottom, #333, #222)'
                    : 'linear-gradient(to bottom, #ddd, #ccc)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Box textAlign="center">
                  <Typography variant="h6" gutterBottom>
                    Cloud Sync
                  </Typography>
                  <Typography color="textSecondary">
                    Access your flashcards from anywhere with automatic cloud syncing.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box textAlign="center" py={4} borderTop={1} borderColor="divider">
          <Typography variant="body2" color="textSecondary">
            © 2024 FlashForge. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
