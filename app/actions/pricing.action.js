"use server"
import { redirect } from "next/navigation";
import Stripe from "stripe";

export const checkooutOrder = async (order) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const price = Number(order.price) * 100;
    try {
        // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
                currency: 'usd',
                unit_amount: price,
                product_data: {
                    name: order.title
                }
            },
            quantity: 1

          },
        ],
        metadata: {
            buyerId: order.buyerId
        },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/pricing`,
      });
      redirect(session.url);
    } catch (error) {
        throw error;
    }
}