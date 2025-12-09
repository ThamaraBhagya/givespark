// app/dashboard/creator/wallet/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { BanknotesIcon, ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';

// Define complex types for the data fetched from the API
type Transaction = {
    amount: number;
    type: 'DEPOSIT' | 'WITHDRAW';
    createdAt: string;
};

type WalletData = {
    balance: number;
    totalReceived: number;
    withdrawnAmount: number;
    transactions: Transaction[];
};

export default function CreatorWalletPage() {
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'WITHDRAWING'>('IDLE');
    const [message, setMessage] = useState('');

    // --- Data Fetching ---
    const fetchWalletData = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch('/api/wallet/balance');
            if (!response.ok) {
                // This might mean 403 (Access Denied), handled by the layout guard,
                // or 404 (Wallet Not Found, though rare).
                throw new Error('Failed to fetch wallet data. Check permissions.');
            }
            const data = await response.json();
            setWallet(data.wallet);
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
            setWallet(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    // --- Withdrawal Logic ---
    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (!wallet || withdrawAmount <= 0 || withdrawAmount > wallet.balance) {
            setMessage('Error: Invalid amount or insufficient balance.');
            return;
        }

        setStatus('WITHDRAWING');
        
        try {
            const response = await fetch('/api/wallet/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: withdrawAmount }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Withdrawal failed on server.');
            }

            // Success: Re-fetch data to update balances instantly
            await fetchWalletData(); 
            setMessage(`Successfully withdrew $${withdrawAmount.toFixed(2)} (Mock Transaction).`);
            setWithdrawAmount(0); // Clear input

        } catch (error: any) {
            setMessage(`Withdrawal Error: ${error.message}`);
        } finally {
            setStatus('IDLE');
        }
    };

    if (loading || !wallet) {
        return <div className="p-8 text-center text-gray-600">{loading ? 'Loading Wallet...' : 'Wallet data unavailable.'}</div>;
    }

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold text-gray-900">Virtual Wallet & Finances</h1>
            
            {message && (
                <div className={`p-4 rounded-lg ${message.startsWith('Successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            {/* --- 1. Key Metrics Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Available Balance Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-600">
                    <p className="text-sm font-medium text-gray-500">Available Balance</p>
                    <p className="mt-1 text-4xl font-extrabold text-indigo-900">
                        ${wallet.balance.toFixed(2)}
                    </p>
                </div>

                {/* Total Received Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-teal-600">
                    <p className="text-sm font-medium text-gray-500">Total Received (Lifetime)</p>
                    <p className="mt-1 text-4xl font-extrabold text-teal-800">
                        ${wallet.totalReceived.toFixed(2)}
                    </p>
                </div>

                {/* Total Withdrawn Card */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-gray-600">
                    <p className="text-sm font-medium text-gray-500">Total Withdrawn (Lifetime)</p>
                    <p className="mt-1 text-4xl font-extrabold text-gray-800">
                        ${wallet.withdrawnAmount.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* --- 2. Withdrawal Form & Transactions --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Withdrawal Form (LG Col 1) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Withdraw Funds (Mock)</h2>
                    <form onSubmit={handleWithdraw} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Amount to Withdraw</label>
                            <input
                                type="number"
                                min="0.01"
                                max={wallet.balance}
                                step="0.01"
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                                required
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                            <p className="text-xs text-gray-500 mt-1">Max: ${wallet.balance.toFixed(2)}</p>
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'WITHDRAWING' || withdrawAmount <= 0 || withdrawAmount > wallet.balance}
                            className="w-full py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {status === 'WITHDRAWING' ? 'Processing Withdrawal...' : 'Initiate Mock Withdrawal'}
                        </button>
                    </form>
                </div>

                {/* Transaction History (LG Col 2) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {wallet.transactions.length === 0 ? (
                            <p className="text-gray-500">No transactions recorded yet.</p>
                        ) : (
                            wallet.transactions.map((tx, index) => (
                                <div key={index} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0">
                                    <div className="flex items-center space-x-3">
                                        {tx.type === 'DEPOSIT' ? (
                                            <ArrowDownCircleIcon className="h-6 w-6 text-teal-500 rotate-180" />
                                        ) : (
                                            <ArrowUpCircleIcon className="h-6 w-6 text-red-500" />
                                        )}
                                        <div>
                                            <p className="font-semibold">{tx.type === 'DEPOSIT' ? 'Deposit (Donation)' : 'Withdrawal'}</p>
                                            <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-teal-600' : 'text-red-600'}`}>
                                        {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}