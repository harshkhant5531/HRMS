"use client";

import { useEffect, useState } from "react";
import {
    CreditCard,
    Plus,
    Search,
    Loader2,
    DollarSign,
    ArrowUpRight,
    User,
    Filter,
    Download
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generatePayrollPDF } from "@/lib/pdf-generator";

export default function AdminPayrollPage() {
    const [payrolls, setPayrolls] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        userId: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        baseSalary: "",
        deductions: "0",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [pRes, eRes] = await Promise.all([
                fetch("/api/payroll"),
                fetch("/api/admin/employees")
            ]);
            setPayrolls(await pRes.json());
            setEmployees(await eRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/payroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowModal(false);
                fetchData();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Payroll Control</h1>
                    <p className="text-gray-400 mt-2">Oversee organization-wide compensation and salary logs.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Update Payroll
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payroll History Table */}
                <div className="md:col-span-2 bg-[#1a1d23] border border-white/5 rounded-[40px] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Organization Logs</h2>
                        <div className="flex gap-2">
                            <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-gray-400 hover:text-white transition-all"><Filter className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#0f1115] text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-8 py-6">Staff Member</th>
                                    <th className="px-8 py-6">Period</th>
                                    <th className="px-8 py-6">Base Salary</th>
                                    <th className="px-8 py-6">Net Paid</th>
                                    <th className="px-8 py-6">Status</th>
                                    <th className="px-8 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {payrolls.map((payroll, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center font-bold text-blue-400">
                                                    {payroll.user.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-200">{payroll.user.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{payroll.user.jobTitle || "---"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-gray-400">{months[payroll.month - 1]} {payroll.year}</span>
                                        </td>
                                        <td className="px-8 py-6 text-gray-400 font-mono">${payroll.baseSalary.toLocaleString()}</td>
                                        <td className="px-8 py-6">
                                            <p className="font-mono font-bold text-white text-lg">${payroll.netSalary.toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="bg-green-500/10 text-green-400 text-[10px] font-bold px-3 py-1 rounded-full border border-green-500/20">PAID</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => generatePayrollPDF(payroll)}
                                                className="p-3 rounded-xl bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-all border border-white/5"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Update Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#0f1115]/80 backdrop-blur-2xl" onClick={() => setShowModal(false)} />
                    <div className="relative w-full max-w-xl bg-[#1a1d23] border border-white/10 rounded-[40px] p-10 shadow-3xl animate-in zoom-in-95">
                        <h2 className="text-3xl font-bold mb-8">Update Salary Record</h2>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Staff Member</label>
                                    <select
                                        required
                                        value={formData.userId}
                                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                        className="w-full bg-[#0f1115] border border-white/5 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500/30 transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Month</label>
                                    <select
                                        value={formData.month}
                                        onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                                        className="w-full bg-[#0f1115] border border-white/5 rounded-2xl p-4 font-medium"
                                    >
                                        {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Year</label>
                                    <input
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                        className="w-full bg-[#0f1115] border border-white/5 rounded-2xl p-4 font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Base Salary</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="number"
                                            required
                                            value={formData.baseSalary}
                                            onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                                            placeholder="e.g. 5000"
                                            className="w-full bg-[#0f1115] border border-white/5 rounded-2xl p-4 pl-10 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Deductions</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="number"
                                            value={formData.deductions}
                                            onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                                            placeholder="e.g. 200"
                                            className="w-full bg-[#0f1115] border border-white/5 rounded-2xl p-4 pl-10 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                                >
                                    {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                                    Confirm Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
