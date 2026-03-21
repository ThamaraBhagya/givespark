"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  RocketIcon, 
  ImageIcon, 
  CalendarIcon, 
  DollarSignIcon, 
  LayersIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import CampaignStoryAI from '@/components/CampaignStoryAI';

export default function NewCampaignPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    description: '',
    goalAmount: 0,
    deadline: '',
    category: '',
    featuredImage: '', 
    images: [], 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'goalAmount' ? parseFloat(value) : value, 
    }));
  };

  const setStory = (newStory: string) => {
    console.log("Updating Parent State with AI Story:", newStory.substring(0, 50) + "...");
    setFormData(prev => ({ ...prev, description: newStory }));
};
  
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload image.');
        }
        
        const data = await response.json();
        setUploadedUrl(data.url);
        return data.url; 
        
    } catch (error: any) {
        setError(error.message);
        return null;
    } finally {
        setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setFeaturedFile(file);
        handleFileUpload(file); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.goalAmount <= 0 || !formData.title || !featuredFile) {
        setError("Please fill out all required fields and upload an image.");
        setLoading(false);
        return;
    }

    let finalImageUrl = uploadedUrl;
    if (!finalImageUrl && featuredFile) {
        const url = await handleFileUpload(featuredFile); 
        if (!url) {
            setLoading(false);
            return;
        }
        finalImageUrl = url;
    }
    
    if (!finalImageUrl) {
        setError("Failed to secure image URL for submission.");
        setLoading(false);
        return;
    }

    const submissionBody = { ...formData, featuredImage: finalImageUrl };

    try {
        const response = await fetch('/api/campaign/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submissionBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create campaign.');
        }

        setSuccess(true);
        const campaignData = await response.json(); 
        router.push(`/campaign/${campaignData.campaign.id}`); 
        
    } catch (err: any) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-white pb-20 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/15 dark:bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/15 dark:bg-teal-500/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
        <header className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-300 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <RocketIcon className="w-3 h-3" />
            <span>Launch Your Vision</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-500">
            Start a New Campaign
          </h1>
          <p className="text-slate-600 dark:text-gray-400 mt-4 text-lg font-light">
            Fill in the details below to ignite your project and find your backers.
          </p>
        </header>
        
        {error && (
          <div className="flex items-center space-x-3 bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 text-red-700 dark:text-red-400 p-4 mb-8 rounded-2xl animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-indigo-50 dark:bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-indigo-200 dark:border-white/10 shadow-2xl">
          
          
          <div className="space-y-2">
            <label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-teal-400 ml-1 flex items-center">
              <span className="mr-2">01.</span> Campaign Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Clean Water Initiative"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-white/5 border border-indigo-300 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500/50 transition-all"
            />
          </div>
          
        
          <div className="space-y-2">
            <label htmlFor="shortDesc" className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-teal-400 ml-1 flex items-center">
              <span className="mr-2">02.</span> Elevator Pitch
            </label>
            <input
              type="text"
              id="shortDesc"
              name="shortDesc"
              placeholder="A one-sentence summary for your card preview"
              value={formData.shortDesc}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-white/5 border border-indigo-300 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500/50 transition-all"
            />
          </div>

         
          
          {/*  THE FULL STORY (INTEGRATED AI COMPONENT) */}
          <CampaignStoryAI 
            title={formData.title}
            category={formData.category}
            description={formData.shortDesc} 
            story={formData.description}
            setStory={setStory}
          />

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="goalAmount" className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-teal-400 ml-1 flex items-center">
                <DollarSignIcon className="w-3 h-3 mr-2" /> Goal Amount
              </label>
              <input
                type="number"
                id="goalAmount"
                name="goalAmount"
                value={formData.goalAmount}
                onChange={handleChange}
                required
                min="1"
                className="w-full bg-white dark:bg-white/5 border border-indigo-300 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="deadline" className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-teal-400 ml-1 flex items-center">
                <CalendarIcon className="w-3 h-3 mr-2" /> Deadline
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full bg-white dark:bg-white/5 border border-indigo-300 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500/50 transition-all [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>

        
          <div className="space-y-2">
            <label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-teal-400 ml-1 flex items-center">
              <LayersIcon className="w-3 h-3 mr-2" /> Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-white dark:bg-white/5 border border-indigo-300 dark:border-white/10 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-white dark:bg-[#0a0f1d]">Select a category...</option>
              <option value="EDUCATION" className="bg-white dark:bg-[#0a0f1d]">Education</option>
              <option value="MEDICAL" className="bg-white dark:bg-[#0a0f1d]">Medical</option>
              <option value="COMMUNITY" className="bg-white dark:bg-[#0a0f1d]">Community</option>
              <option value="TECHNOLOGY" className="bg-white dark:bg-[#0a0f1d]">Technology</option>
              <option value="OTHER" className="bg-white dark:bg-[#0a0f1d]">Other</option>
            </select>
          </div>

     
          <div className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-teal-400 ml-1 flex items-center">
              <ImageIcon className="w-3 h-3 mr-2" /> Featured Image
            </label>
            
            <div className={`relative group border-2 border-dashed rounded-[2rem] p-8 text-center transition-all ${uploadedUrl ? 'border-indigo-500/40 dark:border-teal-500/40 bg-indigo-50 dark:bg-teal-500/5' : 'border-indigo-300 dark:border-white/10 hover:border-indigo-400 dark:hover:border-white/20'}`}>
              <input 
                  type="file"
                  id="featuredImage"
                  name="featuredImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!uploadedUrl}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              
              <div className="space-y-4">
                {uploadedUrl ? (
                  <div className="flex flex-col items-center animate-in zoom-in-95">
                    <CheckCircle2 className="w-12 h-12 text-indigo-600 dark:text-teal-400 mb-2" />
                    <p className="text-indigo-700 dark:text-teal-400 font-bold">Image Securely Uploaded</p>
                    <img src={uploadedUrl} alt="Preview" className="w-32 h-20 object-cover mt-4 rounded-xl border border-indigo-300 dark:border-teal-500/20" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-indigo-100 dark:bg-white/5 rounded-2xl mb-2">
                      <ImageIcon className="w-8 h-8 text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {isUploading ? 'Securing your image...' : 'Click or drag to upload featured image'}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-gray-600 uppercase tracking-widest mt-2">Max size: 5MB • JPG, PNG, WEBP</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || isUploading}
            className="w-full py-5 px-4 bg-indigo-600 dark:bg-teal-400 text-white dark:text-[#0a0f1d] font-black text-xl rounded-2xl shadow-xl shadow-indigo-600/20 dark:shadow-teal-500/20 hover:bg-indigo-700 dark:hover:bg-teal-300 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#0a0f1d]/20 border-t-[#0a0f1d] rounded-full animate-spin" />
                <span>Creating Spark...</span>
              </>
            ) : (
              <span>Submit Campaign</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}