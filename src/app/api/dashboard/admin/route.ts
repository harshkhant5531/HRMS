import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const today = startOfDay(new Date());

        // 1. Total Employees
        const totalEmployees = await prisma.user.count({
            where: { role: "EMPLOYEE" }
        });

        // 2. Pending Approvals
        const pendingApprovals = await prisma.leaveRequest.count({
            where: { status: "PENDING" }
        });

        // 3. On Leave Today
        const onLeaveToday = await prisma.leaveRequest.count({
            where: {
                status: "APPROVED",
                startDate: { lte: endOfDay(new Date()) },
                endDate: { gte: today },
            }
        });

        // 4. Avg Attendance (Simplified: % of employees checked in today)
        const checkedInToday = await prisma.attendance.count({
            where: {
                date: { gte: today },
                checkIn: { not: null }
            }
        });
        const avgAttendance = totalEmployees > 0 ? Math.round((checkedInToday / totalEmployees) * 100) : 0;

        // 5. Recent Attendance
        const recentAttendance = await prisma.attendance.findMany({
            where: { date: { gte: today } },
            take: 5,
            orderBy: { checkIn: "desc" },
            include: {
                user: {
                    select: { name: true, employeeId: true }
                }
            }
        });

        // 6. Pending Review List
        const pendingReviews = await prisma.leaveRequest.findMany({
            where: { status: "PENDING" },
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { name: true }
                }
            }
        });

        return NextResponse.json({
            totalEmployees,
            pendingApprovals,
            onLeaveToday,
            avgAttendance,
            recentAttendance,
            pendingReviews
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
