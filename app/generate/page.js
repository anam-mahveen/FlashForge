'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CardActionArea,
  Box,
  TextField,
  Modal,
} from '@mui/material';
import db from '../../firebase';
import { useRouter } from 'next/navigation';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!user) return;

    fetch('/api/generate', {
      method: 'POST',
      body: text,
    })
      .then((res) => res.json())
      .then((data) => setFlashcards(data));
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const saveFlashcards = async () => {
    if (!user){
        alert('Please enter a name for the flashcard collection')
        return
    } 

    
    
    const userdocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userdocRef);
  
    const newCollection = {
      name,
      flashcardCount: flashcards.length,  // Optionally store the number of flashcards
    };
  
    // Initialize Firestore batch
    const batch = writeBatch(db);
  
    if (docSnap.exists()) {
      // Check if a collection with the same name already exists
      if (docSnap.data().flashcards && docSnap.data().flashcards.find((f) => f.name === name)) {
        alert('Flashcard collection with the same name already exists');
        return;
      } else {
        // Add the new collection name to the flashcards list in the user's document
        const collections = docSnap.data().flashcards || [];
        collections.push(newCollection);
        batch.set(docRef, { flashcards: collections }, { merge: true });
  
        // Create a new collection under the user's document with the flashcards
        const colRef = collection(docRef, name);
        flashcards.forEach((flashcard) => {
          const newDocRef = doc(colRef);
          batch.set(newDocRef, flashcard);
        });
      }
    } else {
      // If the user document doesn't exist, create it with the first flashcard collection
      batch.set(docRef, { flashcards: [newCollection] });
  
      // Create the new flashcard collection
      const colRef = collection(docRef, name);
      flashcards.forEach((flashcard) => {
        const newDocRef = doc(colRef);
        batch.set(newDocRef, flashcard);
      });
    }
  
    // Commit the batch
    await batch.commit();
    router.push('/flashcards');
  };
  

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          sx={{input: {color:'white'}}}
        />
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={()=>handleSubmit(flashcards.name)}>
          Submit
        </Button>
        <Button variant="outlined" color="secondary" sx={{ mt: 2, ml: 2 }} onClick={() => setOpen(true)}>
          Add to Firebase
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
            borderRadius: '8px',
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
            sx={{ mt: 2 }}
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
