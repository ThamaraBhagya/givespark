// app/auth/signin/page.tsx
"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // NextAuth client hook
import { useRouter } from 'next/navigation';
import { CameraIcon, UserCircleIcon } from 'lucide-react';

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<'USER' | 'CREATOR'>('USER');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // --- 💡 NEW: Profile Photo States ---
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [finalImageUrl, setFinalImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('USER');
    // Ensure the view switches to LOGIN
    setIsLogin(true); 
    setError('');
};

// --- 💡 NEW: Handle Image Upload to Vercel Blob ---
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPreviewUrl(URL.createObjectURL(file));
            setUploadingImage(true);

            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/api/upload/image', {
                    method: 'POST',
                    body: formData,
                });
                if (!res.ok) throw new Error("Image upload failed");
                const data = await res.json();
                setFinalImageUrl(data.url); // Use this URL for registration
            } catch (err) {
                setError("Failed to upload profile photo.");
            } finally {
                setUploadingImage(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (isLogin) {
            // --- LOGIN LOGIC ---
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Login failed: Invalid email or password.');
            } else {
                router.push('/'); // Redirect to home on success
            }

        } else {
    // --- REGISTER LOGIC ---
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role,image: finalImageUrl }),
        });

        if (!response.ok) {
            // CRITICAL FIX: Clone the response BEFORE attempting to read the body.
            const responseClone = response.clone();
            let errorMessage = 'Registration failed due to server error.';

            try {
                // 1. Try to read JSON first (for our custom API errors)
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.details || 'Registration failed.';
            } catch {
                // 2. If JSON parsing fails (because the server sent plain text/HTML), 
                // read the raw text from the CLONED response for debugging.
                errorMessage = await responseClone.text(); 
            }
            
            // Throw the error message that was successfully read/parsed
            throw new Error(errorMessage);
        }
        
        // --- SUCCESS: Redirect to Login Page ---
        // (You don't need to read response.json() if you are only redirecting)
        resetForm();
        router.push('/auth/signin?registered=true&email=' + encodeURIComponent(email));
        
    } catch (err: any) {
        // This catch block handles the error thrown above or network errors.
        setError(err.message);
    } finally {
        setLoading(false);
    }
}
        
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
                <h2 className="text-3xl font-extrabold text-center text-gray-900">
                    {isLogin ? 'Sign In to GiveSpark' : 'Create Your Account'}
                </h2>
                {error && <p className="p-3 text-red-700 bg-red-100 rounded">{error}</p>}
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Register fields (Hidden during login) */}
                    {!isLogin && (
                        <>

                            {/* 💡 PROFILE PHOTO UPLOAD */}
                            <div className="flex flex-col items-center space-y-2">
                                <div className="relative group w-24 h-24">
                                    <div className="w-full h-full rounded-full border-4 border-gray-100 shadow-sm overflow-hidden bg-gray-50 flex items-center justify-center">
                                        {previewUrl ? (
                                            <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <UserCircleIcon className="w-full h-full text-gray-300" />
                                        )}
                                    </div>
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                                        <CameraIcon className="w-8 h-8 text-white" />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">Add profile photo</span>
                                {uploadingImage && <span className="text-[10px] text-indigo-600 animate-pulse">Uploading...</span>}
                            </div> 
                            
                            <div>
                                <label className="block text-sm font-medium text-black">Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-md text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Your Role</label>
                                <select 
                                    value={role} 
                                    onChange={(e) => setRole(e.target.value as 'USER' | 'CREATOR')}
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                                >
                                    <option value="USER">Donor/Backer</option>
                                    <option value="CREATOR">Creator (I want to launch campaigns)</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Email and Password Fields (Common to both) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
                    </button>
                </form>

                {/* Switch Login/Register */}
                <div className="text-sm text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Sign In"}
                    </button>
                </div>

            </div>
        </div>
    );
}