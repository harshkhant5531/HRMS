"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Loader2, ArrowRight, Zap } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f1115] text-white p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full" />

            <div className="w-full max-w-md relative">
                <div className="bg-[#1a1d23]/80 backdrop-blur-3xl border border-white/5 p-12 rounded-[40px] shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <Zap className="w-3 h-3" /> Login
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-white">
                            User <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic px-1">Login</span>
                        </h1>
                        <p className="text-gray-500 mt-3 font-medium text-sm">Welcome back to Dayflow.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black p-4 rounded-2xl text-center uppercase tracking-widest">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#0f1115] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm font-bold placeholder:text-gray-700"
                                    placeholder="IDENTITY@DAYFLOW.COM"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0f1115] border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-sm font-bold placeholder:text-gray-700"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group mt-4 uppercase tracking-[0.2em] text-[10px] active:scale-95"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Login
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                        New user?{" "}
                        <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
