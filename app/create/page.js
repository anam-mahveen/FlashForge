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
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
  const [openDialog, setOpenDialog] = useState(false);
  const [setName, setSetName] = useState('');
  const router = useRouter();

  const handleChange = (index, field, value) => {
    const newFlashcards = flashcards.map((flashcard, i) =>
      i === index ? { ...flashcard, [field]: value } : flashcard
    );
    setFlashcards(newFlashcards);
  };

  const handleSubmit = async () => {
    if (flashcards.some(flashcard => !flashcard.front || !flashcard.back)) return;

    setOpenDialog(true);
  };

  const handleSetNameChange = (e) => {
    setSetName(e.target.value);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveSet = async () => {
    if (!setName.trim()) return;

    setLoading(true);
    try {
      await saveFlashcards(flashcards, setName);
      setFlashcards(Array(numberOfCards).fill({ front: '', back: '' }));
      setCurrentIndex(0);
      setSetName('');
      setOpenDialog(false);
    } catch (error) {
      console.error('Error creating flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFlashcards = async (flashcards, setName) => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.id);
    const docSnap = await getDoc(userDocRef);

    const batch = writeBatch(db);

    const newCollection = {
      name: setName,
      flashcardCount: flashcards.length,
      createdAt: new Date().toISOString(),
    };

    if (docSnap.exists()) {
      const existingCollections = docSnap.data().flashcards || [];
      existingCollections.push(newCollection);
      batch.set(userDocRef, { flashcards: existingCollections }, { merge: true });
    } else {
      batch.set(userDocRef, { flashcards: [newCollection] });
    }

    const colRef = collection(db, 'flashcards', user.id, setName);
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

        <Grid container spacing={2} justifyContent="center" sx={{ mt: 6 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
                <CardContent>
                  <Typography variant="h6">{`Flashcard ${index + 1}`}</Typography>
                  <TextField
                    value={flashcard.front}
                    onChange={(e) => handleChange(index, 'front', e.target.value)}
                    label="Front"
                    fullWidth
                    sx={{ mb: 1, '& input': { color: 'black' } }}
                  />
                  <TextField
                    value={flashcard.back}
                    onChange={(e) => handleChange(index, 'back', e.target.value)}
                    label="Back"
                    fullWidth
                    sx={{ mb: 2, '& input': { color: 'black' } }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: '#9a95c9', '&:hover': { backgroundColor: '#7a7bbf' } }}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Flashcards'}
        </Button>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{
            style: {
              borderRadius: '20px', 
              width: '500px', 
              backgroundColor: '#f5f5f5', 
            },
          }}
        >
          <DialogTitle
            sx={{ backgroundColor: '#9a95c9', color: '#fff', borderRadius: '20px 20px 0 0' }}
          >
            Enter Flashcard Set Name
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Set Name"
              type="text"
              fullWidth
              variant="standard"
              value={setName}
              onChange={handleSetNameChange}
              InputProps={{ style: { color: 'black' } }}
              InputLabelProps={{ style: { color: 'black' } }}
            />
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ color: '#9a95c9' }}>Cancel</Button>
            <Button
              onClick={handleSaveSet}
              sx={{ backgroundColor: '#9a95c9', color: '#fff', '&:hover': { backgroundColor: '#7a7bbf' } }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
