"use client";

import { useEffect, useState } from "react";
import {
    Calendar as CalendarIcon,
    Search,
    Filter,
    Download,
    Loader2,
    MoreVertical,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function AdminAttendancePage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchLogs();
    }, [date]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/attendance?date=${date}`);
            const data = await res.json();
            setLogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.user.name.toLowerCase().includes(search.toLowerCase()) ||
        log.user.employeeId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Attendance Logs</h1>
                    <p className="text-gray-400 mt-1">Review organizational presence for {format(new Date(date), "MMMM dd, yyyy")}.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-[#1a1d23] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-bold"
                        />
                    </div>
                    <button className="bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-2xl text-gray-400 transition-all group">
                        <Download className="w-5 h-5 group-active:scale-90" />
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-[#1a1d23] border border-white/5 p-4 rounded-[28px]">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#0f1115] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#0f1115] border border-white/5 rounded-2xl text-sm font-bold text-gray-400 hover:text-white transition-all">
                    <Filter className="w-4 h-4" /> Filter By Dept
                </button>
            </div>

            {/* Main Table */}
            <div className="bg-[#1a1d23] border border-white/5 rounded-[40px] overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                        <p className="text-gray-500 animate-pulse font-bold tracking-widest text-[10px] uppercase">Fetching Registers...</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-[#0f1115] text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-6">Staff Member</th>
                                <th className="px-8 py-6">Check In</th>
                                <th className="px-8 py-6">Check Out</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-gray-600 italic">No attendance records found for this criteria.</td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-[#0f1115] flex items-center justify-center font-bold text-blue-400 border border-white/5">
                                                    {log.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-200">{log.user.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{log.user.employeeId}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                                                        <span className="text-[10px] text-blue-500/70 font-bold uppercase tracking-widest">{log.user.department || "General"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-300 font-mono">
                                                <Clock className="w-3.5 h-3.5 text-green-500/50" />
                                                {log.checkIn ? format(new Date(log.checkIn), "hh:mm a") : "---"}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-300 font-mono">
                                                <Clock className="w-3.5 h-3.5 text-red-500/50" />
                                                {log.checkOut ? format(new Date(log.checkOut), "hh:mm a") : "---"}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border flex items-center gap-2 w-fit",
                                                log.status === 'PRESENT' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                    log.status === 'LEAVE' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                            )}>
                                                {log.status === 'PRESENT' && <CheckCircle2 className="w-3 h-3" />}
                                                {log.status === 'ABSENT' && <XCircle className="w-3 h-3" />}
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
