'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Button, Container, Typography, Box, IconButton } from '@mui/material';
import { Home, ArrowBack } from '@mui/icons-material'; 

export default function FlashcardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/sign-in'); 
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>; 
  }

  const handleGenerateClick = () => {
    router.push('/generate');
  };

  const handleCreateClick = () => {
    router.push('/create');
  };

  const handleFlashcardsClick = () => {
    router.push('/flashcards');
  };

  const handleBackClick = () => {
    router.push('/'); // Navigates to the main page
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
          gap: 3,
          position: 'relative' 
        }}
      >
        <IconButton
          onClick={handleBackClick}
          sx={{
            position: 'absolute',
            top: 20,
            left: -430,
            backgroundColor: '#9a95c9',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#7a7bbf',
            },
          }}
        >
          <ArrowBack />
        </IconButton>
        <IconButton
          href='/flashcard'
          onClick={handleFlashcardsClick}
          sx={{
            position: 'absolute',
            top: 20,
            right: -430,
            backgroundColor: '#9a95c9',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#7a7bbf',
            },
          }}
        >
          <Home />
        </IconButton>
        <Typography variant="h4" component="div" gutterBottom>
          Welcome, {user.firstName}!
        </Typography>
        <Typography variant="h6" component="div" gutterBottom>
          What would you like to do?
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Button
            variant="contained"
            onClick={handleGenerateClick}
            size="large"
            sx={{
              width: 250,
              height: 100,
              borderRadius: 2, 
              backgroundImage: 'linear-gradient(to right, #9a95c9, #ccc)', 
              color: '#fff',
              boxShadow: '0px 4px 10px rgba(0,0,0,0.2)', 
              '&:hover': {
                backgroundImage: 'linear-gradient(to right, #7a7bbf, #bfbfdd)', 
                boxShadow: '0px 6px 15px rgba(0,0,0,0.3)', 
                transform: 'translateY(-4px)', 
              }
            }}
          >
            Generate Flashcards
          </Button>
          <Typography variant="h6" component="div">
            OR
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            size="large"
            sx={{
              width: 250,
              height: 100,
              borderRadius: 2, 
              backgroundImage: 'linear-gradient(to right, #9a95c9, #ccc)', 
              color: '#fff',
              boxShadow: '0px 4px 10px rgba(0,0,0,0.2)', 
              '&:hover': {
                backgroundImage: 'linear-gradient(to right, #7a7bbf, #bfbfdd)', 
                boxShadow: '0px 6px 15px rgba(0,0,0,0.3)', 
                transform: 'translateY(-4px)', 
              }
            }}
          >
            Create Flashcards
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
