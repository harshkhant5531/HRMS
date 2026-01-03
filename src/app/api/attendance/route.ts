import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { action } = await req.json(); // "check-in" or "check-out"
        const userId = session.user.id;
        const now = new Date();
        const today = startOfDay(now);

        let attendance = await prisma.attendance.findFirst({
            where: {
                userId,
                date: {
                    gte: today,
                    lte: endOfDay(now),
                },
            },
        });

        if (action === "check-in") {
            if (attendance && attendance.checkIn) {
                return NextResponse.json({ message: "Already checked in today" }, { status: 400 });
            }

            if (!attendance) {
                attendance = await prisma.attendance.create({
                    data: {
                        userId,
                        date: today,
                        checkIn: now,
                        status: "PRESENT",
                    },
                });
            } else {
                attendance = await prisma.attendance.update({
                    where: { id: attendance.id },
                    data: { checkIn: now },
                });
            }
        } else if (action === "check-out") {
            if (!attendance || !attendance.checkIn) {
                return NextResponse.json({ message: "Must check in before checking out" }, { status: 400 });
            }
            if (attendance.checkOut) {
                return NextResponse.json({ message: "Already checked out today" }, { status: 400 });
            }

            attendance = await prisma.attendance.update({
                where: { id: attendance.id },
                data: { checkOut: now },
            });
        }

        return NextResponse.json(attendance);
    } catch (error) {
        console.error("Attendance error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const history = searchParams.get("history") === "true";
        const userId = session.user.id;
        const today = startOfDay(new Date());

        if (history) {
            const records = await prisma.attendance.findMany({
                where: { userId },
                orderBy: { date: "desc" },
                take: 10,
            });
            return NextResponse.json(records);
        }

        const attendance = await prisma.attendance.findFirst({
            where: {
                userId,
                date: {
                    gte: today,
                },
            },
        });

        return NextResponse.json(attendance || { checkIn: null, checkOut: null });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
