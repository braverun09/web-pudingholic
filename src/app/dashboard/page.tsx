import { createClient } from "@/lib/supabase/server";

export default async function DashboardOverview() {
    const supabase = await createClient();
    
    // Fetch counts
    const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const { count: toppingsCount } = await supabase.from('toppings').select('*', { count: 'exact', head: true });
    const { count: testimonialsCount } = await supabase.from('testimonials').select('*', { count: 'exact', head: true });

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900 mb-2">{productsCount || 0}</span>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Products</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900 mb-2">{toppingsCount || 0}</span>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Toppings</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900 mb-2">{testimonialsCount || 0}</span>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Testimonials</span>
                </div>
            </div>
            
            <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Welcome to your Control Center</h2>
                <p className="text-blue-800">
                    Use the sidebar on the left to navigate between different data tables. 
                    Any changes you make (Create, Edit, Delete) will instantly update the public website.
                </p>
            </div>
        </div>
    );
}
