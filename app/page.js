"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Copy, Check, Sparkles, BrainCircuit } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleBust = async () => {
    if (!input || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/bust', {
        method: 'POST',
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();
      const summary = Array.isArray(data) ? data[0]?.summary_text : data?.summary_text;
      setResult(summary || "Analysis failed.");
    } catch (err) {
      setResult("Error connecting to neural core.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 relative selection:bg-indigo-500/40">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10"
      >
        {/* Top Branding Bar */}
        <div className="bg-indigo-600 px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="relative z-10">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white flex items-center justify-center gap-3">
              <BrainCircuit className="text-indigo-200" size={32} />
              Jargon<span className="text-indigo-200 not-italic">Buster</span>
            </h1>
            <p className="text-indigo-100/60 text-[10px] font-bold tracking-[0.4em] uppercase mt-3">Hizaki Intelligence Lab</p>
          </div>
        </div>

        <div className="p-10 space-y-8">
          {/* Input Field */}
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-3xl p-6 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/40 transition-all outline-none text-lg min-h-[200px] shadow-inner"
              placeholder="Paste your complex text..."
            />
            <div className="absolute bottom-4 right-6 text-[10px] font-bold text-slate-700 uppercase tracking-widest">Input Layer 01</div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleBust}
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 py-5 rounded-2xl font-black text-xl tracking-widest text-white shadow-[0_10px_40px_rgba(99,102,241,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <span className="flex items-center gap-3"><Zap className="animate-spin" size={20} /> ANALYZING...</span>
            ) : (
              <>BUST THE JARGON <Sparkles size={20} className="group-hover:rotate-12 transition-transform" /></>
            )}
          </button>

          {/* Animated Result Card */}
          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="pt-4"
              >
                <div className="bg-gradient-to-br from-indigo-500/10 to-slate-900/20 border border-indigo-500/20 rounded-3xl p-8 relative">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-indigo-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Simplified Logic</span>
                    <button onClick={copyToClipboard} className="text-slate-500 hover:text-white transition-colors">
                      {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <p className="text-indigo-50 text-xl leading-relaxed italic font-medium">"{result}"</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <footer className="mt-10 text-slate-700 text-[9px] font-bold uppercase tracking-[0.5em] text-center">
        Proprietary Neural Engine // Secured via Hizaki Labs
      </footer>
    </div>
  );
}