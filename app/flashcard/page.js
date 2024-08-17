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
      if (!user) {
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, 'users', user.id);
      const userDocSnap = await getDocs(userDocRef);

      if (userDocSnap.exists()) {
        const flashcardsData = [];
        const collections = userDocSnap.data().flashcards || [];
        for (const collectionData of collections) {
          const colRef = collection(db, collectionData.name); 
          const cardSnapshots = await getDocs(colRef);
          cardSnapshots.forEach((card) => {
            flashcardsData.push(card.data());
          });
        }
        setFlashcards(flashcardsData);
      }
      setLoading(false);
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
        {flashcards.map((flashcard, index) => (
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
        ))}
      </Grid>
    </Container>
  );
}

