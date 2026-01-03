"use client";

import { useEffect, useState } from "react";
import {
    Check,
    X,
    MessageSquare,
    User,
    Calendar,
    Loader2,
    Filter,
    Search
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function LeaveApprovalPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/leave");
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
        setProcessingId(id);
        try {
            const res = await fetch(`/api/leave/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, adminComment: comment }),
            });
            if (res.ok) {
                setComment("");
                fetchRequests();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    const pendingRequests = requests.filter(r => r.status === "PENDING");
    const processedRequests = requests.filter(r => r.status !== "PENDING");

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Leave Approvals</h1>
                <p className="text-gray-400 mt-2">Review and manage employee time-off requests.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Pending Requests Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            Pending <span className="bg-blue-600 text-xs px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
                        </h2>
                    </div>

                    {pendingRequests.length === 0 ? (
                        <div className="bg-[#1a1d23] border border-white/5 p-12 rounded-3xl text-center">
                            <p className="text-gray-500">All caught up! No pending requests.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {pendingRequests.map((request) => (
                                <div key={request.id} className="bg-[#1a1d23] border border-white/5 rounded-3xl p-6 hover:border-blue-500/30 transition-all group">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex items-center gap-4 shrink-0">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xl">
                                                {request.user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg">{request.user.name}</p>
                                                <p className="text-sm text-gray-500">{request.user.employeeId}</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-3">
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-xl">
                                                    <Calendar className="w-4 h-4 text-blue-400" />
                                                    {format(new Date(request.startDate), "MMM dd")} - {format(new Date(request.endDate), "MMM dd, yyyy")}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1.5 rounded-xl">
                                                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                                                    {request.type}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-300 italic bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                                "{request.remarks || "No remarks provided"}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center">
                                        <div className="relative flex-1 w-full">
                                            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="text"
                                                placeholder="Add a comment..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="w-full bg-[#0f1115] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                            />
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <button
                                                onClick={() => handleUpdate(request.id, "REJECTED")}
                                                disabled={!!processingId}
                                                className="flex-1 md:flex-none px-6 py-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 font-bold transition-all disabled:opacity-50"
                                            >
                                                {processingId === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(request.id, "APPROVED")}
                                                disabled={!!processingId}
                                                className="flex-1 md:flex-none px-8 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {processingId === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                Approve
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent History Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-xl font-bold">Recent Status</h2>
                    <div className="bg-[#1a1d23] border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
                        {processedRequests.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm italic">
                                No processed requests yet.
                            </div>
                        ) : (
                            processedRequests.slice(0, 5).map((r) => (
                                <div key={r.id} className="p-4 hover:bg-white/[0.02] transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="font-medium text-sm">{r.user.name}</p>
                                        <span className={cn(
                                            "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase",
                                            r.status === 'APPROVED' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                        )}>
                                            {r.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {format(new Date(r.startDate), "MMM dd")} - {format(new Date(r.endDate), "MMM dd")}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
