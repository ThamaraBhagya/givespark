// components/DonationModal.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react'; // Added useEffect, useCallback
import { useSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation';

// 💡 STRIPE IMPORTS
import { 
  Elements, 
  PaymentElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with the public key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK as string);


interface DonationModalProps {
  campaignId: string;
  campaignTitle: string;
  onClose: () => void;
  onSuccess: (donatedAmount: number) => void;
}

interface CheckoutFormProps extends DonationModalProps {
    amount: number;
    intentId: string;
    message: string;
    anonymous: boolean;
    donorId: string; // Passed from the parent modal
    // No need for onClose/onSuccess here, they are passed to the handler
}

// ----------------------------------------------------------------------
// 💡 Inner Component: Handles Payment Processing with Stripe Hooks
// ----------------------------------------------------------------------
const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
    campaignId, amount, intentId, message, anonymous, donorId, onSuccess, onClose 
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!stripe || !elements) {
            setError("Stripe initialization failed. Please try again.");
            return;
        }

        setIsProcessing(true);
        setError(null);
        
        // 1. Confirm the payment on the client side using the Payment Element
        const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
            // The return URL is used if the user must be redirected (e.g., 3D Secure)
            confirmParams: {
                return_url: `${window.location.origin}/campaign/${campaignId}`, 
            },
        });

        if (paymentError) {
            // Display error to the user (e.g., invalid card details)
            setError(paymentError.message || "Payment confirmation failed.");
            setIsProcessing(false);
            return;
        }
        
        // 2. If confirmation is successful (status: succeeded) or pending, 
        //    call the backend route to update the database.
        
        // We only proceed if we have a paymentIntent ID (which is required)
        if (paymentIntent?.id) {
            
            // Call the backend to perform the database write (Prisma transaction)
            const dbUpdateResponse = await fetch('/api/donation/confirm-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    campaignId, 
                    amount,
                    message,
                    anonymous,
                    donorId, // Pass the donor ID for the Donation record
                    intentId: paymentIntent.id, // Pass the verified Stripe ID
                }),
            });

            if (dbUpdateResponse.ok) {
                // Database write succeeded
                onSuccess(amount); // Trigger parent refresh and success state
            } else {
                const errorData = await dbUpdateResponse.json();
                setError(errorData.error || "Payment succeeded but failed to record donation.");
            }
        }
        
        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            
            {/* Display amount, message, and anonymous fields (read-only in this form) */}
            <div className="text-xl font-bold text-gray-800">
                Donating: ${amount.toFixed(2)}
            </div>

            {/* Display errors */}
            {error && <p className="p-3 text-red-700 bg-red-100 rounded">{error}</p>}
            
            {/* Stripe's secure UI element */}
            <PaymentElement />
            
            {/* Submit Button */}
            <button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="w-full py-3 px-4 rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition duration-150"
            >
                {isProcessing ? 'Processing Payment...' : `Pay & Donate $${amount.toFixed(2)}`}
            </button>
        </form>
    );
};


// ----------------------------------------------------------------------
// 💡 Outer Component: Handles Session, Amount Inputs, and Fetching Client Secret
// ----------------------------------------------------------------------
export default function DonationModal({ campaignId, campaignTitle, onClose, onSuccess }: DonationModalProps) {
    const { data: session } = useSession();
    const router = useRouter();
    
    // UI State for inputs
    const [amount, setAmount] = useState(10); 
    const [message, setMessage] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    
    // Stripe State
    const [clientSecret, setClientSecret] = useState('');
    const [intentId, setIntentId] = useState('');
    const [isLoadingStripe, setIsLoadingStripe] = useState(true);
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [error, setError] = useState<string | null>(null);

    // Redirect unauthenticated users
    if (!session) {
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/campaign/${campaignId}`)}`);
        return null;
    }
    
    const donorId = session.user?.id || ''; // Guaranteed to be available if session exists
    
    // 💡 Step 1: Fetch the clientSecret from the server
    const fetchClientSecret = useCallback(async () => {
        if (amount <= 0) return;

        setIsLoadingStripe(true);
        setClientSecret('');
        
        try {
            const response = await fetch('/api/donation/create-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, campaignId }),
            });
            const data = await response.json();
            
            if (response.ok && data.clientSecret) {
                setClientSecret(data.clientSecret);
                setIntentId(data.intentId);
            } else {
                throw new Error(data.error || 'Failed to initialize payment.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoadingStripe(false);
        }
    }, [amount, campaignId]);

    useEffect(() => {
        fetchClientSecret();
    }, [fetchClientSecret]);


    // Function to handle success and closure (passed to CheckoutForm)
    const handleSuccessAndClose = (donatedAmount: number) => {
        setStatus('SUCCESS');
        onSuccess(donatedAmount);
    }
    
    // --- Success State Render ---
    if (status === 'SUCCESS') {
        return (
            <div className="p-8 text-center">
                <h2 className="text-3xl font-bold text-green-600">Payment Successful! 🎉</h2>
                <p className="mt-4 text-gray-600">Thank you for your generous contribution of ${amount.toFixed(2)} to {campaignTitle}.</p>
                <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                    Close
                </button>
            </div>
        );
    }

    // --- Main Form Render ---
    return (
        <div className="p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900">Support {campaignTitle}</h2>
            <p className="text-gray-500 mb-6">Enter your details securely processed by Stripe.</p>

            {error && <p className="p-3 text-red-700 bg-red-100 rounded mb-4">{error}</p>}
            
            {/* User Input Form (Amount, Message, Anonymous) */}
            <div className="space-y-4">
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
                        disabled={isLoadingStripe}
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
                        disabled={isLoadingStripe}
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
                        disabled={isLoadingStripe}
                    />
                    <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
                        Donate anonymously
                    </label>
                </div>
            </div>

            <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Details</h3>
                
                {/* 💡 Step 2: Render Stripe Components */}
                {clientSecret && !isLoadingStripe ? (
                    <Elements options={{ clientSecret }} stripe={stripePromise}>
                        <CheckoutForm 
                            campaignId={campaignId} 
                            campaignTitle={campaignTitle}
                            onClose={onClose}
                            onSuccess={handleSuccessAndClose} // Use the custom handler
                            amount={amount}
                            intentId={intentId}
                            message={message}
                            anonymous={anonymous}
                            donorId={donorId}
                        />
                    </Elements>
                ) : (
                    <div className="text-center py-5">Loading payment form...</div>
                )}
            </div>
            
        </div>
    );
}












