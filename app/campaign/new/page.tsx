// app/campaign/new/page.tsx
// This is a client component because it handles user input and state.
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// Assume we have a placeholder component for image upload that returns a URL string
// import ImageUpload from '@/components/ImageUpload'; 

export default function NewCampaignPage() {
  const router = useRouter();
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
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

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
  // app/campaign/new/page.tsx (Inside your client component)

// Logic to call your /api/upload/image route
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
        setUploadedUrl(data.url); // Save the returned public URL
        return data.url; 
        
    } catch (error: any) {
        setError(error.message);
        return null;
    } finally {
        setIsUploading(false);
    }
};

// Handle file selection from the input
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        setFeaturedFile(file);
        
        // Optionally, start the upload immediately or wait for form submit
        handleFileUpload(file); 
    }
};
// ...
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // --- 1. Client-Side Validation ---
    if (formData.goalAmount <= 0 || !formData.title || !featuredFile) {
        setError("Please fill out all required fields and upload an image.");
        setLoading(false);
        return;
    }

    // --- 2. Image Upload ---
    let finalImageUrl = uploadedUrl;
    
    // If we haven't uploaded yet (uploadedUrl is empty), upload the file now
    if (!finalImageUrl && featuredFile) {
        // Assume handleFileUpload is available and returns the URL or null
        const url = await handleFileUpload(featuredFile); 
        
        if (!url) {
            // Error handling is done inside handleFileUpload, just stop submission
            setLoading(false);
            return;
        }
        finalImageUrl = url;
    }
    
    // If we still don't have a URL, stop the process
    if (!finalImageUrl) {
        setError("Failed to secure image URL for submission.");
        setLoading(false);
        return;
    }

    // --- 3. Prepare Final Submission Body ---
    const submissionBody = {
        ...formData,
        // Replace the local image reference with the secure, public URL from Vercel Blob
        featuredImage: finalImageUrl, 
    };


    // --- 4. Submit Campaign Data to Backend ---
    try {
        const response = await fetch('/api/campaign/create', {
            method: 'POST',
            headers: {
                // Must be JSON content type
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionBody),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create campaign on the server.');
        }

        setSuccess(true);
        // Optional: Get the newly created campaign ID for redirection
        const campaignData = await response.json(); 
        router.push(`/campaign/${campaignData.campaign.id}`); 
        
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

       

        <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">Featured Image (Required)</label>
            
            <input 
                type="file"
                id="featuredImage"
                name="featuredImage"
                accept="image/*"
                onChange={handleFileChange}
                required={!uploadedUrl} // Required unless a URL is already present
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                disabled={isUploading}
            />

            {isUploading && (
                <p className="mt-2 text-sm text-indigo-600">Uploading image to Vercel Blob...</p>
            )}

            {uploadedUrl && (
                <div className="mt-3 p-3 border rounded-md bg-green-50">
                    <p className="text-sm font-medium text-green-700">
                        Image uploaded successfully! 
                    </p>
                    {/* Display a small preview of the uploaded image */}
                    {/* <img src={uploadedUrl} alt="Preview" className="w-20 h-20 object-cover mt-2 rounded" /> */}
                </div>
            )}
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