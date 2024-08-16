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
  Modal,
  CircularProgress,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import db from '../../firebase';
import { useRouter } from 'next/navigation';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
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
    } catch (error) {
      console.error('Error generating flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFlashcards = async () => {
    if (!user) return;

    if (!name) {
      alert('Please enter a name for the flashcard collection');
      return;
    }

    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);

    const newCollection = {
      name,
      flashcardCount: flashcards.length,
    };

    const batch = writeBatch(db);

    if (docSnap.exists()) {
      const existingCollections = docSnap.data().flashcards || [];
      if (existingCollections.find((f) => f.name === name)) {
        alert('Flashcard collection with the same name already exists');
        return;
      } else {
        existingCollections.push(newCollection);
        batch.set(userDocRef, { flashcards: existingCollections }, { merge: true });

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard) => {
          const newDocRef = doc(colRef);
          batch.set(newDocRef, flashcard);
        });
      }
    } else {
      batch.set(userDocRef, { flashcards: [newCollection] });

      const colRef = collection(userDocRef, name);
      flashcards.forEach((flashcard) => {
        const newDocRef = doc(colRef);
        batch.set(newDocRef, flashcard);
      });
    }

    await batch.commit();
    router.push('/flashcards');
  };

  return (
    <Container>
      <Box sx={{ mt: 4, position: 'relative' }}>
        <IconButton
          onClick={() => router.back()}
          sx={{
            position: 'left',
            left: -160,
            top: -20,
            backgroundColor: '#9a95c9',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#7a7bbf',
            },
            margin: 1,
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
          sx={{ mr: 2, backgroundColor: '#9a95c9', '&:hover': { backgroundColor: '#7a7bbf' } }}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} /> : 'Generate'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ ml: 2 }}
          onClick={() => setOpen(true)}
        >
          Save to Firebase
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ ml: 2 }}
          onClick={() => router.push('/flashcards')}
        >
          View Flashcards
        </Button>
      </Box>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Save Flashcards
          </Typography>
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Collection Name"
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, backgroundColor: '#9a95c9', '&:hover': { backgroundColor: '#7a7bbf' } }}
            onClick={() => {
              saveFlashcards();
              setOpen(false);
            }}
          >
            Save to Firebase
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
