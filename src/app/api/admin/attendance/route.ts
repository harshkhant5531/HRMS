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

        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get("date");
        const targetDate = dateParam ? new Date(dateParam) : new Date();

        const start = startOfDay(targetDate);
        const end = endOfDay(targetDate);

        const attendances = await prisma.attendance.findMany({
            where: {
                date: {
                    gte: start,
                    lte: end,
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        employeeId: true,
                        jobTitle: true,
                        department: true,
                    }
                }
            },
            orderBy: { checkIn: "desc" }
        });

        return NextResponse.json(attendances);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
