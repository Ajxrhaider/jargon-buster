"use client";
import { useState } from 'react';
import { Sparkles, ArrowRight, Copy, Check, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      setResult(summary || "Analysis complete.");
    } catch (err) {
      setResult("System Error: Check API Connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto pt-20 px-6 pb-20">
        {/* Header Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase">
            <Zap size={12} fill="currentColor" /> AI Powered v2.0
          </div>
          <h1 className="text-5xl font-black tracking-tighter italic text-white">
            JARGON<span className="text-indigo-500 not-italic">BUSTER</span>
          </h1>
          <p className="text-slate-500 font-medium">Neural Simplification by Hizaki Intelligence Lab</p>
        </div>

        {/* Interface Card */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-2xl p-8 md:p-10 space-y-8">
          <div className="space-y-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-lg text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all outline-none resize-none min-h-[180px]"
              placeholder="Paste your complex jargon here..."
            />
          </div>

          <button
            onClick={handleBust}
            disabled={loading}
            className="w-full group bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg shadow-[0_0_30px_rgba(79,70,229,0.2)] active:scale-[0.98]"
          >
            {loading ? (
              <span className="animate-pulse">PROCESSING NEURONS...</span>
            ) : (
              <>
                BUST THE JARGON <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <AnimatePresence>
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mt-8 group"
              >
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-8">
                  <div className="flex justify-between items-start mb-4">
                    <span className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                      <Sparkles size={14} /> Simplified Logic
                    </span>
                    <button 
                      onClick={handleCopy}
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <p className="text-indigo-50 text-xl leading-relaxed italic font-medium">
                    {result}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-slate-600 text-[10px] font-bold tracking-[0.4em] uppercase">
            Hizaki Labs © 2026 // Edge Computing Active
          </p>
        </footer>
      </main>
    </div>
  );
}