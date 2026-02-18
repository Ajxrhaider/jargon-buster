"use client";
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBust = async () => {
    if (!input || loading) return;
    setLoading(true);
    setResult('');
    
    try {
      const res = await fetch('/api/bust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      const summary = Array.isArray(data) ? data[0]?.summary_text : data?.summary_text;
      setResult(summary || "Analysis complete, but no summary was generated.");
    } catch (err) {
      setResult("System Error: Unable to reach the intelligence core.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-xl z-10">
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden shadow-indigo-500/10">
          
          {/* Brand Header */}
          <header className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-center border-b border-white/10">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic flex items-center justify-center gap-2">
              <span className="bg-white text-indigo-700 px-2 rounded-lg not-italic shadow-lg">⚡</span>
              Jargon<span className="text-indigo-200 not-italic">Buster</span>
            </h1>
            <p className="text-indigo-100/60 text-[10px] font-bold tracking-[0.3em] mt-3 uppercase">
              Hizaki Labs · Neural Simplification
            </p>
          </header>

          <div className="p-8 space-y-6">
            {/* Input Area */}
            <div className="relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste complex corporate speak or technical jargon..."
                className="w-full bg-slate-950/40 border border-slate-700/50 rounded-2xl p-5 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all outline-none resize-none leading-relaxed"
                rows="5"
              />
            </div>

            {/* Bust Button */}
            <button
              onClick={handleBust}
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-lg tracking-widest transition-all active:scale-[0.97] flex items-center justify-center gap-3 shadow-xl 
                ${loading 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40'
                }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>ANALYZING...</span>
                </>
              ) : (
                "BUST THE JARGON"
              )}
            </button>

            {/* Result Display */}
            {result && (
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-3xl p-6 relative group">
                  <div className="absolute -top-3 left-6 bg-indigo-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest text-white shadow-lg">
                    Simplified Output
                  </div>
                  <p className="text-indigo-50 text-lg leading-relaxed font-medium italic">
                    "{result}"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Minimalist Footer */}
          <footer className="p-5 text-center border-t border-white/5 bg-black/20">
            <span className="text-slate-600 text-[9px] uppercase tracking-widest font-semibold">
              Proprietary AI Core v4.0 // Secure Connection
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}