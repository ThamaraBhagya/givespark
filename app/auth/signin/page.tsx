"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CameraIcon, UserCircleIcon, ArrowRight, Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<'USER' | 'CREATOR'>('USER');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [finalImageUrl, setFinalImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setRole('USER');
        setIsLogin(true); 
        setError('');
    };

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
                setFinalImageUrl(data.url);
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
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError('Login failed: Invalid email or password.');
            } else {
                router.push('/');
            }
        } else {
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role, image: finalImageUrl }),
                });

                if (!response.ok) {
                    const responseClone = response.clone();
                    let errorMessage = 'Registration failed.';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorData.details || 'Registration failed.';
                    } catch {
                        errorMessage = await responseClone.text(); 
                    }
                    throw new Error(errorMessage);
                }
                resetForm();
                router.push('/auth/signin?registered=true&email=' + encodeURIComponent(email));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0a0f1d] text-white overflow-hidden">
            
            {/* LEFT SIDE: IMMERSIVE IMAGE */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-900">
                <Image 
                    src="/auth-bg.png" // 💡 Change this to your preferred high-quality image
                    alt="GiveSpark Impact"
                    fill
                    className="object-cover opacity-60 grayscale-[40%]"
                    priority
                />
                {/* Brand Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-transparent to-[#0a0f1d]/90 flex flex-col justify-end p-16">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[3rem] space-y-6 max-w-lg animate-in fade-in slide-in-from-left-10 duration-700">
                        <div className="flex items-center space-x-3">
                           <div className="relative h-10 w-10">
                             <Image src="/logo.png" alt="Icon" fill className="object-contain" />
                           </div>
                           <p className="text-2xl font-black tracking-tighter uppercase">GiveSpark</p>
                        </div>
                        <h1 className="text-4xl font-black leading-tight tracking-tighter">
                            Fueling Dreams, <br />
                            <span className="text-teal-400">One Spark at a Time.</span>
                        </h1>
                        <p className="text-gray-400 text-lg font-light leading-relaxed">
                            Join our community of over 1,000 active projects and thousands of global backers.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: AUTH FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative">
                {/* Subtle Background Glows */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-md space-y-10 relative z-10">
                    <header className="text-center lg:text-left space-y-2">
                        <h2 className="text-4xl sm:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                            {isLogin ? 'Welcome Back' : 'Get Started'}
                        </h2>
                        <p className="text-gray-500 font-light text-lg">
                            {isLogin ? 'Enter your credentials to access your dashboard.' : 'Join the movement and start making an impact.'}
                        </p>
                    </header>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-medium animate-in shake duration-300">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                                {/* Profile Photo Upload */}
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative group">
                                        <div className="w-28 h-28 rounded-[2rem] border-4 border-white/5 overflow-hidden bg-[#111827] shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                            {previewUrl ? (
                                                <Image src={previewUrl} fill className="object-cover" alt="Preview" />
                                            ) : (
                                                <UserCircleIcon className="w-full h-full text-gray-800 p-4" />
                                            )}
                                        </div>
                                        <label className="absolute -bottom-2 -right-2 bg-teal-400 p-2.5 rounded-2xl cursor-pointer hover:bg-teal-300 transition-all shadow-xl group-active:scale-90">
                                            <CameraIcon className="w-5 h-5 text-gray-950" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-teal-400">
                                        {uploadingImage ? 'Securing Photo...' : 'Add Profile Identity'}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                        <input 
                                            type="text" required value={name} onChange={(e) => setName(e.target.value)} 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-teal-500/50 outline-none transition-all"
                                            placeholder="Kamal Perera"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Your Role</label>
                                    <select 
                                        value={role} onChange={(e) => setRole(e.target.value as 'USER' | 'CREATOR')}
                                        className="w-full bg-[#111827] border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none cursor-pointer"
                                    >
                                        <option value="USER" className="bg-[#0a0f1d]">Donor / Backer</option>
                                        <option value="CREATOR" className="bg-[#0a0f1d]">Campaign Creator</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                <input 
                                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-teal-500/50 outline-none transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                                <input 
                                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-teal-500/50 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading || uploadingImage}
                            className="w-full py-5 bg-teal-400 text-gray-950 font-black text-xl rounded-2xl shadow-xl shadow-teal-500/20 hover:bg-teal-300 transition-all active:scale-[0.98] disabled:opacity-20 flex items-center justify-center space-x-3"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>{isLogin ? 'Sign In' : 'Create Account'}</span>}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-gray-400 text-sm font-black uppercase tracking-widest">
                            {isLogin ? (
                                <>
                                    New to GiveSpark?{' '}
                                    <button 
                                        onClick={() => setIsLogin(!isLogin)} 
                                        className="text-teal-400 hover:text-teal-300 transition-colors"
                                    >
                                        Join Now
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already a member?{' '}
                                    <button 
                                        onClick={() => setIsLogin(!isLogin)} 
                                        className="text-teal-400 hover:text-teal-300 transition-colors"
                                    >
                                        Sign In
                                    </button>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}