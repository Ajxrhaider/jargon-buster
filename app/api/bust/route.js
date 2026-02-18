import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!process.env.HF_TOKEN) {
      return NextResponse.json({ error: "API Token is missing from environment variables." }, { status: 500 });
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
          parameters: { 
            max_length: 100, 
            min_length: 10,
            do_sample: false 
          }
        }),
      }
    );

    const result = await response.json();

    // If Hugging Face returns an error (like "Model is loading")
    if (result.error) {
      return NextResponse.json({ summary_text: `AI Engine Notice: ${result.error}` });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Neural core timeout." }, { status: 500 });
  }
}
