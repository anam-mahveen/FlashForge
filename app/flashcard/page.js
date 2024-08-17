'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc } from 'firebase/firestore';
import db from '../../firebase';
import styles from './create.css'; 
import { Container, Typography, Grid, Card, CircularProgress, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
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

        
        const flashcardsSetsColRef = collection(userDocRef, 'Created Flashcards 8');
        const flashcardsData = [];

        
        const flashcardsSetsSnapshot = await getDocs(flashcardsSetsColRef);

        if (flashcardsSetsSnapshot.empty) {
          console.log("No flashcard sets found.");
        }

        
        for (const flashcardSetDoc of flashcardsSetsSnapshot.docs) {
          const dateCollectionId = flashcardSetDoc.id;
          const dateCollectionRef = collection(userDocRef, 'Created Flashcards 8', dateCollectionId, '2024');
          
          
          const flashcardsSnapshot = await getDocs(dateCollectionRef);

          if (flashcardsSnapshot.empty) {
            console.log(`No flashcards found in date collection ${dateCollectionId}.`);
          }

          
          flashcardsSnapshot.forEach(doc => {
            flashcardsData.push(doc.data());
          });
        }

        setFlashcards(flashcardsData);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
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
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      <IconButton
        onClick={() => router.back()}
        sx={{
          position: 'absolute',
          left: 35,
          top: 20,
          backgroundColor: '#9a95c9',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#7a7bbf',
          },
          mb: 2
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
              <Card className={styles.cardContainer}>
                <div className={styles.cardInner}>
                  <div className={styles.cardFront}>
                    <Typography variant="h6">{flashcard.front}</Typography>
                  </div>
                  <div className={styles.cardBack}>
                    <Typography variant="h6">{flashcard.back}</Typography>
                  </div>
                </div>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6">No flashcards found.</Typography>
        )}
      </Grid>
    </Container>
  );
}
