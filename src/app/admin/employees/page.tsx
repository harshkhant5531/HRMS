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
    UserPlus
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
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-display tracking-tight text-white">Employee Directory</h1>
                    <p className="text-gray-400 mt-2 font-medium">Manage and view all registered staff members.</p>
                </div>
                <Link
                    href="/admin/employees/new"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                >
                    <UserPlus className="w-5 h-5" />
                    Add Employee
                </Link>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-[#1a1d23] border border-white/5 p-4 rounded-[28px]">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by name, ID, or position..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#0f1115] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex items-center gap-2 px-4 py-3 bg-[#0f1115] border border-white/5 rounded-2xl text-sm font-bold text-gray-400 hover:text-white transition-all">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <div className="bg-[#0f1115] p-1 rounded-2xl border border-white/5 flex">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredEmployees.map((emp) => (
                        <div key={emp.id} className="bg-[#1a1d23] border border-white/5 p-6 rounded-[32px] group hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 blur-[60px] rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-[35%] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 p-px mb-4">
                                    <div className="w-full h-full rounded-[34%] bg-[#1a1d23] flex items-center justify-center text-2xl font-bold bg-white/5">
                                        {emp.name?.charAt(0)}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{emp.name}</h3>
                                <p className="text-sm text-gray-400 font-medium mt-1">{emp.jobTitle || "Not Assigned"}</p>
                                <p className="text-[10px] text-gray-600 font-bold tracking-widest mt-0.5 uppercase">{emp.department || "General"}</p>

                                <div className="w-full mt-6 space-y-3">
                                    <div className="flex items-center gap-3 text-xs text-gray-500 bg-white/5 p-2 rounded-xl border border-white/5">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span className="truncate">{emp.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 bg-white/5 p-2 rounded-xl border border-white/5">
                                        <Phone className="w-3.5 h-3.5" />
                                        <span>{emp.phone || "---"}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/5 w-full flex items-center justify-between text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                                    <span>Joined {format(new Date(emp.joiningDate), "MMM yyyy")}</span>
                                    <span className="bg-blue-500 text-white px-2 py-0.5 rounded-lg">{emp.employeeId}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-[#1a1d23] border border-white/5 rounded-[32px] overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-8 py-5">Employee</th>
                                <th className="px-8 py-5">Role & Dept</th>
                                <th className="px-8 py-5">Contact</th>
                                <th className="px-8 py-5">Joining Date</th>
                                <th className="px-8 py-5 text-right w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-bold text-blue-400">
                                                {emp.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-200">{emp.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{emp.employeeId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-gray-300 font-medium">{emp.jobTitle || "---"}</p>
                                        <p className="text-xs text-gray-500">{emp.department || "General"}</p>
                                    </td>
                                    <td className="px-8 py-5 space-y-1">
                                        <p className="text-xs text-gray-400">{emp.email}</p>
                                        <p className="text-[10px] text-gray-500">{emp.phone || "---"}</p>
                                    </td>
                                    <td className="px-8 py-5 text-gray-400 font-medium">
                                        {format(new Date(emp.joiningDate), "MMM dd, yyyy")}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all">
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
