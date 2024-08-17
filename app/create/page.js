'use client';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { collection, doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
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
  Grid,
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import db from '../../firebase';
import { useRouter } from 'next/navigation';
import './create.css'; 

export default function Create() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [numberOfCards, setNumberOfCards] = useState(6);
  const [flashcards, setFlashcards] = useState(Array(6).fill({ front: '', back: '' }));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (index, field, value) => {
    const newFlashcards = [...flashcards];
    newFlashcards[index][field] = value;
    setFlashcards(newFlashcards);
  };

  const handleSubmit = async () => {
    if (flashcards.some(flashcard => !flashcard.front || !flashcard.back)) return;

    setLoading(true);
    try {
      await saveFlashcards(flashcards);
      const nextIndex = currentIndex + 1;
      if (nextIndex < numberOfCards) {
        setCurrentIndex(nextIndex);
        setFlashcards(prevFlashcards => [
          ...prevFlashcards.slice(0, currentIndex + 1),
          { front: '', back: '' },
          ...prevFlashcards.slice(currentIndex + 2)
        ]);
      } else {
        setFlashcards(Array(numberOfCards).fill({ front: '', back: '' }));
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Error creating flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFlashcards = async (flashcards) => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.id);
    const docSnap = await getDoc(userDocRef);

    const batch = writeBatch(db);

    const newCollection = {
      name: `Created Flashcards ${new Date().toLocaleDateString()}`,
      flashcardCount: flashcards.length,
    };

    if (docSnap.exists()) {
      const existingCollections = docSnap.data().flashcards || [];
      existingCollections.push(newCollection);
      batch.set(userDocRef, { flashcards: existingCollections }, { merge: true });
    } else {
      batch.set(userDocRef, { flashcards: [newCollection] });
    }

    const colRef = collection(db, newCollection.name); 
    flashcards.forEach((flashcard) => {
      const newDocRef = doc(colRef);
      batch.set(newDocRef, flashcard);
    });

    await batch.commit();
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNumberOfCardsChange = (e) => {
    const newCount = Math.max(1, parseInt(e.target.value, 10));
    setNumberOfCards(newCount);
    setFlashcards(Array(newCount).fill({ front: '', back: '' }));
    setCurrentIndex(0);
  };

  return (
    <Container>
      <Box sx={{ mt: 4, position: 'relative', textAlign: 'center' }}>
        <IconButton
          onClick={() => router.back()}
          sx={{
            position: 'absolute',
            left: -150,
            top: 0,
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
          Create Flashcards
        </Typography>

        <TextField
          type="number"
          value={numberOfCards}
          onChange={handleNumberOfCardsChange}
          label="Number of Flashcards"
          fullWidth
          sx={{ mb: 2 }}
        />

        <Card sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          <CardContent>
            <Typography variant="h6">{`Flashcard ${currentIndex + 1}`}</Typography>
            <TextField
              value={flashcards[currentIndex].front}
              onChange={(e) => handleChange(currentIndex, 'front', e.target.value)}
              label="Front"
              fullWidth
              sx={{ mb: 1, '& input': { color: 'black' } }}
            />
            <TextField
              value={flashcards[currentIndex].back}
              onChange={(e) => handleChange(currentIndex, 'back', e.target.value)}
              label="Back"
              fullWidth
              sx={{ mb: 2, '& input': { color: 'black' } }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Tooltip title="Previous Flashcard">
                <IconButton
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Next Flashcard">
                <IconButton
                  onClick={handleNext}
                  disabled={currentIndex === flashcards.length - 1}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: '#9a95c9', '&:hover': { backgroundColor: '#7a7bbf' } }}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Flashcards'}
        </Button>
      </Box>
    </Container>
  );
}
