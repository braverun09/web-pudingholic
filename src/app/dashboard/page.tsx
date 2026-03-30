import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardOverview() {
    const supabase = await createClient();
    
    // Fetch counts efficiently
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: categoriesCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
    const { count: toppingsCount } = await supabase.from('toppings').select('*', { count: 'exact', head: true });
    const { count: testimonialsCount } = await supabase.from('testimonials').select('*', { count: 'exact', head: true });

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Halo Admin! 👋</h1>
            <p className="text-gray-500 mb-8 max-w-2xl">
                Selamat datang di "Pusat Kendali" Pudingholic. Di sini kamu bisa mengatur menu jualanmu, 
                membuat promo baru, dan langsung melihat hasilnya secara *real-time* di websitemu.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
                <Link href="/dashboard/categories" className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col items-center justify-center text-center cursor-pointer">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">📂</div>
                    <span className="text-4xl font-bold text-gray-900 mb-1">{categoriesCount || 0}</span>
                    <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Kategori</span>
                </Link>

                <Link href="/dashboard/products" className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col items-center justify-center text-center cursor-pointer">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">📦</div>
                    <span className="text-4xl font-bold text-gray-900 mb-1">{productsCount || 0}</span>
                    <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Produk</span>
                </Link>

                <Link href="/dashboard/toppings" className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all flex flex-col items-center justify-center text-center cursor-pointer">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">🍫</div>
                    <span className="text-4xl font-bold text-gray-900 mb-1">{toppingsCount || 0}</span>
                    <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Topping</span>
                </Link>

                <Link href="/dashboard/testimonials" className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex flex-col items-center justify-center text-center cursor-pointer">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">💬</div>
                    <span className="text-4xl font-bold text-gray-900 mb-1">{testimonialsCount || 0}</span>
                    <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Ulasan</span>
                </Link>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100/50 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute -right-8 -top-8 text-9xl opacity-5 pointer-events-none">✨</div>
                <h2 className="text-lg font-bold text-emerald-900 mb-3 flex items-center gap-2">
                    <span>💡</span> Cara Memulai Mengunggah Menu:
                </h2>
                <div className="space-y-4 text-emerald-800 text-sm leading-relaxed max-w-2xl relative z-10">
                    <div className="flex gap-4 p-4 bg-white/60 rounded-2xl border border-white">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">1</span>
                        <div>
                            <strong className="block mb-1 text-emerald-900">Bikin Kategori Dulu (Wajib)</strong>
                            Pergi ke menu <b>📂 Kategori Menu</b> dan buat blok kategori (Misal: "Menu Paling Laris").
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-white/60 rounded-2xl border border-white">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">2</span>
                        <div>
                            <strong className="block mb-1 text-emerald-900">Masukkan Data Produk</strong>
                            Masuk ke <b>📦 Katalog Produk</b>, unggah foto puding paling fotogenik milikmu, dan pilih ingin ditaruh di kategori mana puding tersebut.
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-white/60 rounded-2xl border border-white">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">3</span>
                        <div>
                            <strong className="block mb-1 text-emerald-900">Selesai! Tampil di Web</strong>
                            Cek halaman beranda depan. Puding barumu beserta foto super lezatnya sudah tampil otomatis tanpa perlu *coding* lagi! 🎉
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
