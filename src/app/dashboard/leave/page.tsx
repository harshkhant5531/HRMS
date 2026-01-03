"use client";

import { useEffect, useState } from "react";
import {
    Calendar,
    Plus,
    Send,
    History,
    Loader2,
    AlertCircle,
    FileText
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function LeavePage() {
    const [leaves, setLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: "PAID",
        startDate: "",
        endDate: "",
        remarks: "",
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await fetch("/api/leave");
            const data = await res.json();
            setLeaves(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch("/api/leave", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setShowForm(false);
                setFormData({ type: "PAID", startDate: "", endDate: "", remarks: "" });
                fetchLeaves();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Leave Management</h1>
                    <p className="text-gray-400 mt-2">Request time off and track status.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg",
                        showForm
                            ? "bg-white/5 border border-white/10 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20"
                    )}
                >
                    {showForm ? "Cancel" : <><Plus className="w-5 h-5" /> New Request</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Form Section */}
                {showForm && (
                    <div className="lg:col-span-1 bg-[#1a1d23] border border-white/5 p-8 rounded-3xl sticky top-8 animate-in fade-in slide-in-from-left-4">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-blue-400" />
                            Apply Form
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Leave Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-[#0f1115] border border-white/5 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    <option value="PAID">Paid Leave</option>
                                    <option value="SICK">Sick Leave</option>
                                    <option value="UNPAID">Unpaid Leave</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Start Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full bg-[#0f1115] border border-white/5 rounded-xl p-3 text-sm focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">End Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full bg-[#0f1115] border border-white/5 rounded-xl p-3 text-sm focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Remarks</label>
                                <textarea
                                    rows={3}
                                    value={formData.remarks}
                                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                                    placeholder="Reason for leave..."
                                    className="w-full bg-[#0f1115] border border-white/5 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                                />
                            </div>

                            <button
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                                Submit Request
                            </button>
                        </form>
                    </div>
                )}

                {/* History Section */}
                <div className={cn("space-y-4", showForm ? "lg:col-span-2" : "lg:col-span-3")}>
                    <div className="bg-[#1a1d23] border border-white/5 rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Request History</h2>
                        </div>

                        {leaves.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                                    <FileText className="w-8 h-8 text-gray-600" />
                                </div>
                                <p className="text-gray-500">No leave requests found.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {leaves.map((leave, i) => (
                                    <div key={i} className="p-6 hover:bg-white/[0.02] transition-colors group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                                    leave.status === 'APPROVED' ? 'bg-green-500/10' :
                                                        leave.status === 'REJECTED' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                                                )}>
                                                    <Calendar className={cn(
                                                        "w-6 h-6",
                                                        leave.status === 'APPROVED' ? 'text-green-400' :
                                                            leave.status === 'REJECTED' ? 'text-red-400' : 'text-yellow-400'
                                                    )} />
                                                </div>
                                                <div>
                                                    <p className="font-bold flex items-center gap-2">
                                                        {leave.type} LEAVE
                                                        <span className={cn(
                                                            "text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest",
                                                            leave.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                                                leave.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-500'
                                                        )}>
                                                            {leave.status}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {format(new Date(leave.startDate), "MMM dd")} - {format(new Date(leave.endDate), "MMM dd, yyyy")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-left md:text-right">
                                                <p className="text-xs text-gray-500 italic">" {leave.remarks || "No remarks"} "</p>
                                                {leave.adminComment && (
                                                    <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-2 justify-end">
                                                        <AlertCircle className="w-3 h-3 text-blue-400" />
                                                        Admin: {leave.adminComment}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
