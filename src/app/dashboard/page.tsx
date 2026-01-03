"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Clock,
    Calendar,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Loader2,
    Trophy,
    Activity,
    CalendarCheck
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function EmployeeDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Auto check-in logic
                await fetch("/api/attendance", { method: "POST" });

                const res = await fetch("/api/dashboard/employee");
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    const welcomeMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="space-y-2">
                    <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">Active Session</p>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">
                        {welcomeMessage()}, {session?.user?.name?.split(" ")[0]}
                    </h1>
                    <p className="text-gray-500 font-medium">Here's your schedule and summary for today.</p>
                </div>
                <div className="flex items-center gap-4 bg-[#11141a] px-6 py-4 rounded-[28px] border border-white/5 shadow-sm overflow-hidden relative group">
                    <div className="absolute inset-0 bg-indigo-500/5 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Entry Logged</p>
                            <p className="text-sm font-bold text-white uppercase">{format(new Date(), "hh:mm a")}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Attendance Summary */}
                <div className="bg-[#11141a] border border-white/5 p-8 rounded-[40px] shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[40px] rounded-full -mr-16 -mt-16" />
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                            <CalendarCheck className="w-5 h-5 text-indigo-500" />
                        </div>
                        <h3 className="font-bold text-lg">Work Presence</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400 font-medium">This Month</p>
                            <p className="text-2xl font-black tracking-tight">{stats?.attendanceCount || 0} <span className="text-xs text-gray-600 font-bold uppercase tracking-widest pl-1">Days</span></p>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                                style={{ width: `${Math.min(((stats?.attendanceCount || 0) / 22) * 100, 100)}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest text-center italic">
                            Expected output: 22 Workdays / Month
                        </p>
                    </div>
                </div>

                {/* Leave Status */}
                <div className="bg-[#11141a] border border-white/5 p-8 rounded-[40px] shadow-sm group">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-500" />
                        </div>
                        <h3 className="font-bold text-lg">Leave Balance</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Approved</p>
                            <p className="text-xl font-bold text-white">{stats?.leaveBalance || 0}</p>
                        </div>
                        <div className="p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Pending</p>
                            <p className="text-xl font-bold text-white">{stats?.pendingLeaves || 0}</p>
                        </div>
                    </div>
                    <Link href="/dashboard/leave" className="mt-8 flex items-center justify-between group/btn text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
                        Apply for Leave
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Recognition / Streak */}
                <div className="bg-[#11141a] border border-white/5 p-8 rounded-[40px] shadow-sm relative group">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-purple-500" />
                        </div>
                        <h3 className="font-bold text-lg">Monthly Performance</h3>
                    </div>
                    <div className="flex items-end gap-2 mb-4">
                        <p className="text-4xl font-black text-white">98%</p>
                        <p className="text-xs text-emerald-500 font-bold mb-1">+2.4%</p>
                    </div>
                    <p className="text-sm text-gray-500 font-medium">Your efficiency score is outstanding this month. Keep it up!</p>
                </div>
            </div>

            {/* Announcements / Upcoming section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                <div className="bg-white/[0.01] border border-white/5 rounded-[48px] p-10">
                    <h2 className="text-xl font-bold text-white mb-6">Upcoming Events</h2>
                    <div className="space-y-6">
                        {[
                            { date: "JAN 15", event: "Annual Strategy Meet", time: "10:00 AM" },
                            { date: "JAN 28", event: "Team Building Excursion", time: "09:00 AM" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 group cursor-default">
                                <div className="w-16 h-16 rounded-3xl bg-[#11141a] border border-white/5 flex flex-col items-center justify-center text-center group-hover:border-indigo-500/30 transition-all">
                                    <span className="text-[10px] text-indigo-500 font-black uppercase tracking-tighter leading-none">{item.date.split(" ")[0]}</span>
                                    <span className="text-lg font-black text-white leading-none mt-1">{item.date.split(" ")[1]}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-200 truncate">{item.event}</h4>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{item.time}</p>
                                </div>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-indigo-500 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[48px] p-12 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10 space-y-6 h-full flex flex-col justify-end">
                        <h2 className="text-3xl font-black text-white tracking-tight leading-[0.9]">
                            View your <br /> latest earnings.
                        </h2>
                        <p className="text-indigo-100/60 font-medium text-sm max-w-xs">
                            Performance reports and salary slips for DEC 2025 are now generated and available.
                        </p>
                        <Link href="/dashboard/payroll" className="w-fit px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 transition-all active:scale-95 shadow-xl shadow-black/20">
                            View Payroll
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
