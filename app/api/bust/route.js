import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    // Safety check for the token
    if (!process.env.HF_TOKEN) {
      return NextResponse.json({ error: "HF_TOKEN is missing" }, { status: 500 });
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          inputs: text,
          parameters: { max_length: 100, min_length: 30 }
        }),
      }
    );

    const result = await response.json();

    // If the model is currently loading, HF returns an 'estimated_time'
    if (result.estimated_time) {
       return NextResponse.json([{ summary_text: "Neural core is warming up... try again in 30 seconds." }]);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "AI logic failed" }, { status: 500 });
  }
}