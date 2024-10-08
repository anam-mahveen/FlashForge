'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import db from '../../firebase';
import { useRouter } from 'next/navigation';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!text) return;

    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setFlashcards(data);
      await saveFlashcards(data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFlashcards = async (flashcards) => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.id);
    const batch = writeBatch(db);

    const setName = `Flashcards ${new Date().toLocaleDateString()}`;
    const flashcardSetsRef = collection(userDocRef, 'flashcardSets');
    const newSetRef = doc(flashcardSetsRef, setName);

   
    batch.set(newSetRef, {
      name: setName,
      flashcardCount: flashcards.length,
      createdAt: new Date(),
    });

    
    const flashcardsColRef = collection(newSetRef, 'flashcards');
    flashcards.forEach((flashcard) => {
      const newDocRef = doc(flashcardsColRef);
      batch.set(newDocRef, flashcard);
    });

    await batch.commit();
  };

  return (
    <Container>
      <Box sx={{ mt: 4, position: 'relative', textAlign: 'center' }}>
        <IconButton
          onClick={() => router.back()}
          sx={{
            position: 'absolute',
            left: -145,
            top: -3,
            backgroundColor: '#9a95c9',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#7a7bbf',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text to generate flashcards"
          fullWidth
          multiline
          minRows={4}
          sx={{ mb: 2, '& input': { color: 'black' } }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: '#9a95c9', '&:hover': { backgroundColor: '#7a7bbf' } }}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate'}
        </Button>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ minWidth: 275, mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{flashcard.question}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flashcard.answer}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
