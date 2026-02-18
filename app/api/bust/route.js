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
          parameters: { 
            max_length: 100, 
            min_length: 30,
            do_sample: false 
          }
        }),
      }
    );

    const result = await response.json();

    // Handle the "Model is loading" estimated time response
    if (result.estimated_time) {
      return NextResponse.json({ 
        summary_text: "System warming up... Please try again in 20 seconds." 
      });
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Neural core timeout." }, { status: 500 });
  }
}