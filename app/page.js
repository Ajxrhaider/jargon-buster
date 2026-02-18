"use client";
import { useState } from 'react';

export default function JargonBuster() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBust = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch('/api/bust', {
        method: 'POST',
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      const summary = Array.isArray(data) ? data[0]?.summary_text : data?.summary_text;
      setOutput(summary || "Could not simplify this text.");
    } catch (err) {
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <header className="bg-indigo-600 p-6 text-center">
          <h1 className="text-3xl font-bold">⚡ Jargon <span className="text-indigo-200">Buster</span></h1>
          <p className="text-indigo-100 text-sm mt-1">Hizaki Labs Edition</p>
        </header>

        <div className="p-8 space-y-6">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            placeholder="Paste complex text here..."
            rows="6"
          />

          <button 
            onClick={handleBust}
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Thinking..." : "Bust the Jargon"}
          </button>

          {output && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6 relative animate-in fade-in slide-in-from-bottom-2">
              <span className="absolute -top-3 left-4 bg-indigo-500 text-[10px] font-bold px-2 py-1 rounded uppercase">Result</span>
              <p className="italic text-indigo-100">{output}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}