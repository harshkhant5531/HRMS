"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
    LayoutDashboard,
    User,
    CalendarCheck,
    Clock,
    LogOut,
    CreditCard,
    Users,
    ChevronRight,
    Command
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role;

    const employeeLinks = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
        { name: "Leave Requests", href: "/dashboard/leave", icon: Clock },
        { name: "Payroll Slips", href: "/dashboard/payroll", icon: CreditCard },
        { name: "My Profile", href: "/dashboard/profile", icon: User },
    ];

    const adminLinks = [
        { name: "HR Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Employees", href: "/admin/employees", icon: Users },
        { name: "Attendance Logs", href: "/admin/attendance", icon: CalendarCheck },
        { name: "Leave Approvals", href: "/admin/leave", icon: Clock },
        { name: "Payroll Admin", href: "/admin/payroll", icon: CreditCard },
    ];

    const links = role === "ADMIN" ? adminLinks : employeeLinks;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0c10] border-r border-white/5 flex flex-col z-50">
            <div className="p-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <Command className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                    Dayflow
                </h1>
            </div>

            <div className="px-4 mb-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent w-full" />
            </div>

            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">
                    Main Menu
                </p>
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-white/[0.03] text-white border border-white/5 shadow-sm"
                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.01]"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <link.icon className={cn(
                                    "w-4 h-4 transition-colors",
                                    isActive ? "text-indigo-400" : "text-gray-600 group-hover:text-gray-400"
                                )} />
                                <span className="text-sm font-semibold">{link.name}</span>
                            </div>
                            {isActive && <ChevronRight className="w-3 h-3 text-indigo-400" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 space-y-3">
                <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 group cursor-default transition-all hover:bg-white/[0.04]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-500/10">
                            {session?.user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{session?.user?.name}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{role}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group font-semibold text-sm"
                >
                    <LogOut className="w-4 h-4 text-gray-600 group-hover:text-red-400" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};
