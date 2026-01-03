"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    Mail,
    Phone,
    Grid,
    List as ListIcon,
    Loader2,
    UserPlus,
    Briefcase,
    Calendar
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch("/api/admin/employees");
            const data = await res.json();
            setEmployees(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(search.toLowerCase()) ||
        emp.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
        emp.jobTitle?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                   <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Personnel Management</p>
                   <h1 className="text-3xl font-extrabold tracking-tight text-white">Employee Directory</h1>
                   <p className="text-gray-500 mt-2 font-medium">Detailed overview of the current organization workforce.</p>
                </div>
                <Link
                    href="/admin/employees/new"
                    className="bg-white text-black hover:bg-gray-100 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                    <UserPlus className="w-4 h-4" />
                    Board New Member
                </Link>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-[#11141a] border border-white/5 p-4 rounded-[32px] shadow-sm">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Filter by name, ID, or position..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent border-none rounded-2xl py-4 pl-14 pr-8 text-sm focus:outline-none focus:ring-0 text-white placeholder:text-gray-600 font-semibold"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto pr-2">
                    <button className="flex items-center gap-3 px-6 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">
                        <Filter className="w-4 h-4" /> Refine
                    </button>
                    <div className="bg-white/[0.02] p-2 rounded-2xl border border-white/5 flex gap-1">
                        <button
                            onClick={() => setView("grid")}
                            className={cn("p-2 rounded-xl transition-all", view === "grid" ? "bg-white/10 text-white" : "text-gray-600 hover:text-gray-400")}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setView("list")}
                            className={cn("p-2 rounded-xl transition-all", view === "list" ? "bg-white/10 text-white" : "text-gray-600 hover:text-gray-400")}
                        >
                            <ListIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {view === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredEmployees.map((emp) => (
                        <div key={emp.id} className="bg-[#11141a] border border-white/5 p-8 rounded-[40px] group hover:border-indigo-500/20 transition-all relative overflow-hidden flex flex-col items-center text-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />

                            <div className="relative mb-6">
                                <div className="w-24 h-24 rounded-[35%] bg-indigo-500/10 p-1">
                                    <div className="w-full h-full rounded-[33%] bg-[#11141a] border border-white/5 flex items-center justify-center text-2xl font-black text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                                        {emp.name?.charAt(0)}
                                    </div>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#11141a]" />
                            </div>

                            <h3 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors tracking-tight uppercase">{emp.name}</h3>
                            <p className="text-xs text-gray-500 font-bold mt-1.5 flex items-center gap-1.5 uppercase tracking-widest"><Briefcase className="w-3 h-3 text-gray-700" /> {emp.jobTitle || "Freelance"}</p>
                            <p className="text-[10px] text-gray-700 font-black tracking-[0.2em] mt-1 uppercase">{emp.department || "Remote"}</p>

                            <div className="w-full mt-8 space-y-2">
                                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                                    <Mail className="w-3.5 h-3.5 text-gray-700" />
                                    <span className="truncate">{emp.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
                                    <Phone className="w-3.5 h-3.5 text-gray-700" />
                                    <span>{emp.phone || "No direct link"}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 w-full flex items-center justify-between text-gray-600 text-[10px] font-black uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {format(new Date(emp.joiningDate), "MMM yyyy")}</span>
                                <span className="bg-white/5 text-gray-400 px-3 py-1.5 rounded-xl border border-white/5">{emp.employeeId}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-[#11141a] border border-white/5 rounded-[48px] shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.01] text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                            <tr>
                                <th className="px-10 py-6">Member Information</th>
                                <th className="px-10 py-6">Role & Status</th>
                                <th className="px-10 py-6">Communications</th>
                                <th className="px-10 py-6">Joining Date</th>
                                <th className="px-10 py-6 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center font-black text-indigo-400 border border-indigo-500/10">
                                                {emp.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-200 text-base">{emp.name}</p>
                                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{emp.employeeId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <p className="text-gray-300 font-bold text-sm uppercase tracking-tight">{emp.jobTitle || "---"}</p>
                                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{emp.department || "General"}</p>
                                    </td>
                                    <td className="px-10 py-6 space-y-1">
                                        <p className="text-xs text-gray-500 font-medium">{emp.email}</p>
                                        <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">{emp.phone || "---"}</p>
                                    </td>
                                    <td className="px-10 py-6 text-gray-500 font-bold text-sm tracking-tight">
                                        {format(new Date(emp.joiningDate), "MMMM dd, yyyy")}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="p-3 rounded-2xl text-gray-700 hover:text-white hover:bg-white/5 transition-all">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