// // components/DonationModal.tsx
// "use client";

// import { useState } from 'react';
// // Assume you use next-auth for getting the session/donor ID on the client
// import { useSession } from 'next-auth/react'; 
// import { useRouter } from 'next/navigation';

// interface DonationModalProps {
//   campaignId: string;
//   campaignTitle: string;
//   onClose: () => void;
//   onSuccess: (donatedAmount: number) => void; // Function to refresh campaign data on success
// }

// export default function DonationModal({ campaignId, campaignTitle, onClose, onSuccess }: DonationModalProps) {
//   const { data: session } = useSession(); // Get session
//   const router = useRouter();
  
  
//   const [amount, setAmount] = useState(10); // Default donation amount
//   const [message, setMessage] = useState('');
//   const [anonymous, setAnonymous] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'>('IDLE');
//   const [error, setError] = useState('');

//   if (!session) {
//     // Redirect to signin
//     router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/campaign/${campaignId}`)}`);
//     return null;
//   }

//   const handleDonate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!session?.user?.id) {
//       setError("You must be logged in to donate");
//       return;
//     }
//     if (amount <= 0) {
//       setError("Amount must be greater than zero.");
//       return;
//     }

//     setLoading(true);
//     setStatus('PROCESSING');
//     setError('');

//     // --- MOCK PAYMENT SIMULATION ---
//     // Show a fake processing delay to simulate a payment gateway
//     await new Promise(resolve => setTimeout(resolve, 2000)); 

//     try {
//       const response = await fetch('/api/donation/create', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           campaignId,
//           amount,
//           message,
//           anonymous,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Payment failed on server.');
//       }
//       // Extract the actual amount from the API response
//       const successData = await response.json(); 
//       const actualDonatedAmount = successData.donation.amount; // <-- Get the actual amount

//       setStatus('SUCCESS');
//       onSuccess(actualDonatedAmount); // Trigger parent page refresh
      
//     } catch (err: any) {
//       setStatus('ERROR');
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (status === 'SUCCESS') {
//     return (
//       <div className="p-8 text-center">
//         <h2 className="text-3xl font-bold text-green-600">Payment Successful! 🎉</h2>
//         <p className="mt-4 text-gray-600">Thank you for your generous contribution of ${amount} to {campaignTitle}.</p>
//         <button
//           onClick={onClose}
//           className="mt-6 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//         >
//           Close
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8">
//       <h2 className="text-2xl font-bold text-gray-900">Support {campaignTitle}</h2>
//       <p className="text-gray-500 mb-6">Your mock donation will instantly update the campaign progress.</p>

//       {status === 'ERROR' && <p className="p-3 text-red-700 bg-red-100 rounded mb-4">{error}</p>}
//       {status === 'PROCESSING' && (
//          <div className="flex items-center space-x-2 p-4 bg-yellow-100 text-yellow-800 rounded mb-4">
//             {/* Simple spinner placeholder */}
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-800"></div>
//             <span>Processing Mock Payment... (Simulating 2 seconds)</span>
//          </div>
//       )}

//       <form onSubmit={handleDonate} className="space-y-4">
//         {/* Amount Field */}
//         <div>
//           <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Donation Amount ($)</label>
//           <input
//             type="number"
//             id="amount"
//             value={amount}
//             onChange={(e) => setAmount(parseFloat(e.target.value))}
//             required
//             min="1"
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-lg"
//             disabled={loading}
//           />
//         </div>

//         {/* Message Field (Optional) */}
//         <div>
//           <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message (Optional)</label>
//           <textarea
//             id="message"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             rows={2}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//             disabled={loading}
//           />
//         </div>
        
//         {/* Anonymous Checkbox */}
//         <div className="flex items-center">
//           <input
//             id="anonymous"
//             type="checkbox"
//             checked={anonymous}
//             onChange={(e) => setAnonymous(e.target.checked)}
//             className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
//             disabled={loading}
//           />
//           <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-900">
//             Donate anonymously
//           </label>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading || status === 'PROCESSING'}
//           className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
//         >
//           {loading ? 'Processing...' : 'Confirm Mock Donation'}
//         </button>
//       </form>
//     </div>
//   );
// }