import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0a0c10] text-slate-200">
            {/* Background Texture/glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-64 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full" />
            </div>

            <Sidebar />

            <main className="pl-64 min-h-screen relative z-10">
                <div className="max-w-[1440px] mx-auto p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
