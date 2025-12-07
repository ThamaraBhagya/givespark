// app/campaign/new/page.tsx
// This is a client component because it handles user input and state.
"use client";

import React, { useState } from 'react';
// Assume we have a placeholder component for image upload that returns a URL string
// import ImageUpload from '@/components/ImageUpload'; 

export default function NewCampaignPage() {
  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    description: '',
    goalAmount: 0,
    deadline: '',
    category: '',
    // These will be URLs from the image upload service
    featuredImage: '', 
    images: [], // array of additional image URLs
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Convert goalAmount to a number
      [name]: name === 'goalAmount' ? parseFloat(value) : value, 
    }));
  };
  
  // NOTE: Image handling complexity is abstracted here. 
  // In a real app, you'd upload the image first and get the URL back.
  const handleFeaturedImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, featuredImage: url }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Basic validation check (can use Zod for robust validation)
    if (formData.goalAmount <= 0 || !formData.title || !formData.featuredImage) {
        setError("Please fill out all required fields.");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch('/api/campaign/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Handle server errors (e.g., authentication failure 401, validation error 400)
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create campaign');
      }

      setSuccess(true);
      // Optional: Redirect to the newly created campaign page or creator dashboard
      // router.push(`/campaign/${(await response.json()).campaign.id}`);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Start a New Campaign</h1>
      
      {error && <p className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</p>}
      {success && <p className="bg-green-100 text-green-700 p-3 mb-4 rounded">Campaign created successfully! (Awaiting publish)</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campaign Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Campaign Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        
        {/* Short Description */}
        <div>
          <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700">Short Description (for card preview)</label>
          <input
            type="text"
            id="shortDesc"
            name="shortDesc"
            value={formData.shortDesc}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Full Description / Story */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Full Story / Description</label>
          <textarea
            id="description"
            name="description"
            rows={6}
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        {/* Fundraising Goal & Deadline */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="goalAmount" className="block text-sm font-medium text-gray-700">Fundraising Goal ($)</label>
            <input
              type="number"
              id="goalAmount"
              name="goalAmount"
              value={formData.goalAmount}
              onChange={handleChange}
              required
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline Date</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Select a category...</option>
            <option value="Education">Education</option>
            <option value="Medical">Medical</option>
            <option value="Community">Community</option>
            <option value="Technology">Technology</option>
            {/* Add more categories here */}
          </select>
        </div>

        {/* Featured Image (Mocked input) */}
        <div>
            <label className="block text-sm font-medium text-gray-700">Featured Image URL (Mock Upload)</label>
            {/* Replace this input with a real ImageUpload component that handles API upload */}
            <input 
                type="text"
                name="featuredImage"
                placeholder="Paste Image URL here (e.g., from Vercel Blob)"
                value={formData.featuredImage}
                onChange={(e) => handleFeaturedImageUpload(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Creating Campaign...' : 'Submit Campaign'}
        </button>
      </form>
    </div>
  );
}