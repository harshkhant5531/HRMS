"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    UserPlus,
    Mail,
    Lock,
    IdCard,
    Briefcase,
    ChevronLeft,
    Loader2,
    Calendar
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewEmployeePage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "Password123", // Default password
        name: "",
        employeeId: "",
        jobTitle: "",
        department: "Engineering",
        role: "EMPLOYEE",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                router.push("/admin/employees");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Link
                href="/admin/employees"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
            >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Directory
            </Link>

            <div>
                <h1 className="text-3xl font-bold">Add New Employee</h1>
                <p className="text-gray-400 mt-2">Create a new account for a staff member.</p>
            </div>

            <div className="bg-[#1a1d23] border border-white/5 rounded-[40px] p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative">
                                <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter full name"
                                    className="w-full bg-[#0f1115] border border-white/5 rounded-2xl p-4 pl-12 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Employee ID</label>
                            <div className="relative">
                                <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    required
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    placeholder="EMP000"
                                    className="w-full bg-[#0f1115] border border-white/5 rounded-2xl p-4 pl-12 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="staff@company.com"
                                    className="w-full bg-[#0f1115] border border-white/5 rounded-2xl p-4 pl-12 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Job Title</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    placeholder="e.g. Sales Manager"
                                    className="w-full bg-[#0f1115] border border-white/5 rounded-2xl p-4 pl-12 font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Department</label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-[#0f1115] border border-white/5 rounded-2xl p-4 font-medium"
                            >
                                <option value="Engineering">Engineering</option>
                                <option value="Product">Product</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                                <option value="HR">HR & Admin</option>
                                <option value="Sales">Sales</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Default Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    readOnly
                                    value={formData.password}
                                    className="w-full bg-[#0f1115] border border-white/5 rounded-2xl p-4 pl-12 font-medium text-gray-500"
                                />
                            </div>
                            <p className="text-[10px] text-gray-600 mt-1">* Employee can change this after first login.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Role</label>
                            <div className="flex gap-4">
                                {["EMPLOYEE", "ADMIN"].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, role: r })}
                                        className={cn(
                                            "flex-1 py-4 border rounded-2xl font-bold transition-all capitalize",
                                            formData.role === r
                                                ? "bg-blue-600/10 border-blue-600 text-blue-400"
                                                : "bg-[#0f1115] border-white/5 text-gray-500 hover:text-white"
                                        )}
                                    >
                                        {r.toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                        Register Staff Member
                    </button>
                </form>
            </div>
        </div>
    );
}
