"use client";

import { useEffect, useState } from "react";
import { Clock, Play, Square, Calendar as CalendarIcon, Loader2 } from "lucide-react";
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
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Attendance</h1>
                <p className="text-gray-400 mt-2">Track your daily working hours.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Real-time Clock & Action */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#1a1d23] border border-white/5 p-8 rounded-[40px] text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full -mr-16 -mt-16" />

                        <div className="relative">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Live Time
                            </div>
                            <h2 className="text-6xl font-mono font-bold tracking-tighter mb-2 text-white">
                                {format(currentTime, "HH:mm:ss")}
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                                {format(currentTime, "EEEE, MMMM do")}
                            </p>

                            <div className="mt-12 space-y-4">
                                {!attendance?.checkIn ? (
                                    <button
                                        onClick={() => handleAction("check-in")}
                                        disabled={actionLoading}
                                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
                                    >
                                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                                        Start Working
                                    </button>
                                ) : !attendance?.checkOut ? (
                                    <button
                                        onClick={() => handleAction("check-out")}
                                        disabled={actionLoading}
                                        className="w-full bg-red-500 hover:bg-red-400 disabled:opacity-50 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-red-500/20 active:scale-[0.98]"
                                    >
                                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Square className="w-5 h-5 fill-current" />}
                                        End Work Day
                                    </button>
                                ) : (
                                    <div className="bg-white/5 border border-white/10 py-5 rounded-2xl text-gray-400 font-black uppercase tracking-widest text-xs">
                                        Shift Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1a1d23] border border-white/5 p-8 rounded-[40px] space-y-6">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Today's Activity</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center group">
                                <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">Shift Start</span>
                                <span className="font-mono text-blue-400 font-bold text-lg">
                                    {attendance?.checkIn ? format(new Date(attendance.checkIn), "hh:mm a") : "--:--"}
                                </span>
                            </div>
                            <div className="w-full h-px bg-white/5" />
                            <div className="flex justify-between items-center group">
                                <span className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">Shift End</span>
                                <span className="font-mono text-red-500 font-bold text-lg">
                                    {attendance?.checkOut ? format(new Date(attendance.checkOut), "hh:mm a") : "--:--"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History View */}
                <div className="lg:col-span-2 bg-[#1a1d23] border border-white/5 rounded-[40px] p-8">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-xl font-bold">Shift History</h2>
                        <button className="p-3 rounded-2xl bg-white/5 hover:bg-blue-600/20 text-gray-500 hover:text-blue-400 transition-all border border-white/5">
                            <CalendarIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {history.length === 0 ? (
                            <p className="text-gray-500 text-center py-20 italic">No historical records found.</p>
                        ) : (
                            history.map((log, i) => (
                                <div key={i} className="flex items-center gap-6 p-5 rounded-3xl hover:bg-white/[0.02] border border-transparent hover:border-white/5 transition-all group">
                                    <div className="w-16 h-16 rounded-2xl bg-[#0f1115] flex flex-col items-center justify-center border border-white/5 shrink-0">
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{format(new Date(log.date), "MMM")}</p>
                                        <p className="text-xl font-black text-blue-400">{format(new Date(log.date), "dd")}</p>
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6 items-center">
                                        <div>
                                            <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">In</p>
                                            <p className="text-base font-mono font-bold text-gray-300">
                                                {log.checkIn ? format(new Date(log.checkIn), "hh:mm a") : "---"}
                                            </p>
                                        </div>
                                        <div className="hidden lg:block">
                                            <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">Out</p>
                                            <p className="text-base font-mono font-bold text-gray-300">
                                                {log.checkOut ? format(new Date(log.checkOut), "hh:mm a") : "---"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl border ${log.status === 'ABSENT' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-green-400 bg-green-400/10 border-green-500/20'
                                                }`}>
                                                {log.status === 'LEAVE' ? 'ON LEAVE' : log.status}
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
