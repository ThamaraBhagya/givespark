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
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white dark:bg-[#0a0f1d]">
                <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-600 dark:text-gray-500 font-black tracking-widest uppercase text-xs">Syncing Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 sm:space-y-10 bg-white dark:bg-[#0a0f1d] min-h-screen text-slate-900 dark:text-white p-4 sm:p-6 md:p-8">
            <header>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-400">
                    Virtual Vault & Finances
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-gray-500 mt-2 font-light">Manage your earnings and initiate secure withdrawals.</p>
            </header>
            
            {message && (
                <div className={`p-4 rounded-2xl border backdrop-blur-md animate-in fade-in slide-in-from-top-4 ${
                    message.startsWith('Successfully') 
                    ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-500/10 dark:border-teal-500/20 dark:text-teal-400' 
                    : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
                }`}>
                    <p className="font-bold flex items-center"><ArrowRightLeft className="w-4 h-4 mr-2"/> {message}</p>
                </div>
            )}

            {/* --- 1. Metric Cards --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {/* Balance */}
                <div className="relative group bg-white dark:bg-white/5 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-4xl border border-indigo-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-indigo-600/60 dark:bg-indigo-500 blur-sm rounded-full"></div>
                    <WalletIcon className="absolute top-3 sm:top-4 right-3 sm:right-4 text-slate-300/30 dark:text-white/5 w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12" />
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Available Balance</p>
                    <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                        ${wallet.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Total Received */}
                <div className="relative group bg-white dark:bg-white/5 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-4xl border border-indigo-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-none">
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-teal-600/60 dark:bg-teal-500 blur-sm rounded-full"></div>
                    <TrendingUpIcon className="absolute top-3 sm:top-4 right-3 sm:right-4 text-slate-300/30 dark:text-white/5 w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12" />
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 mb-2">Total Received</p>
                    <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                        ${wallet.totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Total Withdrawn */}
                <div className="relative group bg-white dark:bg-white/5 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-4xl border border-indigo-200 dark:border-white/10 overflow-hidden text-slate-600 dark:text-gray-400 shadow-sm dark:shadow-none sm:col-span-2 md:col-span-1">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2">Total Withdrawn</p>
                    <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-700 dark:text-white/60 tracking-tighter">
                        ${wallet.withdrawnAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* --- 2. Lower Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                
                {/* Withdrawal Form */}
                <div className="md:col-span-1 bg-white dark:bg-white/5 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-indigo-200 dark:border-white/10 backdrop-blur-md h-fit shadow-sm dark:shadow-none">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6 flex items-center">
                        <ArrowUpCircleIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                        Withdraw Funds
                    </h2>
                    <form onSubmit={handleWithdraw} className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-slate-600 dark:text-gray-500 mb-2 ml-1">
                                Amount (USD)
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 dark:text-teal-400 font-black">$</span>
                                <input
                                    type="number"
                                    min="0.01"
                                    max={wallet.balance}
                                    step="0.01"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(parseFloat(e.target.value))}
                                    required
                                    className="w-full bg-white dark:bg-[#0a0f1d] border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl pl-10 pr-4 sm:pr-6 py-3 sm:py-4 text-sm sm:text-base text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500/30 dark:focus:ring-teal-500/50 outline-none transition-all"
                                />
                            </div>
                            <div className="flex justify-between mt-2 px-1 gap-2">
                                <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-gray-500 font-bold uppercase tracking-widest">Available to withdraw</p>
                                <p className="text-[9px] sm:text-[10px] text-indigo-600 dark:text-teal-500 font-black tracking-widest flex-shrink-0">${wallet.balance.toFixed(2)}</p>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={status === 'WITHDRAWING' || withdrawAmount <= 0 || withdrawAmount > wallet.balance}
                            className="w-full py-3 sm:py-5 bg-indigo-600 text-white dark:bg-teal-400 dark:text-gray-950 font-black text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-xl shadow-indigo-500/10 dark:shadow-teal-500/10 hover:bg-indigo-500 dark:hover:bg-teal-300 transition-all disabled:opacity-20 active:scale-[0.98]"
                        >
                            {status === 'WITHDRAWING' ? 'Processing...' : 'Transfer to Account'}
                        </button>
                    </form>
                </div>

                {/* Transaction History */}
                <div className="md:col-span-2 bg-white dark:bg-white/5 p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] border border-indigo-200 dark:border-white/10 backdrop-blur-md shadow-sm dark:shadow-none">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-6 sm:mb-8 flex items-center">
                        <HistoryIcon className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-indigo-600 dark:text-teal-400" />
                        Transaction History
                    </h2>
                    <div className="space-y-3 sm:space-y-4 max-h-[500px] overflow-y-auto pr-2 sm:pr-4 custom-scrollbar">
                        {wallet.transactions.length === 0 ? (
                            <div className="text-center py-12 sm:py-16 md:py-20 opacity-20 italic font-black uppercase tracking-widest">
                                <BanknoteIcon className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 mx-auto mb-3 sm:mb-4" />
                                No History Yet
                            </div>
                        ) : (
                            wallet.transactions.map((tx, index) => (
                                <div key={index} className="group flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 dark:bg-white/2 dark:border-white/5 dark:hover:bg-white/5 transition-all">
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${
                                            tx.type === 'DEPOSIT' ? 'bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                                        }`}>
                                            {tx.type === 'DEPOSIT' ? (
                                                <ArrowDownCircleIcon className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 rotate-180" />
                                            ) : (
                                                <ArrowUpCircleIcon className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">{tx.type === 'DEPOSIT' ? 'Donation Received' : 'Vault Withdrawal'}</p>
                                            <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-gray-500 font-black tracking-widest uppercase mt-0.5 sm:mt-1">
                                                {new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className={`text-lg sm:text-xl font-black tracking-tighter ${
                                            tx.type === 'DEPOSIT' ? 'text-teal-400' : 'text-rose-400'
                                        }`}>
                                            {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                        <span className="text-[8px] font-black uppercase text-slate-400 dark:text-gray-600 tracking-tighter">USD Settlement</span>
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