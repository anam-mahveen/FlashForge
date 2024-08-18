"use client"
import React, {useEffect} from 'react'
import {
    Container,
    Typography,
    Button,
    Box,
    Grid,
    AppBar,
    Toolbar,
    Switch,
    Paper,
  } from "@mui/material";

import { checkooutOrder } from '@/app/actions/pricing.action';
  
const Price = ({userId}) => {
    let isDarkMode = true;

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
          console.log('Order placed! You will receive an email confirmation.');
        }
    
        if (query.get('canceled')) {
          console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
        }
      }, []);

      const onCheckout = async () => {
        const order = {
            buyerId: userId,
            price: "4.99",
            title: "FlashCards",
        }

        await checkooutOrder(order);
    }

  return (
    <div>
         <Box sx={{ py: 8 }} >
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
            Pricing
          </Typography>
          <Grid container justifyContent="center" spacing={4} sx={{ mt: 2 }} alignContent="center">
            <Grid item xs={8} sm={4}>
              <Paper
                elevation={3}
                onClick={onCheckout}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: isDarkMode
                    ? 'linear-gradient(to bottom, #222, #636b69)'
                    : 'linear-gradient(to bottom, #9a95c9, #ccc)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
                  },
                  cursor: 'pointer'
                }}
              >
                <Box textAlign="center"  >
                  <Typography variant="h6" gutterBottom>
                    Generate 150 cards per day
                  </Typography>
                  <Typography color="textSecondary">
                    starting at 4.99$
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
    </div>
  )
}

export default Price
