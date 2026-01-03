"use client";

import { useEffect, useState } from "react";
import {
    CreditCard,
    Download,
    TrendingDown,
    TrendingUp,
    Loader2,
    FileText,
    BadgeCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PayrollPage() {
    const [payrolls, setPayrolls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayrolls();
    }, []);

    const fetchPayrolls = async () => {
        try {
            const res = await fetch("/api/payroll");
            const data = await res.json();
            setPayrolls(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Payroll & Salary</h1>
                <p className="text-gray-400 mt-2">View your compensation history and slips.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Latest Summary Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1a1d23] border border-white/5 p-8 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />

                        <BadgeCheck className="w-12 h-12 text-green-400 mb-6" />
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Latest Net Salary</p>
                        <h2 className="text-5xl font-mono font-bold tracking-tighter mt-2">
                            ${payrolls[0]?.netSalary?.toLocaleString() || "0.00"}
                        </h2>
                        <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-green-400">
                            <span className="bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">PAID</span>
                            <span className="text-gray-500">• {months[payrolls[0]?.month - 1]} {payrolls[0]?.year}</span>
                        </div>

                        <button className="w-full mt-10 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all active:scale-[0.98]">
                            <Download className="w-5 h-5" />
                            Download Slip
                        </button>
                    </div>

                    <div className="bg-[#1a1d23] border border-white/5 p-8 rounded-[40px] space-y-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Current Breakdown</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg"><TrendingUp className="w-4 h-4 text-blue-400" /></div>
                                    <span className="text-sm text-gray-300">Base Salary</span>
                                </div>
                                <span className="font-mono font-bold">${payrolls[0]?.baseSalary?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/10 rounded-lg"><TrendingDown className="w-4 h-4 text-red-500" /></div>
                                    <span className="text-sm text-gray-300">Deductions</span>
                                </div>
                                <span className="font-mono font-bold">-${payrolls[0]?.deductions?.toLocaleString() || "0"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment History List */}
                <div className="lg:col-span-2 bg-[#1a1d23] border border-white/5 rounded-[40px] p-8">
                    <h2 className="text-xl font-bold mb-8">Payment History</h2>

                    {payrolls.length === 0 ? (
                        <div className="p-20 text-center text-gray-500 italic">No payroll records found.</div>
                    ) : (
                        <div className="space-y-4">
                            {payrolls.map((payroll, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-[#0f1115] flex flex-col items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-colors">
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{payroll.year}</span>
                                            <span className="text-xs font-black text-blue-400 uppercase">{months[payroll.month - 1]}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-200">Monthly Compensation</p>
                                            <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">ID: PY{payroll.id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div className="text-right flex items-center gap-8">
                                        <div className="hidden sm:block">
                                            <p className="text-xs text-gray-500 font-bold tracking-tighter uppercase mb-1">Net Paid</p>
                                            <p className="font-mono font-bold text-lg text-white">${payroll.netSalary.toLocaleString()}</p>
                                        </div>
                                        <button className="p-3 rounded-xl bg-white/5 hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-all">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
