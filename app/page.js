"use client";
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBust = async () => {
    setLoading(true);
    const res = await fetch('/api/bust', {
      method: 'POST',
      body: JSON.stringify({ text: input }),
    });
    const data = await res.json();
    const summary = Array.isArray(data) ? data[0]?.summary_text : data?.summary_text;
    setResult(summary || "Something went wrong.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-8 text-center">
          <h1 className="text-4xl font-black tracking-tighter italic">
            Jargon<span className="text-indigo-200">Buster</span>
          </h1>
        </div>

        <div className="p-8 space-y-6">
          <textarea
            className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-lg"
            placeholder="Paste that complex text..."
            rows="5"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={handleBust}
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-400 py-4 rounded-2xl font-bold text-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "✨ Processing..." : "Bust the Jargon"}
          </button>

          {result && (
            <div className="mt-6 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
              <p className="text-indigo-100 leading-relaxed italic">"{result}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}