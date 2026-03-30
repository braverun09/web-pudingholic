"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Category {
    id: string;
    name: string;
    description: string;
    display_order: number;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Partial<Category>>({ name: "", description: "", display_order: 1 });
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const supabase = createClient();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data } = await supabase.from("categories").select("*").order("display_order", { ascending: true });
        if (data) setCategories(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        if (isEditing && form.id) {
            const { error: updateError } = await supabase.from("categories").update({
                name: form.name,
                description: form.description,
                display_order: form.display_order
            }).eq("id", form.id);
            if (updateError) alert("Gagal update kategori: " + updateError.message);
        } else {
            const { error: insertError } = await supabase.from("categories").insert([{
                name: form.name,
                description: form.description,
                display_order: form.display_order
            }]);
            if (insertError) alert("Gagal tambah kategori: " + insertError.message);
        }
        
        setForm({ name: "", description: "", display_order: (categories.length > 0 ? categories[categories.length - 1].display_order + 1 : 1) });
        setIsEditing(false);
        setSaving(false);
        fetchCategories();
    };

    const handleEdit = (c: Category) => {
        setForm(c);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus Kategori ini? (Produk yang ada di dalam kategori ini tidak akan terhapus, tapi kategorinya akan menjadi kosong)")) return;
        await supabase.from("categories").delete().eq("id", id);
        fetchCategories();
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Kategori Menu 🏷️</h1>
                <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-2xl">
                    Kategori digunakan untuk membagi produk-produk kamu ke dalam beberapa kelompok di halaman beranda. 
                    Misalnya: <strong className="text-gray-700">"Signature Menu"</strong>, <strong className="text-gray-700">"Varian Buah"</strong>, atau <strong className="text-gray-700">"Promo Ramadhan"</strong>.
                </p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-100 mb-8 bg-gradient-to-br from-white to-emerald-50/30">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{isEditing ? "✏️ Edit Kategori Menu" : "✨ Buat Kategori Baru"}</h2>
                <p className="text-xs text-gray-500 mb-6">Isi formulir di bawah ini dengan jelas agar pembeli mudah memahami jualanmu.</p>
                
                <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Judul Kategori</label>
                            <input required type="text" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} 
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-inner focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none" 
                                placeholder="Cth: Menu Terlaris" 
                            />
                            <p className="text-[11px] text-gray-400 mt-1 italic">*Muncul paling besar di website sebagai judul balok.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Urutan Tampil (Paling Atas = 1)</label>
                            <input required type="number" min="1" value={form.display_order || 1} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) })} 
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-inner focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none" 
                            />
                            <p className="text-[11px] text-gray-400 mt-1 italic">*Jika diisi 1, kategori ini akan tampil paling atas di web.</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Deskripsi & Kata-Kata Promosi (Opsional)</label>
                            <input required type="text" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} 
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-inner focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none" 
                                placeholder="Cth: Pilihan puding seenak pelukan hangat ibu yang selalu memanjakan lidah..." 
                            />
                            <p className="text-[11px] text-gray-400 mt-1 italic">*Teks abu-abu kecil yang muncul di bawah judul kategori untuk menjelaskan rasanya.</p>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button type="submit" disabled={saving} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium shadow-sm hover:shadow hover:bg-emerald-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all">
                            {saving ? "Sedang Menyimpan..." : (isEditing ? "Simpan Perbaikan" : "Tambahkan Kategori Ini")}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(false); setForm({ name: "", description: "", display_order: 1 }); }} className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium">
                                Batal
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Sedang mengambil data kategori...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center">
                        <div className="text-5xl mb-4 opacity-50">📂</div>
                        <h3 className="text-lg font-bold text-gray-700">Belum Ada Kategori</h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-sm">Toko kamu saat ini belum memiliki folder menu apapun. Coba tambahkan Kategori Pertamamu di atas!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full pb-2">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest rounded-tl-3xl">Urutan</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Kategori & Deskripsi</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-widest rounded-tr-3xl">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {categories.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
                                                {c.display_order}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-base font-bold text-gray-900 mb-1">{c.name}</div>
                                            <div className="text-sm text-gray-500 max-w-md truncate">{c.description}</div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-right font-medium">
                                            <button onClick={() => handleEdit(c)} className="text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors mr-3 text-sm">✏️ Edit</button>
                                            <button onClick={() => handleDelete(c.id)} className="text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors text-sm">🗑️ Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
