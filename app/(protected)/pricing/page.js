import {
  Container,
} from "@mui/material";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import Price from "./_components/price";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const page = () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <Container maxWidth="lg">
      {/* Features Section */}
      <Price userId={userId}/>
    </Container>
  );
};

export default page;
