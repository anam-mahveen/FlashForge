'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc } from 'firebase/firestore';
import db from '../../firebase';
import styles from './create.css';
import { Container, Typography, Grid, Card, CircularProgress, IconButton, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFlashcards = async () => {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user || !user.id) {
        console.error("No user found or user ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.id);
        const flashcardSetsColRef = collection(userDocRef, 'flashcardSets');
        const flashcardsData = [];

        const flashcardSetsSnapshot = await getDocs(flashcardSetsColRef);

        if (flashcardSetsSnapshot.empty) {
          console.log("No flashcard sets found.");
        }

        for (const flashcardSetDoc of flashcardSetsSnapshot.docs) {
          const setName = flashcardSetDoc.id;
          const flashcardsColRef = collection(userDocRef, 'flashcardSets', setName);

          const flashcardsSnapshot = await getDocs(flashcardsColRef);

          if (flashcardsSnapshot.empty) {
            console.log(`No flashcards found in set ${setName}.`);
          }

          flashcardsSnapshot.forEach(doc => {
            flashcardsData.push(doc.data());
          });
        }

        setFlashcards(flashcardsData);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        setError("Error fetching flashcards. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  if (loading) {
    return (
      <Container className={styles.container}>
        <Typography variant="h4" gutterBottom>
          Loading Flashcards...
        </Typography>
        <CircularProgress size={60} sx={{ mt: 2 }} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={styles.container}>
        <Typography variant="h4" gutterBottom color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      <IconButton
        onClick={() => router.back()}
        sx={{
          position: 'absolute',
          left: 20,
          top: 20,
          backgroundColor: '#9a95c9',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#7a7bbf',
          },
          mb: 2,
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" gutterBottom className={styles.title}>
        My Flashcards
      </Typography>
      <Grid container spacing={2}>
        {flashcards.length > 0 ? (
          flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className={styles.cardContainer} sx={{ position: 'relative', overflow: 'hidden' }}>
                <Paper elevation={3} sx={{ borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className={styles.cardInner}>
                    <div className={styles.cardFront}>
                      <Typography variant="h6" align="center">{flashcard.front}</Typography>
                    </div>
                    <div className={styles.cardBack}>
                      <Typography variant="h6" align="center">{flashcard.back}</Typography>
                    </div>
                  </div>
                </Paper>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" align="center" sx={{ width: '100%' }}>
            No flashcards found.
          </Typography>
        )}
      </Grid>
    </Container>
  );
}
