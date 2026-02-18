"use client";
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
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
      setResult(summary || "Something went wrong.");
    } catch (err) {
      setResult("Error: AI could not be reached.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex items-center justify-center p-6 selection:bg-indigo-500/30">
      {/* Glow Effect in Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-indigo-600/20 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative z-10">
        
        {/* Modern Header */}
        <header className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-8 text-center shadow-lg">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Jargon<span className="text-indigo-200 not-italic">Buster</span>
          </h1>
          <p className="text-indigo-100/80 text-xs font-bold tracking-[0.2em] mt-2 uppercase">
            Hizaki Intelligence Lab
          </p>
        </header>

        <div className="p-10 space-y-8">
          {/* Input Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 ml-1">Input Text</label>
            <textarea
              className="w-full bg-slate-950/50 border border-slate-700/50 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none text-lg leading-relaxed placeholder:text-slate-600"
              placeholder="Paste complex jargon here..."
              rows="5"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleBust}
            disabled={loading}
            className="group relative w-full bg-indigo-500 hover:bg-indigo-400 py-5 rounded-2xl font-black text-xl transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            <span className={loading ? 'opacity-0' : 'opacity-100'}>BUST THE JARGON</span>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </button>

          {/* Output Section */}
          {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-8 relative group">
                <span className="absolute -top-3 left-6 bg-indigo-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                  Simplified Result
                </span>
                <p className="text-indigo-100 text-lg leading-relaxed font-medium italic">
                  "{result}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="p-6 text-center border-t border-white/5 bg-slate-950/20">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest">
            v2.0.1 — Secure API Connection Active
          </p>
        </footer>
      </div>
    </div>
  );
}