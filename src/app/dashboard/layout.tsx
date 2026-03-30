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
        <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-900 font-sans">
            <aside className="w-full md:w-64 bg-white border-b md:border-r border-gray-200 shadow-sm flex flex-col shrink-0 relative z-20">
                <div className="p-4 md:p-8 border-b border-gray-100 flex justify-between items-center md:block">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Pudingholic</h2>
                        <p className="text-[10px] md:text-xs text-gray-500 mt-1 uppercase tracking-widest hidden md:block">Admin Panel</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 py-4 md:py-6 flex md:flex-col overflow-x-auto whitespace-nowrap gap-2 md:gap-2 snap-x scrollbar-hide">
                    <Link href="/dashboard" className="snap-start block px-4 py-2 md:py-3 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors bg-gray-50 md:bg-transparent">
                        Overview
                    </Link>
                    <Link href="/dashboard/products" className="snap-start block px-4 py-2 md:py-3 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 md:border-transparent">
                        📦 Products Catalog
                    </Link>
                    <Link href="/dashboard/toppings" className="snap-start block px-4 py-2 md:py-3 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 md:border-transparent">
                        🍫 Toppings
                    </Link>
                    <Link href="/dashboard/testimonials" className="snap-start block px-4 py-2 md:py-3 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors border border-gray-100 md:border-transparent">
                        💬 Testimonials
                    </Link>
                </nav>
                <div className="hidden md:block p-4 border-t border-gray-100">
                    <Link href="/" target="_blank" className="block px-4 py-3 text-sm text-center font-medium bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors">
                        View Public Site ↗
                    </Link>
                </div>
            </aside>
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto pb-24 md:pb-0">
                    {children}
                </div>
            </main>
        </div>
    );
}
