"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    colspan: string;
    category_id: string | null;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<(Product & { categories?: { name: string } | null })[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Partial<Product>>({ name: "", description: "", image: "", colspan: "col-span-1", category_id: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    
    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // Fetch categories first to populate dropdown
        const { data: catData } = await supabase.from("categories").select("id, name").order("display_order", { ascending: true });
        if (catData) setCategories(catData);

        // Fetch products along with their category names
        const { data: prodData } = await supabase.from("products").select("*, categories(name)").order("created_at", { ascending: true });
        if (prodData) setProducts(prodData);
        
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!form.category_id) {
            alert("Harap pilih Kategori Menu terlebih dahulu!");
            return;
        }

        setSaving(true);
        let finalImageUrl = form.image;

        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('products').upload(`images/${fileName}`, file, {
                cacheControl: '3600',
                upsert: false
            });
            
            if (uploadError) {
                alert("Gagal mengunggah foto: " + uploadError.message);
                setSaving(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(`images/${fileName}`);
            finalImageUrl = publicUrl;
        }

        const payload = {
            name: form.name,
            description: form.description,
            image: finalImageUrl,
            colspan: form.colspan,
            category_id: form.category_id
        };

        if (isEditing && form.id) {
            const { error: updateError } = await supabase.from("products").update(payload).eq("id", form.id);
            if (updateError) alert("Gagal update produk: " + updateError.message);
        } else {
            const { error: insertError } = await supabase.from("products").insert([payload]);
            if (insertError) alert("Gagal tambah produk: " + insertError.message);
        }
        
        setForm({ name: "", description: "", image: "", colspan: "col-span-1", category_id: "" });
        setFile(null);
        setIsEditing(false);
        setSaving(false);
        fetchData();
    };

    const handleEdit = (p: Product) => {
        setForm(p);
        setFile(null);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus produk lezat ini? 😢")) return;
        await supabase.from("products").delete().eq("id", id);
        fetchData();
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Katalog Produk 📦</h1>
                <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-2xl">
                    Pajang produk-produk terbaikmu di sini. Pilih kategori yang tepat dan unggah foto paling menggiurkan agar pelanggan langsung ingin membeli!
                </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 mb-8 bg-gradient-to-br from-white to-blue-50/30">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{isEditing ? "✏️ Edit Info Produk" : "✨ Tambah Puding Paling Enak"}</h2>
                <p className="text-xs text-gray-500 mb-6">Pastikan mengisi semua dengan lengkap ya.</p>
                
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Produk</label>
                            <input required type="text" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} 
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                                placeholder="Cth: Puding Karamel Extra Lumer" 
                            />
                        </div>
                        
                        {/* Category Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Pilih Kategori Menu</label>
                            {categories.length === 0 ? (
                                <div className="text-sm bg-rose-50 text-rose-600 px-4 py-3 rounded-xl border border-rose-100">
                                    ⚠️ Kamu belum membuat Kategori. Tolong buat kategori dulu ya di menu sebelah kiri.
                                </div>
                            ) : (
                                <select required value={form.category_id || ""} onChange={e => setForm({ ...form, category_id: e.target.value })} 
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-500 transition-all outline-none cursor-pointer bg-white">
                                    <option value="" disabled>--- Klik Untuk Memilih Kategori ---</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* File Upload */}
                        <div className="md:col-span-2 p-6 rounded-2xl border-2 border-dashed border-blue-100 bg-blue-50/20">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">📸 Foto Puding (Usahakan Bentuk Kotak 1:1)</label>
                            <input type="file" accept="image/*" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all file:cursor-pointer cursor-pointer" />
                            {isEditing && form.image && !file && <p className="text-xs text-blue-600 mt-3 flex items-center gap-1"><i>ℹ️</i> Sengaja dibiarkan kosong karena kamu ingin pakai foto yang lama.</p>}
                        </div>

                        {/* Description Input */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi Rasanya (Copywriting)</label>
                            <textarea required value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                                placeholder="Gambarkan betapa lembut dan lumernya puding ini saat masuk ke mulut..." 
                            />
                        </div>

                        {/* Span Input */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Ukuran Bingkai di Beranda</label>
                            <select value={form.colspan || "col-span-1"} onChange={e => setForm({ ...form, colspan: e.target.value })} className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-inner focus:ring-2 focus:ring-blue-500 transition-all outline-none bg-white">
                                <option value="col-span-1">📦 Standar (1 Kotak Kecil)</option>
                                <option value="col-span-1 md:col-span-2">🎁 Jumbo Barisan Penuh (2 Kotak Melebar) - Bagus Untuk Menu Utama</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button type="submit" disabled={saving || categories.length === 0} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all">
                            {saving ? "⏳ Sedang Mengunggah Dapur..." : (isEditing ? "💾 Simpan Perubahan" : "✅ Pajang Produk Ini")}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(false); setForm({ name: "", description: "", image: "", colspan: "col-span-1", category_id: "" }); setFile(null); }} className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium">
                                ❌ Batal Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto w-full pb-0">
                    {loading ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center">
                            <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium">Sedikit lagi ya, lagi ambil data dari gudang...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-5xl mb-4 opacity-50">🍽️</div>
                            <h3 className="text-lg font-bold text-gray-700">Piring Masih Kosong</h3>
                            <p className="text-sm text-gray-500 mt-2">Ayo tambahkan karya pertamamu di atas!</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest rounded-tl-3xl">Foto & Produk</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Grup Kategori</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Copywriting</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest rounded-tr-3xl">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {products.map((p) => (
                                    <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                {p.image ? (
                                                    <img src={p.image} alt={p.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100" />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300">N/A</div>
                                                )}
                                                <div className="text-base font-bold text-gray-900">{p.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                {p.categories?.name || "Tidak Terkategori"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600 line-clamp-2 italic">"{p.description}"</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                                            <button onClick={() => handleEdit(p)} className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors mr-3 text-sm">✏️ Edit</button>
                                            <button onClick={() => handleDelete(p.id)} className="text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors text-sm">🗑️ Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
