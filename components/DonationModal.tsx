"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react'; 
import { useRouter } from 'next/navigation';
import { X, ShieldCheck, Heart, Loader2, CheckCircle2 } from 'lucide-react';

// STRIPE IMPORTS
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK as string);

interface DonationModalProps {
  campaignId: string;
  campaignTitle: string;
  onClose: () => void;
  onSuccess: (donatedAmount: number) => void;
}

// ----------------------------------------------------------------------
// 💡 Inner Component: CheckoutForm
// ----------------------------------------------------------------------
const CheckoutForm: React.FC<any> = ({ 
    campaignId, amount, intentId, message, anonymous, donorId, onSuccess, onClose 
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setError(null);
        
        const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
            confirmParams: {
                return_url: `${window.location.origin}/campaign/${campaignId}`, 
            },
        });

        if (paymentError) {
            setError(paymentError.message || "Payment confirmation failed.");
            setIsProcessing(false);
            return;
        }
        
        if (paymentIntent?.id) {
            const dbUpdateResponse = await fetch('/api/donation/confirm-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    campaignId, amount, message, anonymous, donorId, intentId: paymentIntent.id,
                }),
            });

            if (dbUpdateResponse.ok) {
                onSuccess(amount);
            } else {
                const errorData = await dbUpdateResponse.json();
                setError(errorData.error || "Recording donation failed.");
            }
        }
        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                <PaymentElement options={{ layout: 'tabs' }} />
            </div>

            {error && <p className="p-3 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl text-sm">{error}</p>}
            
            <button
                type="submit"
                disabled={isProcessing || !stripe || !elements}
                className="w-full py-4 bg-teal-400 text-gray-950 font-black text-lg rounded-2xl hover:bg-teal-300 transition-all shadow-xl shadow-teal-500/20 active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
            >
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>Confirm & Pay ${amount.toFixed(2)}</span>}
            </button>
        </form>
    );
};

// ----------------------------------------------------------------------
// 💡 Outer Component: DonationModal
// ----------------------------------------------------------------------
export default function DonationModal({ campaignId, campaignTitle, onClose, onSuccess }: DonationModalProps) {
    const { data: session } = useSession();
    const router = useRouter();
    
    const [amount, setAmount] = useState(10); 
    const [message, setMessage] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [intentId, setIntentId] = useState('');
    const [isLoadingStripe, setIsLoadingStripe] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [error, setError] = useState<string | null>(null);

    const donorId = session?.user?.id || '';

    const fetchClientSecret = useCallback(async () => {
        if (amount <= 0) return;
        setIsLoadingStripe(true);
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
        const timeoutId = setTimeout(() => {
            if (amount >= 1) fetchClientSecret();
        }, 500); // Debounce API calls as user types amount
        return () => clearTimeout(timeoutId);
    }, [amount, fetchClientSecret]);

    if (status === 'SUCCESS') {
        return (
            <div className="p-12 text-center bg-[#0a0f1d] text-white">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-teal-500/20 rounded-full">
                        <CheckCircle2 className="w-16 h-16 text-teal-400 animate-in zoom-in duration-500" />
                    </div>
                </div>
                <h2 className="text-4xl font-black tracking-tighter mb-4 italic">Spark Ignited! 🎉</h2>
                <p className="text-gray-400 text-lg font-light leading-relaxed">
                    Your contribution of <span className="text-white font-bold">${amount}</span> to <br/>
                    <span className="text-indigo-400 font-bold">{campaignTitle}</span> was successful.
                </p>
                <button
                    onClick={onClose}
                    className="mt-10 px-10 py-4 bg-white/10 hover:bg-white/20 text-white font-black rounded-2xl transition-all"
                >
                    Back to Project
                </button>
            </div>
        );
    }

    return (
        <div className="relative bg-[#0a0f1d] text-white overflow-hidden max-h-[95vh] flex flex-col">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                    <h2 className="text-2xl font-black tracking-tighter flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-rose-500 fill-rose-500/20" />
                        Support this Spark
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">{campaignTitle}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                {error && <p className="p-3 text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl text-sm">{error}</p>}
                
                {/* User Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 ml-1">Pledge Amount ($)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                                className="w-full bg-[#111827] border border-white/10 rounded-2xl pl-10 pr-6 py-4 text-white font-black text-xl focus:ring-2 focus:ring-teal-500/50 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 pt-6 md:pt-0">
                        <input
                            id="anonymous" type="checkbox" checked={anonymous}
                            onChange={(e) => setAnonymous(e.target.checked)}
                            className="w-6 h-6 rounded-lg bg-[#111827] border-white/10 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer"
                        />
                        <label htmlFor="anonymous" className="text-sm font-bold text-gray-400 cursor-pointer select-none">
                            Keep my identity private
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Message for the creator</label>
                    <textarea
                        value={message} onChange={(e) => setMessage(e.target.value)}
                        placeholder="Say something inspiring..."
                        rows={2}
                        className="w-full bg-[#111827] border border-white/10 rounded-2xl px-6 py-4 text-white font-medium focus:ring-2 focus:ring-teal-500/50 outline-none transition-all resize-none"
                    />
                </div>

                {/* Stripe Section */}
                <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center space-x-2 mb-4">
                        <ShieldCheck className="w-4 h-4 text-teal-400" />
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Secure Payment Details</h3>
                    </div>
                    
                    {clientSecret && !isLoadingStripe ? (
                        <Elements 
                            stripe={stripePromise} 
                            options={{ 
                                clientSecret, 
                                appearance: { 
                                    theme: 'night',
                                    variables: { colorPrimary: '#2dd4bf', colorBackground: '#111827' }
                                } 
                            }}
                        >
                            <CheckoutForm 
                                campaignId={campaignId} amount={amount} intentId={intentId}
                                message={message} anonymous={anonymous} donorId={donorId}
                                onClose={onClose} onSuccess={(amt: number) => { setStatus('SUCCESS'); onSuccess(amt); }}
                            />
                        </Elements>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 space-y-3 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Initializing Secure Gateway...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-center">
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em] flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-2" /> Encrypted & Secured by Stripe
                </p>
            </div>
        </div>
    );
}