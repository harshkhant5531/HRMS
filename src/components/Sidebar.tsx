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
    FileText,
    CreditCard,
    Users,
    Settings,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role;

    const employeeLinks = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
        { name: "Leave Requests", href: "/dashboard/leave", icon: Clock },
        { name: "Payroll", href: "/dashboard/payroll", icon: CreditCard },
        { name: "Profile", href: "/dashboard/profile", icon: User },
    ];

    const adminLinks = [
        { name: "Admin Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Employees", href: "/admin/employees", icon: Users },
        { name: "Recent Attendance", href: "/admin/attendance", icon: CalendarCheck },
        { name: "Leave Approvals", href: "/admin/leave", icon: Clock },
        { name: "Payroll Control", href: "/admin/payroll", icon: CreditCard },
    ];

    const links = role === "ADMIN" ? adminLinks : employeeLinks;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1a1d23] border-r border-white/5 flex flex-col z-50">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic">
                    Dayflow
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <link.icon className={cn("w-5 h-5", isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-300")} />
                                <span className="font-medium">{link.name}</span>
                            </div>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-2">
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-[#1a1d23] flex items-center justify-center text-sm font-bold">
                            {session?.user?.name?.charAt(0) || "U"}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{session?.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate capitalize">{role?.toLowerCase()}</p>
                    </div>
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all group"
                >
                    <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-400" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};
