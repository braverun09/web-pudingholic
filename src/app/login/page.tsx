"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-6 lg:px-8 text-foreground">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl md:text-5xl font-bold text-primary tracking-tight">
                    Admin Pudingholic.
                </h2>
                <p className="mt-4 text-center text-sm md:text-base opacity-70">
                    Sign in to manage your products, toppings, and testimonials.
                </p>
            </div>

            <div className="mt-8 mx-auto w-full max-w-[90%] sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-foreground/10">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium opacity-80 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-foreground/20 rounded-xl shadow-sm placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-secondary-1 focus:border-transparent bg-transparent transition-all"
                                placeholder="admin@pudingholic.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium opacity-80 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-4 py-3 border border-foreground/20 rounded-xl shadow-sm placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-secondary-1 focus:border-transparent bg-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-secondary-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-1 disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {loading ? "Signing in..." : "Masuk ke Dashboard"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
