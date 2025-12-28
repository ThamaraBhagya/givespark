"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Camera, User, CheckCircle, Loader2, Shield, Bell, CreditCard } from 'lucide-react';

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [name, setName] = useState(session?.user?.name || '');
    const [previewUrl, setPreviewUrl] = useState(session?.user?.image || '');
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setPreviewUrl(URL.createObjectURL(file));
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/api/upload/image', { method: 'POST', body: formData });
                const data = await res.json();
                setPreviewUrl(data.url);
            } catch (err) {
                setStatus('Image upload failed.');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus('');

        try {
            const res = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, image: previewUrl }),
            });

            if (res.ok) {
                await update({ name, image: previewUrl });
                setStatus('Profile updated successfully!');
            }
        } catch (err) {
            setStatus('Error updating profile.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0f1d] text-slate-900 dark:text-white p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                {/* Header */}
                <header>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-500">
                        Profile Settings
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-gray-500 mt-2 font-light">Update your personal information and profile appearance.</p>
                </header>

                <div className="lg:col-span-2">
    <form onSubmit={handleSave} className="bg-indigo-50 dark:bg-white/5 border border-indigo-200 dark:border-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl md:rounded-[2.5rem] p-5 sm:p-6 md:p-8 md:p-10 shadow-2xl space-y-6 sm:space-y-8 md:space-y-10 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 bg-indigo-600/20 dark:bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Profile Photo Section */}
        <div className="flex flex-col items-center sm:flex-row sm:space-x-6 md:space-x-8 gap-4 sm:gap-0">
            <div className="relative group">
                <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-indigo-200 dark:border-white/5 bg-indigo-50 dark:bg-[#111827] shadow-2xl relative flex-shrink-0">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Profile" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                        <User className="h-full w-full p-4 sm:p-6 md:p-8 text-slate-400 dark:text-gray-700" />
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-teal-400 animate-spin" />
                        </div>
                    )}
                </div>
                <label className="absolute -bottom-2 -right-2 bg-indigo-600 dark:bg-teal-400 p-2 sm:p-2.5 rounded-lg sm:rounded-2xl cursor-pointer hover:bg-indigo-700 dark:hover:bg-teal-300 transition-all shadow-xl shadow-indigo-600/20 dark:shadow-teal-500/20 group-active:scale-90">
                    <Camera className="h-4 sm:h-5 w-4 sm:w-5 text-white dark:text-gray-950" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
            </div>
            <div className="text-center sm:text-left space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Profile Picture</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-500 font-light max-w-[200px]">PNG, JPG or GIF. Max size 2MB.</p>
            </div>
        </div>

        <hr className="border-indigo-200 dark:border-white/5" />

        {/* Form Fields */}
        <div className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
                <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-teal-400 ml-1">
                    Display Name
                </label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white dark:bg-[#0a0f1d] border border-indigo-300 dark:border-white/10 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 dark:focus:ring-teal-500/50 outline-none transition-all"
                    placeholder="Your name"
                />
            </div>

            
        </div>

        {/* Submit & Status */}
        <div className="pt-2 sm:pt-4 space-y-3 sm:space-y-4">
            <button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-indigo-600 dark:bg-teal-400 text-white dark:text-gray-950 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl md:rounded-2xl font-black text-sm sm:text-base md:text-lg flex items-center justify-center space-x-2 sm:space-x-3 hover:bg-indigo-700 dark:hover:bg-teal-300 shadow-xl shadow-indigo-600/20 dark:shadow-teal-500/10 active:scale-[0.98] transition-all disabled:opacity-20"
            >
                {saving ? (
                    <Loader2 className="animate-spin h-5 sm:h-6 w-5 sm:w-6" />
                ) : (
                    <CheckCircle className="h-5 sm:h-6 w-5 sm:w-6" />
                )}
                <span>{saving ? 'Syncing Changes...' : 'Save Settings'}</span>
            </button>

            {status && (
                <div className={`flex items-center justify-center space-x-2 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-2 ${status.includes('success') ? 'text-indigo-600 dark:text-teal-400' : 'text-red-600 dark:text-red-400'}`}>
                    {status.includes('success') && <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4" />}
                    <span>{status}</span>
                </div>
            )}
        </div>
    </form>
</div>
            </div>
        </div>
    );
}