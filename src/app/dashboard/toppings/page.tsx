"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Topping {
    id: string;
    name: string;
    description: string;
    image: string;
}

export default function ToppingsPage() {
    const [toppings, setToppings] = useState<Topping[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Partial<Topping>>({ name: "", description: "", image: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    
    const supabase = createClient();

    useEffect(() => {
        fetchToppings();
    }, []);

    const fetchToppings = async () => {
        setLoading(true);
        const { data } = await supabase.from("toppings").select("*").order("created_at", { ascending: true });
        if (data) setToppings(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        
        let finalImageUrl = form.image;

        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('products').upload(`toppings/${fileName}`, file, {
                cacheControl: '3600',
                upsert: false
            });
            
            if (uploadError) {
                alert("Upload gambar gagal: " + uploadError.message);
                setSaving(false);
                return;
            }

            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(`toppings/${fileName}`);
            finalImageUrl = publicUrl;
        }

        if (isEditing && form.id) {
            const { error: updateError } = await supabase.from("toppings").update({
                name: form.name,
                description: form.description,
                image: finalImageUrl
            }).eq("id", form.id);
            if (updateError) alert("Gagal update topping: " + updateError.message);
        } else {
            const { error: insertError } = await supabase.from("toppings").insert([{
                name: form.name,
                description: form.description,
                image: finalImageUrl
            }]);
            if (insertError) alert("Gagal tambah topping: " + insertError.message);
        }
        
        setForm({ name: "", description: "", image: "" });
        setFile(null);
        setIsEditing(false);
        setSaving(false);
        fetchToppings();
    };

    const handleEdit = (t: Topping) => {
        setForm(t);
        setFile(null);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this topping?")) return;
        await supabase.from("toppings").delete().eq("id", id);
        fetchToppings();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Manage Toppings</h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Topping" : "Add New Topping"}</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input required type="text" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Foto Topping (JPG/PNG)</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={e => setFile(e.target.files ? e.target.files[0] : null)} 
                                className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" 
                            />
                            {isEditing && form.image && !file && <p className="text-xs text-gray-500 mt-1">Biarkan kosong jika tidak ingin mengubah foto</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input required type="text" value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" disabled={saving} className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50">
                            {saving ? "Saving Data..." : (isEditing ? "Update Topping" : "Save Topping")}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(false); setForm({ name: "", description: "", image: "" }); setFile(null); }} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading toppings...</div>
                ) : (
                    <div className="overflow-x-auto w-full pb-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topping</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {toppings.map((t) => (
                                    <tr key={t.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {t.image && <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100" />}
                                                <div className="text-sm font-medium text-gray-900">{t.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900">{t.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => handleEdit(t)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                            <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
