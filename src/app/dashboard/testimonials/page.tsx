"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Testimonial {
    id: string;
    quote: string;
    author: string;
    role: string;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Partial<Testimonial>>({ quote: "", author: "", role: "" });
    const [isEditing, setIsEditing] = useState(false);
    
    const supabase = createClient();

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: true });
        if (data) setTestimonials(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && form.id) {
            await supabase.from("testimonials").update({
                quote: form.quote,
                author: form.author,
                role: form.role
            }).eq("id", form.id);
        } else {
            await supabase.from("testimonials").insert([{
                quote: form.quote,
                author: form.author,
                role: form.role
            }]);
        }
        setForm({ quote: "", author: "", role: "" });
        setIsEditing(false);
        fetchTestimonials();
    };

    const handleEdit = (t: Testimonial) => {
        setForm(t);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;
        await supabase.from("testimonials").delete().eq("id", id);
        fetchTestimonials();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Manage Testimonials</h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Testimonial" : "Add New Testimonial"}</h2>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Name</label>
                            <input required type="text" value={form.author || ""} onChange={e => setForm({ ...form, author: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role / Subtitle</label>
                            <input required type="text" value={form.role || ""} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Food Blogger" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                            <textarea required rows={3} value={form.quote || ""} onChange={e => setForm({ ...form, quote: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                            {isEditing ? "Update Testimonial" : "Save Testimonial"}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(false); setForm({ quote: "", author: "", role: "" }) }} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading testimonials...</div>
                ) : (
                    <div className="overflow-x-auto w-full pb-2">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {testimonials.map((t) => (
                                <tr key={t.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{t.author}</div>
                                        <div className="text-sm text-gray-500">{t.role}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 italic line-clamp-2">"{t.quote}"</div>
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
