"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
    Calendar,
    Clock,
    FileText,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function EmployeeDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initDashboard = async () => {
            try {
                const res = await fetch("/api/dashboard/employee");
                const data = await res.json();
                setStats(data);

                // Auto Check-in Logic
                if (!data.attendance) {
                    console.log("Auto checking in...");
                    await fetch("/api/attendance", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "check-in" }),
                    });
                    // Re-fetch to update UI
                    const updatedRes = await fetch("/api/dashboard/employee");
                    setStats(await updatedRes.json());
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (session) initDashboard();
    }, [session]);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    const cards = [
        {
            title: "Today's Status",
            value: stats?.attendance?.checkIn ? "Present" : "Checking in...",
            sub: stats?.attendance?.checkIn
                ? `Checked in at ${format(new Date(stats.attendance.checkIn), "hh:mm a")}`
                : "Automated check-in in progress",
            icon: CheckCircle2,
            color: "text-green-400",
            bg: "bg-green-400/10",
        },
        {
            title: "Leave Balance",
            value: `${stats?.leaveBalance} Days`,
            sub: "Available for this year",
            icon: Calendar,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            title: "Pending Requests",
            value: `${stats?.pendingRequests} Request(s)`,
            sub: "Awaiting HR approval",
            icon: Clock,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Good morning, {session?.user?.name || "Employee"}!</h1>
                <p className="text-gray-400 mt-2">Your automated workday has started.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((stat, i) => (
                    <div key={i} className="bg-[#1a1d23] border border-white/5 p-6 rounded-3xl relative group overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-3xl -mr-8 -mt-8 group-hover:scale-110 transition-transform`} />

                        <div className="relative flex flex-col gap-4">
                            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                                <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                                <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#1a1d23] border border-white/5 p-8 rounded-[32px] space-y-6">
                    <h2 className="text-xl font-bold">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/dashboard/leave" className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                <Calendar className="w-6 h-6 text-blue-400" />
                            </div>
                            <span className="text-sm font-bold">Apply Leave</span>
                        </Link>
                        <Link href="/dashboard/payroll" className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group">
                            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                <FileText className="w-6 h-6 text-purple-400" />
                            </div>
                            <span className="text-sm font-bold">Payslips</span>
                        </Link>
                    </div>
                </div>

                <div className="bg-[#1a1d23] border border-white/5 p-8 rounded-[32px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Recent Updates</h2>
                    </div>
                    <div className="space-y-4">
                        {stats?.recentUpdates?.length === 0 ? (
                            <p className="text-gray-500 text-center py-10 italic">No recent updates.</p>
                        ) : (
                            stats.recentUpdates.map((update: any, i: number) => (
                                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 active:scale-[0.98] transition-all cursor-pointer">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${update.status === 'APPROVED' ? 'bg-green-500/10' : update.status === 'REJECTED' ? 'bg-red-500/10' : 'bg-blue-500/10'
                                        }`}>
                                        <AlertCircle className={`w-5 h-5 ${update.status === 'APPROVED' ? 'text-green-500' : update.status === 'REJECTED' ? 'text-red-500' : 'text-blue-500'
                                            }`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-200">
                                            Leave request for {format(new Date(update.startDate), "MMM dd")} is <span className="font-bold">{update.status}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{format(new Date(update.updatedAt), "HH:mm a, MMM dd")}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-600 self-center" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
