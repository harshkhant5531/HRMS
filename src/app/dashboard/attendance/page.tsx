"use client";

import { useEffect, useState } from "react";
import { Clock, Play, Square, Calendar as CalendarIcon, Loader2, History, Timer } from "lucide-react";
import { format } from "date-fns";

export default function AttendancePage() {
    const [attendance, setAttendance] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const init = async () => {
            await Promise.all([fetchAttendance(), fetchHistory()]);
            setLoading(false);
        };
        init();
        const interval = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const fetchAttendance = async () => {
        try {
            const res = await fetch("/api/attendance");
            const data = await res.json();
            setAttendance(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch("/api/attendance?history=true");
            const data = await res.json();
            setHistory(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAction = async (action: "check-in" | "check-out") => {
        setActionLoading(true);
        try {
            const res = await fetch("/api/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            if (res.ok) {
                await Promise.all([fetchAttendance(), fetchHistory()]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Time Tracking</p>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">Work Presence</h1>
                    <p className="text-gray-500 mt-2 font-medium">Log your daily hours and monitor performance.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#11141a] border border-white/5 rounded-2xl">
                    <Timer className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-gray-400">Policy: 8h Shift + 1h Break</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Center */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-[#11141a] border border-white/5 p-10 rounded-[48px] shadow-sm relative overflow-hidden text-center group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative">
                            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-8 border border-indigo-500/10">
                                <Clock className="w-8 h-8 text-indigo-500" />
                            </div>

                            <h2 className="text-6xl font-black tracking-tighter text-white mb-2">
                                {format(currentTime, "HH:mm")}
                                <span className="text-2xl text-gray-700 ml-1">{format(currentTime, ":ss")}</span>
                            </h2>
                            <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">
                                {format(currentTime, "EEEE, MMMM do")}
                            </p>

                            <div className="mt-12 space-y-4">
                                {!attendance?.checkIn ? (
                                    <button
                                        onClick={() => handleAction("check-in")}
                                        disabled={actionLoading}
                                        className="w-full bg-white text-black hover:bg-gray-100 disabled:opacity-50 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-white/5"
                                    >
                                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                                        Initialize Shift
                                    </button>
                                ) : !attendance?.checkOut ? (
                                    <button
                                        onClick={() => handleAction("check-out")}
                                        disabled={actionLoading}
                                        className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] text-white"
                                    >
                                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Square className="w-4 h-4 fill-current" />}
                                        Terminate Shift
                                    </button>
                                ) : (
                                    <div className="bg-white/[0.02] border border-white/5 py-5 rounded-[24px] text-emerald-500 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> Shift Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#11141a] border border-white/5 rounded-[40px] p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <History className="w-4 h-4 text-gray-500" />
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Session Timeline</h3>
                        </div>
                        <div className="space-y-6 pt-4">
                            <div className="flex justify-between items-center group pl-4 border-l-2 border-indigo-500/20 hover:border-indigo-500 transition-all">
                                <div>
                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Clock-in</p>
                                    <p className="font-bold text-gray-200 text-lg">
                                        {attendance?.checkIn ? format(new Date(attendance.checkIn), "hh:mm a") : "--:--"}
                                    </p>
                                </div>
                                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">START</span>
                            </div>
                            <div className="flex justify-between items-center group pl-4 border-l-2 border-red-500/20 hover:border-red-500 transition-all">
                                <div>
                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Clock-out</p>
                                    <p className="font-bold text-gray-200 text-lg">
                                        {attendance?.checkOut ? format(new Date(attendance.checkOut), "hh:mm a") : "--:--"}
                                    </p>
                                </div>
                                <span className="p-2 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-bold">END</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance History */}
                <div className="lg:col-span-2 bg-[#11141a] border border-white/5 rounded-[48px] shadow-sm flex flex-col">
                    <div className="p-10 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.02] flex items-center justify-center">
                                <CalendarIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Monthly Ledger</h2>
                        </div>
                        <div className="flex gap-2">
                            {["WORKDAYS", "LEAVES", "ABSENCES"].map((label, i) => (
                                <span key={i} className="px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full text-[8px] font-black text-gray-600 uppercase tracking-widest">{label}</span>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 p-6 space-y-3 overflow-y-auto max-h-[700px]">
                        {history.length === 0 ? (
                            <div className="py-40 text-center space-y-4 opacity-30 grayscale">
                                <CalendarIcon className="w-12 h-12 mx-auto text-gray-500" />
                                <p className="text-gray-500 font-medium italic">No ledger records found for Jan 2026.</p>
                            </div>
                        ) : (
                            history.map((log, i) => (
                                <div key={i} className="flex items-center gap-8 p-6 rounded-[32px] bg-white/[0.01] hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all group">
                                    <div className="w-14 h-14 rounded-2xl bg-[#0a0c10] flex flex-col items-center justify-center border border-white/5 shrink-0 group-hover:border-indigo-500/30 transition-all">
                                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-tighter leading-none">{format(new Date(log.date), "MMM")}</p>
                                        <p className="text-xl font-black text-white leading-none mt-1">{format(new Date(log.date), "dd")}</p>
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 items-center">
                                        <div>
                                            <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1.5 flex items-center gap-1.5 italic">
                                                <span className="w-1 h-1 rounded-full bg-indigo-500" /> In
                                            </p>
                                            <p className="text-sm font-bold text-gray-300">
                                                {log.checkIn ? format(new Date(log.checkIn), "hh:mm a") : "---"}
                                            </p>
                                        </div>
                                        <div className="hidden md:block">
                                            <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1.5 flex items-center gap-1.5 italic">
                                                <span className="w-1 h-1 rounded-full bg-red-500" /> Out
                                            </p>
                                            <p className="text-sm font-bold text-gray-300">
                                                {log.checkOut ? format(new Date(log.checkOut), "hh:mm a") : "---"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border ${log.status === 'ABSENT'
                                                    ? 'text-red-500 bg-red-500/5 border-red-500/10'
                                                    : log.status === 'LEAVE'
                                                        ? 'text-amber-500 bg-amber-500/5 border-amber-500/10'
                                                        : 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const CheckCircle2 = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" />
    </svg>
);
