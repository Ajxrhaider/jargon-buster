// app/api/bust/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { text } = await request.json();
  const HF_API_URL = 'https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn';

  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AI" }, { status: 500 });
  }
}