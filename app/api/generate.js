import { HfInference } from '@huggingface/inference';
import { NextResponse } from 'next/server';

// Initialize the client with the API key
const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

const systemPrompt = `You are a flashcard creator, take in text and create multiple flashcards from it. Make sure to create 5 flashcards.
Both front and back should be one sentence long. 
You should return in the following format : 
 [
    {
        front : 'front of the card,
        back : 'back of the car,
    }
]`

let lastPrompt = "";
// Define a function to perform the text generation request
async function getTextGeneration(userQuery) {
    try {
        const prompt = ``

        // Send the request to the Hugging Face API
        const response = await client.textGeneration({
            model: "mistralai/Mistral-Nemo-Instruct-2407",
            inputs: prompt,
            parameters: {
                max_length: 150,
                temperature: 0.7,
                top_k: 50,
            },
        });

        // Extract the assistant's response

        const generatedText = response.generated_text;
        const assistantResponse = generatedText.split("Assistant:")[1].trim().replace('"', '').replace('"', '') || "Can you please rephrase or clarify what you need help with?";
        
        lastPrompt = assistantResponse;
        return assistantResponse;
    } catch (error) {
        console.error('API Request failed:', error?.response?.data || error.message);
        throw error;
    }
}

// Define the API route handler
export async function POST(req) {
    try {
        // Extract user input from the request
        const data = await req.json();
        const userQuery = data.query || "";

        // Get the response from the assistant
        const assistantResponse = await getTextGeneration(userQuery);

        // Return the generated response
        return new NextResponse(JSON.stringify({ message: 'Response from the Assistant', data: { generated_text: assistantResponse } }), { status: 200 });
    } catch (error) {
        // Handle errors and return a 500 status
        return new NextResponse(JSON.stringify({ message: 'Error occurred', error: error.message }), { status: 500 });
    }


}