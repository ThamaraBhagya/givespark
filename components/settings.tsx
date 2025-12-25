//components/settings.tsx

"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Camera, User, CheckCircle, Loader2 } from 'lucide-react';

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
                // 💡 Important: This updates the client-side session data immediately
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
        <div className="max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Account Settings</h1>

            <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {/* Profile Photo Section */}
                <div className="flex flex-col items-center">
                    <div className="relative group">
                        <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-gray-50 bg-gray-100 shadow-inner">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-full w-full p-6 text-gray-300" />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors shadow-lg">
                            <Camera className="h-5 w-5 text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                    </div>
                    {uploading && <p className="mt-2 text-xs text-indigo-600 animate-pulse">Uploading photo...</p>}
                </div>

                {/* Name Field */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-black"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={saving || uploading}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                    {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                    <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
                </button>

                {status && (
                    <p className={`text-center text-sm font-medium ${status.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {status}
                    </p>
                )}
            </form>
        </div>
    );
}