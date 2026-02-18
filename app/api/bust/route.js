import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Extract text inside the function
    const body = await request.json();
    const text = body.text;

    // 2. Validate text exists
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }
    
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn',
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          inputs: text, // 'text' is now correctly defined here
          parameters: { max_length: 100, min_length: 30 }
        }),
      }
    );

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Build Error Debug:", error);
    return NextResponse.json({ error: "AI logic failed" }, { status: 500 });
  }
}