'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, setDocs } from 'firebase/firestore';
import {  Container, Card, CardContent, Typography, Grid, Button, CardActionArea, Box } from '@mui/material';

import db from '../../firebase';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  
  // Get query parameter
  const searchParams = useSearchParams();
  const search = searchParams.get('id');

  useEffect(() => {
    async function getFlashcards() {
      if (!search || !user) return;
      
      const colRef = collection(doc(collection(db, 'users'), user.id), search);
      const docs = await getDocs(colRef);
      const flashcards = [];
      docs.forEach((doc) => {
        flashcards.push(doc.data());
      });
      setFlashcards(flashcards);
    }
    getFlashcards();
  }, [search, user]);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

 

  if(isLoaded|| isSignedIn) {
    return null
  }

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      {flashcards.map((flashcard, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            onClick={() => handleFlip(index)}
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                {flipped[index] ? flashcard.back : flashcard.front}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}