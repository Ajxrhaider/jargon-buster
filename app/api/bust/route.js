import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    const response = await fetch(
      'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn',
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
    if (result.estimated_time || result.error?.includes("loading")) {
       return NextResponse.json([{ 
         summary_text: "System is warming up... Please try again in 10 seconds!" 
       }]);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Neural core timeout." }, { status: 500 });
  }
}