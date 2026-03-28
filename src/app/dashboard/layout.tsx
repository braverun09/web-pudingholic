import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
                <div className="p-8 border-b border-gray-100">
                    <h2 className="text-2xl font-bold tracking-tight">Pudingholic</h2>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Admin Panel</p>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link href="/dashboard" className="block px-4 py-3 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                        Overview
                    </Link>
                    <Link href="/dashboard/products" className="block px-4 py-3 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                        📦 Products Catalog
                    </Link>
                    <Link href="/dashboard/toppings" className="block px-4 py-3 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                        🍫 Toppings
                    </Link>
                    <Link href="/dashboard/testimonials" className="block px-4 py-3 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                        💬 Testimonials
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <Link href="/" target="_blank" className="block px-4 py-3 text-sm text-center font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
                        View Public Site ↗
                    </Link>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
