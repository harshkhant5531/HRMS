import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const today = startOfDay(new Date());

        // 1. Get Today's Attendance
        const todayAttendance = await prisma.attendance.findFirst({
            where: {
                userId,
                date: { gte: today },
            },
        });

        // 2. Get Leave Stats
        const totalLeaves = 24; // Yearly allowance
        const approvedLeaves = await prisma.leaveRequest.findMany({
            where: {
                userId,
                status: "APPROVED",
            },
        });

        // Calculate days for each approved leave
        let usedDays = 0;
        approvedLeaves.forEach(leave => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
            usedDays += diff;
        });

        const pendingRequests = await prisma.leaveRequest.count({
            where: {
                userId,
                status: "PENDING",
            },
        });

        // 3. Recent Updates (Latest 3 leave request changes)
        const recentUpdates = await prisma.leaveRequest.findMany({
            where: { userId },
            orderBy: { updatedAt: "desc" },
            take: 3,
        });

        return NextResponse.json({
            attendance: todayAttendance || null,
            leaveBalance: totalLeaves - usedDays,
            pendingRequests,
            recentUpdates,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
