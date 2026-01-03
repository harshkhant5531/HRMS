"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  CalendarClock,
  FileCheck,
  TrendingUp,
  UserPlus,
  ArrowRight,
  Loader2,
  Check,
  X,
  CreditCard,
  Briefcase
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/admin");
      setStats(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await fetch(`/api/leave/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchStats();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const adminStatsItems = [
    {
      title: "Workforce Size",
      value: stats?.totalEmployees.toString(),
      sub: "Across all departments",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Requests Pending",
      value: stats?.pendingApprovals.toString(),
      sub: "Needs your attention",
      icon: FileCheck,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Absent Today",
      value: stats?.onLeaveToday.toString(),
      sub: "Approved leave requests",
      icon: CalendarClock,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Daily Presence",
      value: `${stats?.avgAttendance}%`,
      sub: "Current office load",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Administration</h1>
          <p className="text-gray-500 mt-2 font-medium">Real-time organizational health and management portal.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/employees/new"
            className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            New Hire
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStatsItems.map((stat, i) => (
          <div key={i} className="bg-[#11141a] border border-white/5 p-8 rounded-[32px] hover:border-white/10 transition-all group shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.title}</p>
            <h3 className="text-4xl font-black mt-2 tracking-tighter text-white">{stat.value}</h3>
            <p className="text-xs text-gray-500 mt-2 font-semibold italic opacity-80">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Activity */}
        <div className="lg:col-span-2 bg-[#11141a] border border-white/5 rounded-[40px] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <CalendarClock className="w-4 h-4 text-indigo-500" />
              </div>
              <h2 className="text-lg font-bold text-white">Today's Check-ins</h2>
            </div>
            <Link href="/admin/attendance" className="text-indigo-400 text-xs font-bold hover:underline tracking-widest uppercase">View Full Logs</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.01] text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                  <th className="px-8 py-5">Personnel</th>
                  <th className="px-8 py-5">Time</th>
                  <th className="px-8 py-5">Health</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.recentAttendance.length === 0 ? (
                  <tr><td colSpan={4} className="px-8 py-12 text-center text-gray-600 font-medium italic">No check-ins recorded for today yet.</td></tr>
                ) : (
                  stats.recentAttendance.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center font-bold text-indigo-400">
                            {row.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-200 text-sm">{row.user.name}</p>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{row.user.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-mono text-xs text-gray-400">{format(new Date(row.checkIn), "hh:mm a")}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">{row.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 rounded-xl text-gray-700 hover:text-white hover:bg-white/5 transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Center */}
        <div className="bg-[#11141a] border border-white/5 rounded-[40px] shadow-sm flex flex-col">
          <div className="p-8 border-b border-white/5 bg-white/[0.01]">
            <h2 className="text-lg font-bold text-white">Review Center</h2>
          </div>
          <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[600px]">
            {stats?.pendingReviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-20 grayscale opacity-40">
                <FileCheck className="w-12 h-12 text-gray-500" />
                <p className="text-gray-500 text-sm font-medium italic">Maintenance complete.<br />No pending reviews.</p>
              </div>
            ) : (
              stats.pendingReviews.map((review: any, i: number) => (
                <div key={i} className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full">{review.type}</span>
                    <span className="text-[10px] text-gray-600 font-bold tracking-tighter">{format(new Date(review.createdAt), "MMM dd")}</span>
                  </div>
                  <h4 className="font-bold text-gray-200 text-sm translate-y-[-2px]">{review.user.name}</h4>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed italic opacity-80">"{review.remarks}"</p>
                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => handleLeaveAction(review.id, "REJECTED")}
                      className="flex-1 py-3 rounded-2xl bg-white/[0.02] text-gray-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all border border-white/5"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleLeaveAction(review.id, "APPROVED")}
                      className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                    >
                      Approve
                    </button>
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
