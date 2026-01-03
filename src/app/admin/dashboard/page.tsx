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
  X
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
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  const adminStatsItems = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees.toString(),
      sub: "Active staff members",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      title: "Pending Approvals",
      value: stats?.pendingApprovals.toString(),
      sub: "Review required",
      icon: FileCheck,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
    {
      title: "On Leave Today",
      value: stats?.onLeaveToday.toString(),
      sub: "Approved requests",
      icon: CalendarClock,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      title: "Real-time Attendance",
      value: `${stats?.avgAttendance}%`,
      sub: "Checked in today",
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Central</h1>
          <p className="text-gray-400 mt-2">Organization overview and quick management.</p>
        </div>
        <Link
          href="/admin/employees/new"
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Add Employee
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStatsItems.map((stat, i) => (
          <div key={i} className="bg-[#1a1d23] border border-white/5 p-8 rounded-[32px] group relative overflow-hidden transition-all hover:border-blue-500/20">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-[60px] -mr-8 -mt-8`} />
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.title}</p>
            <h3 className="text-3xl font-bold mt-2 tracking-tight">{stat.value}</h3>
            <p className="text-xs text-gray-400 mt-1 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Attendance */}
        <div className="lg:col-span-2 bg-[#1a1d23] border border-white/5 rounded-[40px] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Today's Check-ins</h2>
            <Link href="/admin/attendance" className="text-blue-400 text-sm font-bold hover:text-blue-300">Detailed Log</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-5">Employee</th>
                  <th className="px-8 py-5">Check-in Time</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {stats?.recentAttendance.length === 0 ? (
                  <tr><td colSpan={4} className="px-8 py-10 text-center text-gray-500 italic">No activity yet today.</td></tr>
                ) : (
                  stats.recentAttendance.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center font-bold text-blue-400">
                            {row.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-200">{row.user.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{row.user.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-mono text-gray-300">{format(new Date(row.checkIn), "hh:mm a")}</td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 rounded-xl text-gray-600 hover:text-white hover:bg-white/5 transition-all">
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

        {/* Pending Actions */}
        <div className="bg-[#1a1d23] border border-white/5 rounded-[40px] p-8 space-y-8">
          <h2 className="text-xl font-bold">Pending Review</h2>
          <div className="space-y-4">
            {stats?.pendingReviews.length === 0 ? (
              <p className="text-gray-500 text-center py-10 italic">All caught up!</p>
            ) : (
              stats.pendingReviews.map((review: any, i: number) => (
                <div key={i} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2 py-1 rounded-lg">{review.type}</span>
                    <span className="text-[10px] text-gray-500 font-bold">{format(new Date(review.createdAt), "MMM dd")}</span>
                  </div>
                  <p className="font-bold text-gray-200">{review.user.name}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 italic">"{review.remarks}"</p>
                  <div className="flex gap-2 mt-6">
                    <button 
                      onClick={() => handleLeaveAction(review.id, "REJECTED")}
                      className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleLeaveAction(review.id, "APPROVED")}
                      className="flex-1 py-3 rounded-xl bg-green-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-500 transition-all shadow-lg shadow-green-600/20"
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
