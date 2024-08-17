
'use client';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { collection, doc, getDocs } from 'firebase/firestore';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import db from '../../firebase';

export default function FlashcardsPage() {
  const { user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!user) return;
      try {
        const userDocRef = doc(collection(db, 'users'), user.id);
        const userDocSnap = await getDocs(collection(userDocRef, 'Created Flashcards'));
        const flashcardData = [];
        userDocSnap.forEach((doc) => {
          flashcardData.push(doc.data());
        });
        setFlashcards(flashcardData);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Your Flashcards
      </Typography>

      {loading ? (
        <Typography variant="h6">Loading...</Typography>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {flashcards.length > 0 ? (
            flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ minWidth: 275, mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{flashcard.front}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flashcard.back}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6">No flashcards available.</Typography>
          )}
        </Grid>
      )}
    </Container>
  );
}
