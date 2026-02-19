import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a professional 'Jargon Buster'. Your job is to take complex corporate jargon and rewrite it into simple, clear, and punchy English that a 10-year-old could understand. Keep it brief and witty."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Groq Error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    // Extract the AI's reply from the Groq format
    const simplifiedText = data.choices[0]?.message?.content;

    return NextResponse.json({ summary_text: simplifiedText });
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Groq connection failed." }, { status: 500 });
  }
}