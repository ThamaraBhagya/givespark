// components/DonationModal.tsx
"use client";

import { useState } from 'react';
// Assume you use next-auth for getting the session/donor ID on the client
// import { useSession } from 'next-auth/react'; 

interface DonationModalProps {
  campaignId: string;
  campaignTitle: string;
  onClose: () => void;
  onSuccess: (donatedAmount: number) => void; // Function to refresh campaign data on success
}

export default function DonationModal({ campaignId, campaignTitle, onClose, onSuccess }: DonationModalProps) {
  
  // const { data: session } = useSession(); // Use this to pre-fill name/email if needed
  
  const [amount, setAmount] = useState(10); // Default donation amount
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = useState('');

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    setLoading(true);
    setStatus('PROCESSING');
    setError('');

    // --- MOCK PAYMENT SIMULATION ---
    // Show a fake processing delay to simulate a payment gateway
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    try {
      const response = await fetch('/api/donation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          amount,
          message,
          anonymous,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment failed on server.');
      }
      // Extract the actual amount from the API response
      const successData = await response.json(); 
      const actualDonatedAmount = successData.donation.amount; // <-- Get the actual amount

      setStatus('SUCCESS');
      onSuccess(actualDonatedAmount); // Trigger parent page refresh
      
    } catch (err: any) {
      setStatus('ERROR');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'SUCCESS') {
    return (
      <div className="p-8 text-center">
        <h2 className="text-3xl font-bold text-green-600">Payment Successful! 🎉</h2>
        <p className="mt-4 text-gray-600">Thank you for your generous contribution of ${amount} to {campaignTitle}.</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900">Support {campaignTitle}</h2>
      <p className="text-gray-500 mb-6">Your mock donation will instantly update the campaign progress.</p>

      {status === 'ERROR' && <p className="p-3 text-red-700 bg-red-100 rounded mb-4">{error}</p>}
      {status === 'PROCESSING' && (
         <div className="flex items-center space-x-2 p-4 bg-yellow-100 text-yellow-800 rounded mb-4">
            {/* Simple spinner placeholder */}
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-800"></div>
            <span>Processing Mock Payment... (Simulating 2 seconds)</span>
         </div>
      )}

      <form onSubmit={handleDonate} className="space-y-4">
        {/* Amount Field */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Donation Amount ($)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required
            min="1"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-lg"
            disabled={loading}
          />
        </div>

        {/* Message Field (Optional) */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (Optional)</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            disabled={loading}
          />
        </div>
        
        {/* Anonymous Checkbox */}
        <div className="flex items-center">
          <input
            id="anonymous"
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            disabled={loading}
          />
          <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
            Donate anonymously
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || status === 'PROCESSING'}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Confirm Mock Donation'}
        </button>
      </form>
    </div>
  );
}