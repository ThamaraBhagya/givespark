"use client";

import { useState } from 'react';
import { Loader2, Wand2, Sparkles } from 'lucide-react';

interface CampaignStoryAIProps {
  title: string;
  category: string;
  description: string;
  story: string;
  setStory: (story: string) => void;
}

export default function CampaignStoryAI({ 
  title, 
  category, 
  description, 
  story, 
  setStory 
}: CampaignStoryAIProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const generateWithAI = async () => {
    if (!title || !description) {
      alert("Please provide a Title and a Brief Description first so Spark AI has context!");
      return;
    }

    setIsGenerating(true);
    setStatusMessage("Spark AI is igniting your story...");
    
    
   
    const timer = setTimeout(() => {
        setStatusMessage("Warming up the ML model... (this can take 20s)");
    }, 3000);

    try {
      const res = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, description }),
      });

      const data = await res.json();
      
      if (data.story) {
        setStory(data.story);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error("AI Generation Error:", err);
      alert("Failed to connect to Spark AI. Please try again.");
    } finally {
      clearTimeout(timer);
      setIsGenerating(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
            Campaign Story
          </label>
          {isGenerating && (
            <div className="flex items-center text-teal-500 animate-pulse text-[10px] font-bold uppercase tracking-widest ml-1">
               <Sparkles className="w-3 h-3 mr-2" />
               {statusMessage}
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={generateWithAI}
          disabled={isGenerating}
          className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isGenerating ? "Writing..." : "Generate with Spark AI"}
          </span>
        </button>
      </div>

      <div className="relative group">
        
        <div className="absolute -top-px -left-px w-10 h-10 bg-indigo-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          className="w-full bg-[#0a0f1d] border border-white/10 rounded-[2rem] px-8 py-8 text-gray-300 min-h-[450px] focus:ring-2 focus:ring-teal-500/50 outline-none transition-all custom-scrollbar leading-relaxed"
          placeholder="Craft your narrative here or let our AI find the perfect words for you..."
        />
      </div>
      
      <p className="text-[12px] text-gray-600 font-medium italic ml-2">
        Tip: Review and personalize the AI-generated story to make it truly yours.
      </p>
    </div>
  );
}