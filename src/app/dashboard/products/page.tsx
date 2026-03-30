"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Product {
    id: string;
    name: string;
    description: string;
    image: string;
    colspan: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Partial<Product>>({ name: "", description: "", image: "", colspan: "col-span-1" });
    const [isEditing, setIsEditing] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    
    const supabase = createClient();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data } = await supabase.from("products").select("*").order("created_at", { ascending: true });
        if (data) setProducts(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
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
                alert("Upload gambar gagal: " + uploadError.message);
                setSaving(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(`images/${fileName}`);
            finalImageUrl = publicUrl;
        }

        if (isEditing && form.id) {
            const { error: updateError } = await supabase.from("products").update({
                name: form.name,
                description: form.description,
                image: finalImageUrl,
                colspan: form.colspan
            }).eq("id", form.id);
            if (updateError) alert("Gagal update produk: " + updateError.message);
        } else {
            const { error: insertError } = await supabase.from("products").insert([{
                name: form.name,
                description: form.description,
                image: finalImageUrl,
                colspan: form.colspan
            }]);
            if (insertError) alert("Gagal tambah produk: " + insertError.message);
        }
        
        setForm({ name: "", description: "", image: "", colspan: "col-span-1" });
        setFile(null);
        setIsEditing(false);
        setSaving(false);
        fetchProducts();
    };

    const handleEdit = (p: Product) => {
        setForm(p);
        setFile(null);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        await supabase.from("products").delete().eq("id", id);
        fetchProducts();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Manage Products</h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Product" : "Add New Product"}</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input required type="text" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image (JPG/PNG)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={e => setFile(e.target.files ? e.target.files[0] : null)} 
                                className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                            />
                            {isEditing && form.image && !file && <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah foto</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input required type="text" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Grid Column Span</label>
                            <select value={form.colspan || "col-span-1"} onChange={e => setForm({ ...form, colspan: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                                <option value="col-span-1">Small (1 Column)</option>
                                <option value="col-span-1 md:col-span-2">Large (2 Columns)</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {saving ? "Saving Data..." : (isEditing ? "Update Product" : "Save Product")}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(false); setForm({ name: "", description: "", image: "", colspan: "col-span-1" }); setFile(null); }} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading products...</div>
                ) : (
                    <div className="overflow-x-auto w-full pb-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            {p.image && <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover shadow-sm bg-gray-100" />}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{p.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 line-clamp-2">{p.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
