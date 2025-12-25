"use client";

import { useState, useEffect } from 'react';
import { 
  BanknoteIcon, 
  ArrowDownCircleIcon, 
  ArrowUpCircleIcon, 
  WalletIcon,
  TrendingUpIcon,
  HistoryIcon,
  ArrowRightLeft
} from 'lucide-react';

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

    const fetchWalletData = async () => {
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch('/api/wallet/balance');
            if (!response.ok) throw new Error('Failed to fetch wallet data.');
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
                throw new Error(errorData.error || 'Withdrawal failed.');
            }

            await fetchWalletData(); 
            setMessage(`Successfully withdrew $${withdrawAmount.toFixed(2)}.`);
            setWithdrawAmount(0);
        } catch (error: any) {
            setMessage(`Withdrawal Error: ${error.message}`);
        } finally {
            setStatus('IDLE');
        }
    };

    if (loading || !wallet) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#0a0f1d]">
                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-black tracking-widest uppercase text-xs">Syncing Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 bg-[#0a0f1d] min-h-screen text-white p-4 lg:p-8">
            <header>
                <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                    Virtual Vault & Finances
                </h1>
                <p className="text-gray-500 mt-2 font-light">Manage your earnings and initiate secure withdrawals.</p>
            </header>
            
            {message && (
                <div className={`p-4 rounded-2xl border backdrop-blur-md animate-in fade-in slide-in-from-top-4 ${
                    message.startsWith('Successfully') 
                    ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                    <p className="font-bold flex items-center"><ArrowRightLeft className="w-4 h-4 mr-2"/> {message}</p>
                </div>
            )}

            {/* --- 1. Metric Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Balance */}
                <div className="relative group bg-white/5 p-8 rounded-[2rem] border border-white/10 overflow-hidden">
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-indigo-500 blur-sm rounded-full"></div>
                    <WalletIcon className="absolute top-4 right-4 text-white/5 w-12 h-12" />
                    <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">Available Balance</p>
                    <p className="text-5xl font-black text-white tracking-tighter">
                        ${wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Total Received */}
                <div className="relative group bg-white/5 p-8 rounded-[2rem] border border-white/10 overflow-hidden">
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-teal-500 blur-sm rounded-full"></div>
                    <TrendingUpIcon className="absolute top-4 right-4 text-white/5 w-12 h-12" />
                    <p className="text-xs font-black uppercase tracking-widest text-teal-400 mb-2">Total Received</p>
                    <p className="text-5xl font-black text-white tracking-tighter">
                        ${wallet.totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Total Withdrawn */}
                <div className="relative group bg-white/5 p-8 rounded-[2rem] border border-white/10 overflow-hidden text-gray-400">
                    <p className="text-xs font-black uppercase tracking-widest mb-2">Total Withdrawn</p>
                    <p className="text-5xl font-black text-white/60 tracking-tighter">
                        ${wallet.withdrawnAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* --- 2. Lower Section --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Withdrawal Form */}
                <div className="lg:col-span-1 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md h-fit">
                    <h2 className="text-xl font-black text-white mb-6 flex items-center">
                        <ArrowUpCircleIcon className="w-5 h-5 mr-2 text-indigo-400" />
                        Withdraw Funds
                    </h2>
                    <form onSubmit={handleWithdraw} className="space-y-6">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-2 ml-1">
                                Amount (USD)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 font-black">$</span>
                                <input
                                    type="number"
                                    min="0.01"
                                    max={wallet.balance}
                                    step="0.01"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                                    required
                                    className="w-full bg-[#0a0f1d] border border-white/10 rounded-2xl pl-10 pr-6 py-4 text-white font-bold focus:ring-2 focus:ring-teal-500/50 outline-none transition-all"
                                />
                            </div>
                            <div className="flex justify-between mt-2 px-1">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Available to withdraw</p>
                                <p className="text-[10px] text-teal-500 font-black tracking-widest">${wallet.balance.toFixed(2)}</p>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'WITHDRAWING' || withdrawAmount <= 0 || withdrawAmount > wallet.balance}
                            className="w-full py-5 bg-teal-400 text-gray-950 font-black rounded-2xl shadow-xl shadow-teal-500/10 hover:bg-teal-300 transition-all disabled:opacity-20 active:scale-[0.98]"
                        >
                            {status === 'WITHDRAWING' ? 'Processing...' : 'Transfer to Account'}
                        </button>
                    </form>
                </div>

                {/* Transaction History */}
                <div className="lg:col-span-2 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md">
                    <h2 className="text-xl font-black text-white mb-8 flex items-center">
                        <HistoryIcon className="w-5 h-5 mr-2 text-teal-400" />
                        Transaction History
                    </h2>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                        {wallet.transactions.length === 0 ? (
                            <div className="text-center py-20 opacity-20 italic font-black uppercase tracking-widest">
                                <BanknoteIcon className="w-12 h-12 mx-auto mb-4" />
                                No History Yet
                            </div>
                        ) : (
                            wallet.transactions.map((tx, index) => (
                                <div key={index} className="group flex justify-between items-center p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-xl ${
                                            tx.type === 'DEPOSIT' ? 'bg-teal-500/10 text-teal-400' : 'bg-rose-500/10 text-rose-400'
                                        }`}>
                                            {tx.type === 'DEPOSIT' ? (
                                                <ArrowDownCircleIcon className="h-6 w-6 rotate-180" />
                                            ) : (
                                                <ArrowUpCircleIcon className="h-6 w-6" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white tracking-tight">{tx.type === 'DEPOSIT' ? 'Donation Received' : 'Vault Withdrawal'}</p>
                                            <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase mt-1">
                                                {new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xl font-black tracking-tighter ${
                                            tx.type === 'DEPOSIT' ? 'text-teal-400' : 'text-rose-400'
                                        }`}>
                                            {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        <span className="text-[8px] font-black uppercase text-gray-600 tracking-tighter">USD Settlement</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}